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