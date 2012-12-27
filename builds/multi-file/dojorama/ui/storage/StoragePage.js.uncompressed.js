require({cache:{
'url:dojorama/ui/storage/template/StoragePage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n\n    <div class=\"container main\">\n        <ul data-dojo-attach-point=\"breadcrumbsNode\"></ul>\n        \n        <div data-dojo-attach-point=\"mainNode\">\n            <h1>Storage</h1>\n            <!--<button class=\"btn\" data-dojo-attach-event=\"onclick:_onNewObjClick\">New Obj</button>\n            <button class=\"btn\" data-dojo-attach-event=\"onclick:_onRemObjClick\">Remove Obj</button>-->\n            \n            <div class=\"well well-large\">\n                <div style=\"overflow:auto\">\n                    <table class=\"table table-striped local-storage-data\">\n                        <thead>\n                            <th>Id</th>\n                            <th>Data</th>\n                        </thead>\n                        <tbody data-dojo-attach-point=\"tbodyNode\"></tbody>\n                    </table>\n                </div>\n                \n                <button class=\"btn\" data-dojo-attach-event=\"onclick:_onClearClick\">Clear</button>\n            </div>\n        </div>\n    \n        <div data-dojo-attach-point=\"playerNode\"></div>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/styles/inline/ui/storage/StoragePage.css':"body {background: white;}"}});
/*jshint strict:false */

define("dojorama/ui/storage/StoragePage", [
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