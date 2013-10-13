require({cache:{
'dojorama/ui/storage/widget/RowWidget':function(){
define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin"
], function (
    declare,
    WidgetBase,
    TemplatedMixin,
    template
) {
    "use strict";
    return declare([WidgetBase, TemplatedMixin], {
        templateString: '<tr><td data-dojo-attach-point="idNode"></td><td data-dojo-attach-point="dataNode"></td></tr>',

        _setIdAttr: function (id) {
            this.idNode.innerHTML = id;
            this._set('id', id);
        },
        
        _setDataAttr: function (data) {
            this.dataNode.innerHTML = data;
            this._set('data', data);
        }
    });
});
},
'dojorama/ui/storage/StoragePage':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_AppAware",
    "dojomat/_StateAware",
    "../_global/mixin/_NavigationMixin",
    "../_global/mixin/_PlayerMixin",
    "../_global/mixin/_FooterMixin",
    "./mixin/_StorageBreadcrumbsMixin",
    "dojo-local-storage/LocalStorage",
    "dojo/store/Observable",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/json",
    "dojo/text!./template/StoragePage.html",
    "./widget/RowWidget",
    "dojo/text!../../styles/inline/ui/storage/StoragePage.css"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _AppAware,
    _StateAware,
    _NavigationMixin,
    _PlayerMixin,
    _FooterMixin,
    _StorageBreadcrumbsMixin,
    LocalStorage,
    Observable,
    array,
    lang,
    json,
    template,
    RowWidget,
    css
) {
    return declare([_WidgetBase, _TemplatedMixin, _AppAware, _StateAware, _NavigationMixin, _PlayerMixin, _FooterMixin, _StorageBreadcrumbsMixin], {

        router: null,
        request: null,
        session: null,
        templateString: template,
        store: null,
        observer: null,
        result: null,
        itemWidgets: [],
        
        constructor: function (params) {
            this.router = params.router;
            this.request = params.request;
            this.session = params.session;
            this.store = Observable(new LocalStorage());
        },

        postCreate: function () {
            this.inherited(arguments);
            this.setCss(css, 'all');
            this.setTitle('Storage');
            
            // set breadcrumbs items
            this.setStorageIndexBreadcrumbsItems();
        },
        
        startup: function () {
            this.inherited(arguments);
            this.showNavigation();
            this.showFooter();
            this.fetchItems();
            this.showStorageBreadcrumbs();
        },
        
        fetchItems: function () {
            this.result = this.store.query(
                {},
                { sort: [{ attribute:"id", descending: false }]}
            );
            
            this.destroyItemWidgets();
            
            if (this.observer && this.observer.remove) {
                this.observer.remove();
            }
            
            this.observer = this.result.observe(lang.hitch(this, function (item, removedIndex, insertedIndex) {
                this.fetchItems();
            }, true));
            
            this.result.forEach(lang.hitch(this, function (item) {
                var index = this.itemWidgets.length;
                this.itemWidgets[index] = new RowWidget({}).placeAt(this.tbodyNode);
                this.itemWidgets[index].set('id', this.store.getIdentity(item));
                this.itemWidgets[index].set('data', json.toJson(item));
                this.itemWidgets[index].startup();
            }));
        },
        
        destroyItemWidgets: function () {
            array.forEach(this.itemWidgets, lang.hitch(this, function (itemWidget, idx) {
                itemWidget.destroy();
            }));
            
            this.itemWidgets = [];
        },
        /*
        _onNewObjClick: function (ev) {
            var newItem = {
                id: 'someJsonStringItemId',
                title: 'SomeJsonStringItem'
            };
            
            this.store.add(newItem);
        },
        
        _onRemObjClick: function (ev) {
            this.store.remove('someJsonStringItemId');
        },
        */
        _onClearClick: function (ev) {
            localStorage.clear();
            this.destroyItemWidgets();
        }
    });
});
},
'dojorama/ui/storage/mixin/_StorageBreadcrumbsMixin':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "../../_global/widget/BreadcrumbsWidget",
    "dojo/i18n!./nls/_StorageBreadcrumbsMixin"
], function (
    declare,
    BreadcrumbsWidget,
    nls
) {
    return declare([], {
        
        // summary:
        //      Adds a BreadcrumbsWidget to a page-widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="breadcrumbsNode" in the template
        
        breadcrumbsWidget: null,
        breadcrumbsItems: {},

        postCreate: function () {
            this.inherited(arguments);
            this.breadcrumbsWidget = new BreadcrumbsWidget({}, this.breadcrumbsNode);
            
            this.breadcrumbsItems.home = {
                label: nls.homeLabel,
                url: this.router.getRoute('home').assemble()
            };
            
            this.breadcrumbsItems.storageIndex = {
                label: nls.storageIndexLabel,
                url: this.router.getRoute('storage').assemble()
            };
        },

        startup: function () {
            this.inherited(arguments);
            this.breadcrumbsWidget.startup();
        },
        
        setStorageIndexBreadcrumbsItems: function () {
            var items = [
                this.breadcrumbsItems.home,
                this.breadcrumbsItems.storageIndex
            ];
            
            this.breadcrumbsWidget.set('items', items);
        },
        
        showStorageBreadcrumbs: function () {
            this.breadcrumbsWidget.show();
        }
    });
});
},
'url:dojorama/ui/storage/template/StoragePage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n\n    <div class=\"container main\">\n        <ul data-dojo-attach-point=\"breadcrumbsNode\"></ul>\n        \n        <div data-dojo-attach-point=\"mainNode\">\n            <h1>Storage</h1>\n            <!--<button class=\"btn\" data-dojo-attach-event=\"onclick:_onNewObjClick\">New Obj</button>\n            <button class=\"btn\" data-dojo-attach-event=\"onclick:_onRemObjClick\">Remove Obj</button>-->\n            \n            <div class=\"well well-lg\">\n                <div style=\"overflow:auto\">\n                    <table class=\"table table-striped local-storage-data\">\n                        <thead>\n                            <th>Id</th>\n                            <th>Data</th>\n                        </thead>\n                        <tbody data-dojo-attach-point=\"tbodyNode\"></tbody>\n                    </table>\n                </div>\n                \n                <button class=\"btn\" data-dojo-attach-event=\"onclick:_onClearClick\">Clear</button>\n            </div>\n        </div>\n    \n        <div data-dojo-attach-point=\"playerNode\"></div>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/styles/inline/ui/storage/StoragePage.css':"body {background: white;}",
'*now':function(r){r(['dojo/i18n!*preload*dojorama/layers/nls/storage*["ar","ca","cs","da","de","el","en-gb","en-us","es-es","fi-fi","fr-fr","he-il","hu","it-it","ja-jp","ko-kr","nl-nl","nb","pl","pt-br","pt-pt","ru","sk","sl","sv","th","tr","zh-tw","zh-cn","ROOT"]']);}
}});
define("dojorama/layers/storage", [], 1);
