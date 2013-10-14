/*jshint strict:false */

define("dojorama/App", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "routed/Request",
    "dojomat/Application",
    "dojomat/populateRouter",
    "./routing-map",
    "require",
    "dojo/domReady!"
], function (
    declare,
    lang,
    Request,
    Application,
    populateRouter,
    routingMap,
    require
) {
    var trackPage = function (request) {
        var q = request.getQueryString(),
            r = request.getPathname() + ((q !== '') ? '?' : '') + q
        ;
        
        if (window._gaq) {
            window._gaq.push(['_trackPageview', r]);
        }
    };
    
    return declare([Application], {
        
        constructor: function () {
            populateRouter(this, routingMap);
            this.run();
        },

        makeNotFoundPage: function () {
            var request = new Request(window.location.href),
                makePage = function (Page) {
                    this.setStylesheets();
                    this.setCss();
                    this.setPageNode();

                    var page = new Page({
                        request: request,
                        router: this.router
                    }, this.pageNodeId);
                
                    page.startup();
                    this.notification.clear();
                }
            ;
            
            require(['./ui/error/NotFoundPage'], lang.hitch(this, makePage));
            trackPage(request);
        },

        makeErrorPage: function (error) {
            var request = new Request(window.location.href),
                makePage = function (Page) {
                    this.setStylesheets();
                    this.setCss();
                    this.setPageNode();

                    var page = new Page({
                        request: request,
                        router: this.router,
                        error: error
                    }, this.pageNodeId);
                
                    page.startup();
                    this.notification.clear();
                }
            ;

            require(['./ui/error/ErrorPage'], lang.hitch(this, makePage));
            trackPage(request);
        },
        
        makePage: function (request, widget, layers, stylesheets) {
            this.inherited(arguments);
            trackPage(request);
        }
    });
});