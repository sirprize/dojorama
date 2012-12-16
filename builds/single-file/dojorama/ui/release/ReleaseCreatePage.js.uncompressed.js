require({cache:{
'url:dojorama/ui/release/template/ReleaseCreatePage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n    <ul data-dojo-attach-point=\"breadcrumbsNode\"></ul>\n    <h1 data-dojo-attach-point=\"sectionTitleNode\"></h1>\n    <ul data-dojo-attach-point=\"actionsNode\"></ul>\n    <div data-dojo-attach-point=\"notificationNode\"></div>\n    \n    <div class=\"well well-large\">\n        <div data-dojo-attach-point=\"formNode\"></div>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/ui/release/css/ReleaseCreatePage.css':"body {background: white;}"}});
/*jshint strict:false */

define("dojorama/ui/release/ReleaseCreatePage", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_AppAware",
    "dojomat/_StateAware",
    "../_global/mixin/_NavigationMixin",
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
    "dojo/text!./css/ReleaseCreatePage.css",
    "dojo/i18n!./nls/ReleaseCreatePage"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _AppAware,
    _StateAware,
    _NavigationMixin,
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
    css,
    nls
) {
    return declare([_WidgetBase, _TemplatedMixin, _AppAware, _StateAware, _NavigationMixin, _NotificationMixin, _FooterMixin, _ReleaseBreadcrumbsMixin, _ReleaseActionsMixin, _ReleaseComponentTitleMixin], {

        router: null,
        request: null,
        templateString: template,
        formWidget: null,
        releaseStore: null,
        
        constructor: function (params) {
            this.router = params.router;
            this.request = params.request;
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
                    this.push(this.router.getRoute('releaseUpdate').assemble({ id: data.model.get('id') }));
                }), 0);
            })));
        }
    });
});