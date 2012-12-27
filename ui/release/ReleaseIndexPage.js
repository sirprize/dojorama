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