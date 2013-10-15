require({cache:{
'dojorama/ui/release/ReleaseCreatePage':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_AppAware",
    "dojomat/_StateAware",
    "../_global/mixin/_NavigationMixin",
    "../_global/mixin/_PlayerMixin",
    "../_global/mixin/_NotificationMixin",
    "../_global/mixin/_FooterMixin",
    "./mixin/_ReleaseBreadcrumbsMixin",
    "./mixin/_ReleaseActionsMixin",
    "./mixin/_ReleaseComponentTitleMixin",
    "../release/widget/ReleaseCreateFormWidget",
    "../../service/release-store",
    "dojo/topic",
    "dojo/_base/lang",
    "dojo/text!./template/ReleaseCreatePage.html",
    "dojo/i18n!./nls/ReleaseCreatePage",
    "dojo/text!../../styles/inline/ui/release/ReleaseCreatePage.css"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _AppAware,
    _StateAware,
    _NavigationMixin,
    _PlayerMixin,
    _NotificationMixin,
    _FooterMixin,
    _ReleaseBreadcrumbsMixin,
    _ReleaseActionsMixin,
    _ReleaseComponentTitleMixin,
    ReleaseCreateFormWidget,
    releaseStore,
    topic,
    lang,
    template,
    nls,
    css
) {
    return declare([_WidgetBase, _TemplatedMixin, _AppAware, _StateAware, _NavigationMixin, _PlayerMixin, _NotificationMixin, _FooterMixin, _ReleaseBreadcrumbsMixin, _ReleaseActionsMixin, _ReleaseComponentTitleMixin], {

        router: null,
        request: null,
        session: null,
        templateString: template,
        formWidget: null,
        releaseStore: null,
        
        constructor: function (params) {
            this.router = params.router;
            this.request = params.request;
            this.session = params.session;
        },

        postCreate: function () {
            this.inherited(arguments);
            this.setCss(css, 'all');
            this.setTitle(nls.pageTitle);
            
            this.formWidget = new ReleaseCreateFormWidget({
                store: releaseStore
            }, this.formNode);
            
            // set breadcrumbs items
            this.setReleaseCreateBreadcrumbsItems();
            
            // set subscriptions
            this.setSubscriptions();
        },

        startup: function () {
            this.inherited(arguments);
            this.showNavigation();
            this.showFooter();
            this.showReleaseBreadcrumbs();
            this.showReleaseActions();
            this.formWidget.startup();
            this.formWidget.show();
        },

        setSubscriptions: function () {
            this.own(topic.subscribe('ui/release/widget/ReleaseCreateFormWidget/create-ok', lang.hitch(this, function (data) {
                this.setNotification(data.notification.message, data.notification.type);
                setTimeout(lang.hitch(this, function () {
                    // give it a bit of time for destruction
                    this.pushState(this.router.getRoute('releaseUpdate').assemble({ id: data.model.get('id') }));
                }), 0);
            })));
        }
    });
});
},
'dojorama/service/release-store':function(){
define(
    require.rawConfig['service/release-store'].deps,
    require.rawConfig['service/release-store'].callback
);
},
'dojorama/ui/release/ReleaseIndexPage':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_AppAware",
    "dojomat/_StateAware",
    "../_global/mixin/_NavigationMixin",
    "../_global/mixin/_PlayerMixin",
    "../_global/mixin/_NotificationMixin",
    "../_global/mixin/_FooterMixin",
    "./mixin/_ReleaseBreadcrumbsMixin",
    "./mixin/_ReleaseActionsMixin",
    "./mixin/_ReleaseComponentTitleMixin",
    "./widget/ReleaseGridWidget",
    //"./widget/ReleaseFilterWidget",
    "../../service/release-store",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/text!./template/ReleaseIndexPage.html",
    "dojo/i18n!./nls/ReleaseIndexPage",
    "dojo/text!../../styles/inline/ui/release/ReleaseIndexPage.css"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _AppAware,
    _StateAware,
    _NavigationMixin,
    _PlayerMixin,
    _NotificationMixin,
    _FooterMixin,
    _ReleaseBreadcrumbsMixin,
    _ReleaseActionsMixin,
    _ReleaseComponentTitleMixin,
    ReleaseGridWidget,
    //ReleaseFilterWidget,
    releaseStore,
    lang,
    topic,
    template,
    nls,
    css
) {
    return declare([_WidgetBase, _TemplatedMixin, _AppAware, _StateAware, _NavigationMixin, _PlayerMixin, _NotificationMixin, _FooterMixin, _ReleaseBreadcrumbsMixin, _ReleaseActionsMixin, _ReleaseComponentTitleMixin], {

        router: null,
        request: null,
        session: null,
        templateString: template,
        //filterWidget: null,
        gridWidget: null,
        
        constructor: function (params) {
            this.router = params.router;
            this.request = params.request;
            this.session = params.session;
        },

        postCreate: function () {
            this.inherited(arguments);
            this.setCss(css, 'all');
            this.setTitle(nls.pageTitle);
            /*
            this.filterWidget = new ReleaseFilterWidget({
                request: this.request,
                router: this.router
            }, this.filterNode);
            */
            this.gridWidget = new ReleaseGridWidget({
                request: this.request,
                router: this.router,
                store: releaseStore
            }, this.gridNode);
            
            // set breadcrumbs items
            this.setReleaseIndexBreadcrumbsItems();
            
            // set subscriptions
            this.setSubscriptions();
        },

        startup: function () {
            this.inherited(arguments);
            this.showNavigation();
            this.showFooter();
            this.showReleaseBreadcrumbs();
            this.showReleaseActions();
            //this.filterWidget.startup();
            this.gridWidget.startup();
        },
        
        setSubscriptions: function () {
            this.own(topic.subscribe('ui/release/widget/ReleaseGridWidget/unknown-error', lang.hitch(this, function (data) {
                this.showNotification(data.notification);
            })));
            
            this.own(topic.subscribe('ui/release/widget/ReleaseGridWidget/update-ok', lang.hitch(this, function (data) {
                this.showNotification(data.notification);
            })));
            
            this.own(topic.subscribe('ui/release/widget/ReleaseGridWidget/update-error', lang.hitch(this, function (data) {
                this.showNotification(data.notification);
            })));
            
            this.own(topic.subscribe('ui/release/widget/ReleaseGridWidget/delete-ok', lang.hitch(this, function (data) {
                this.showNotification(data.notification);
            })));
            
            this.own(topic.subscribe('ui/release/widget/ReleaseGridWidget/delete-error', lang.hitch(this, function (data) {
                this.showNotification(data.notification);
            })));
        }
    });
});
},
'dojorama/ui/release/ReleaseUpdatePage':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_AppAware",
    "dojomat/_StateAware",
    "../_global/mixin/_NavigationMixin",
    "../_global/mixin/_PlayerMixin",
    "../_global/mixin/_NotificationMixin",
    "../_global/mixin/_FooterMixin",
    "./mixin/_ReleaseBreadcrumbsMixin",
    "./mixin/_ReleaseActionsMixin",
    "./mixin/_ReleaseComponentTitleMixin",
    "./widget/ReleaseUpdateFormWidget",
    "../../service/release-store",
    "dojo/topic",
    "dojo/_base/lang",
    "dojo/text!./template/ReleaseUpdatePage.html",
    "dojo/i18n!./nls/ReleaseUpdatePage",
    "dojo/text!../../styles/inline/ui/release/ReleaseUpdatePage.css"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _AppAware,
    _StateAware,
    _NavigationMixin,
    _PlayerMixin,
    _NotificationMixin,
    _FooterMixin,
    _ReleaseBreadcrumbsMixin,
    _ReleaseActionsMixin,
    _ReleaseComponentTitleMixin,
    ReleaseUpdateFormWidget,
    releaseStore,
    topic,
    lang,
    template,
    nls,
    css
) {
    return declare([_WidgetBase, _TemplatedMixin, _AppAware, _StateAware, _NavigationMixin, _PlayerMixin, _NotificationMixin, _FooterMixin, _ReleaseBreadcrumbsMixin, _ReleaseActionsMixin, _ReleaseComponentTitleMixin], {

        router: null,
        request: null,
        session: null,
        notification: null,
        templateString: template,
        formWidget: null,
        releaseStore: null,
        
        constructor: function (params) {
            this.router = params.router;
            this.request = params.request;
            this.session = params.session;
            this.notification = params.notification;
        },

        postCreate: function () {
            this.inherited(arguments);
            this.setCss(css, 'all');
            
            this.formWidget = new ReleaseUpdateFormWidget({
                store: releaseStore,
                releaseId: this.request.getPathParam('id')
            }, this.formNode);
            
            // set subscriptions
            this.setSubscriptions();
        },

        startup: function () {
            this.inherited(arguments);
            this.showNavigation();
            this.showFooter();
            this.showReleaseActions();
            this.formWidget.startup();
            this.formWidget.show();
        },

        setSubscriptions: function () {
            this.own(topic.subscribe('ui/release/widget/ReleaseUpdateFormWidget/load-ok', lang.hitch(this, function (release) {
                this.setTitle(release.get('title'));
                this.setReleaseUpdateBreadcrumbsItems(release.get('title'));
                this.showReleaseBreadcrumbs();
                
                if (this.notification) {
                    this.showNotification(this.notification);
                }
            })));

            this.own(topic.subscribe('ui/release/widget/ReleaseUpdateFormWidget/load-error', lang.hitch(this, function (error) {
                this.handleError(error);
            })));

            this.own(topic.subscribe('ui/release/widget/ReleaseUpdateFormWidget/load-not-found', lang.hitch(this, function () {
                this.handleNotFound();
            })));
            
            this.own(topic.subscribe('ui/release/widget/ReleaseUpdateFormWidget/submit', lang.hitch(this, function () {
                this.hideNotification();
            })));

            this.own(topic.subscribe('ui/release/widget/ReleaseUpdateFormWidget/update-ok', lang.hitch(this, function (data) {
                this.setTitle(data.model.get('title'));
                this.showNotification(data.notification);
            })));
        }
    });
});
},
'url:dojorama/ui/release/template/ReleaseCreatePage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n    \n    <div class=\"container main\">\n        <ul data-dojo-attach-point=\"breadcrumbsNode\"></ul>\n        <h1 data-dojo-attach-point=\"sectionTitleNode\"></h1>\n        <ul data-dojo-attach-point=\"actionsNode\"></ul><br>\n        <div data-dojo-attach-point=\"notificationNode\"></div>\n    \n        <div class=\"well well-lg\">\n            <div data-dojo-attach-point=\"formNode\"></div>\n        </div>\n    \n        <div data-dojo-attach-point=\"playerNode\"></div>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/styles/inline/ui/release/ReleaseCreatePage.css':"body {background: white;}",
'url:dojorama/ui/release/template/ReleaseIndexPage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n    \n    <div class=\"container main\">\n        <ul data-dojo-attach-point=\"breadcrumbsNode\"></ul>\n        <h1 data-dojo-attach-point=\"sectionTitleNode\"></h1>\n        <ul data-dojo-attach-point=\"actionsNode\"></ul><br>\n        <div data-dojo-attach-point=\"notificationNode\"></div>\n    \n        <div class=\"well well-lg\">\n            <div data-dojo-attach-point=\"gridNode\"></div>\n        </div>\n    \n        <div data-dojo-attach-point=\"playerNode\"></div>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/styles/inline/ui/release/ReleaseIndexPage.css':"body {background: white;}.dgrid {height: auto; border: 0; background: transparent;}.dgrid .dgrid-scroller {position: relative; overflow: visible;}.dgrid .dgrid-scroller {position: relative; max-height: 20em; overflow: auto;}.dgrid-column-selector {width: 3em;}.dgrid-column-publish,.dgrid-column-releaseDate,.dgrid-column-releaseDate input {text-align: right;}.dgrid-cell {border: none;}.dgrid-header,.dgrid-header-row,.dgrid-footer {background: transparent;}.dgrid-selected {background: #eee !important;}.dgrid-row-even {}",
'url:dojorama/ui/release/template/ReleaseUpdatePage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n    \n    <div class=\"container main\">\n        <ul data-dojo-attach-point=\"breadcrumbsNode\"></ul>\n        <h1 data-dojo-attach-point=\"sectionTitleNode\"></h1>\n        <ul data-dojo-attach-point=\"actionsNode\"></ul><br>\n        <div data-dojo-attach-point=\"notificationNode\"></div>\n    \n        <div class=\"well well-lg\">\n            <div data-dojo-attach-point=\"formNode\"></div>\n        </div>\n    \n        <div data-dojo-attach-point=\"playerNode\"></div>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/styles/inline/ui/release/ReleaseUpdatePage.css':"body {background: white;}",
'*now':function(r){r(['dojo/i18n!*preload*dojorama/layers/nls/release-pages*["ar","ca","cs","da","de","el","en-gb","en-us","es-es","fi-fi","fr-fr","he-il","hu","it-it","ja-jp","ko-kr","nl-nl","nb","pl","pt-br","pt-pt","ru","sk","sl","sv","th","tr","zh-tw","zh-cn","ROOT"]']);}
}});
define("dojorama/layers/release-pages", [], 1);
