/*jshint strict:false */

define([
    "dojo/_base/declare",
    "../../_global/widget/BreadcrumbsWidget",
    "dojo/i18n!./nls/_ReleaseBreadcrumbsMixin"
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
            
            this.breadcrumbsItems.releaseIndex = {
                label: nls.releaseIndexLabel,
                url: this.router.getRoute('releaseIndex').assemble()
            };
            
            this.breadcrumbsItems.releaseCreate = {
                label: nls.releaseCreateLabel,
                url: this.router.getRoute('releaseCreate').assemble()
            };
        },

        startup: function () {
            this.inherited(arguments);
            this.breadcrumbsWidget.startup();
        },
        
        setReleaseIndexBreadcrumbsItems: function () {
            var items = [
                this.breadcrumbsItems.home,
                this.breadcrumbsItems.releaseIndex
            ];
            
            this.breadcrumbsWidget.set('items', items);
        },
        
        setReleaseCreateBreadcrumbsItems: function () {
            var items = [
                this.breadcrumbsItems.home,
                this.breadcrumbsItems.releaseIndex,
                this.breadcrumbsItems.releaseCreate
            ];
            
            this.breadcrumbsWidget.set('items', items);
        },
        
        setReleaseUpdateBreadcrumbsItems: function (label) {
            var items = [
                this.breadcrumbsItems.home,
                this.breadcrumbsItems.releaseIndex,
                { label: label }
            ];
            
            this.breadcrumbsWidget.set('items', items);
        },
        
        showReleaseBreadcrumbs: function () {
            this.breadcrumbsWidget.show();
        }
    });
});