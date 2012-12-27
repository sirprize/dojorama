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