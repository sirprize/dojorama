require({cache:{
'url:dojorama/ui/release/template/ReleaseUpdatePage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n    <ul data-dojo-attach-point=\"breadcrumbsNode\"></ul>\n    <h1 data-dojo-attach-point=\"sectionTitleNode\"></h1>\n    <ul data-dojo-attach-point=\"actionsNode\"></ul>\n    <div data-dojo-attach-point=\"notificationNode\"></div>\n    \n    <div class=\"well well-large\">\n        <div data-dojo-attach-point=\"formNode\"></div>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/ui/release/css/ReleaseUpdatePage.css':"body {background: white;}"}});
/*jshint strict:false */

define("dojorama/ui/release/ReleaseUpdatePage", [
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
    "./widget/ReleaseUpdateFormWidget",
    "../../service/release-store",
    "dojo/topic",
    "dojo/_base/lang",
    "dojo/text!./template/ReleaseUpdatePage.html",
    "dojo/text!./css/ReleaseUpdatePage.css",
    "dojo/i18n!./nls/ReleaseUpdatePage"
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
    ReleaseUpdateFormWidget,
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
        notification: null,
        templateString: template,
        formWidget: null,
        releaseStore: null,
        
        constructor: function (params) {
            this.router = params.router;
            this.request = params.request;
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