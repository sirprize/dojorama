define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/query",
    "dojomat/Application",
    "dojomat/populateRouter",
    "./routing-map",
    "require",
    "dojo/domReady!"
], function (
    declare,
    lang,
    array,
    query,
    Application,
    populateRouter,
    routingMap,
    require
) {
    "use strict";
    
    return declare([Application], {
        
        constructor: function () {
            populateRouter(this, routingMap);
            this.run();
        },

        makeNotFoundPage: function () {
            var makePage = function (Page) {
                this.setStylesheets();
                this.setCss();
                this.setPageNode();

                var page = new Page({
                    router: this.router
                }, this.pageNodeId);
                
                page.startup();
                this.notification.clear();
            };
            
            require(['./ui/error/NotFoundPage'], lang.hitch(this, makePage));
        },

        makeErrorPage: function (error) {
            var makePage = function (Page) {
                this.setStylesheets();
                this.setCss();
                this.setPageNode();

                var page = new Page({
                    router: this.router,
                    error: error
                }, this.pageNodeId);
                
                page.startup();
                this.notification.clear();
            };

            require(['./ui/error/ErrorPage'], lang.hitch(this, makePage));
        }
    });
});