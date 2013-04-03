/*jslint browser: true */
/*global define: true */

define("dojomat/Application", [
    "routed/Request",
    "routed/Router",
    "dojo/has!dijit?dijit/registry:mijit/registry",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/has",
    "dojo/on",
    "dojo/query",
    "dojo/topic",
    "dojo/dom-construct",
    "./Notification",
    './Session',
    "dojo/domReady!"
], function (
    Request,
    Router,
    registry,
    declare,
    array,
    lang,
    has,
    on,
    query,
    topic,
    domConstruct,
    Notification,
    Session
) {
    "use strict";

    // http://underscorejs.org - _.debounce(function, wait, [immediate])
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    var debounce = function (func, wait, immediate) {
            var timeout;
            return function () {
                var context = this,
                    args = arguments,
                    later = function () {
                        timeout = null;
                        if (!immediate) {
                            func.apply(context, args);
                        }
                    },
                    callNow = immediate && !timeout;

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        },
        
        // Thanks has.js
        registerHasHistory = function () {
            has.add('native-history-state', function (g) {
                return g.history !== undefined && g.history.pushState !== undefined;
            });
        },
        
        // Thanks has.js
        registerHasLocalStorage = function () {
            has.add('native-localstorage', function (g) {
                var supported = false;
                try {
                    supported = g.localStorage !== undefined && g.localStorage.setItem !== undefined;
                } catch (e) {}
                return supported;
            });
        };

    return declare([], {

        router: new Router(),
        session: new Session(),
        notification: new Notification(),
        stylesheetNodes: [],
        cssNode: null,
        pageNodeId: 'page',

        run: function () {
            registerHasHistory();
            registerHasLocalStorage();
            this.setSubscriptions();
            this.registerPopState();
            this.handleState();
        },
        
        setStylesheets: function (stylesheets) {
            var addStylesheet = function (stylesheetNodes, stylesheet) {
                var tag = null,
                    attributes = null,
                    refNode = null,
                    position = null,
                    sn = query('head link[rel=stylesheet]');

                if (!stylesheet || !stylesheet.href) {
                    return;
                }

                if (sn.length) {
                    // place it after the last <link rel="stylesheet">
                    refNode = sn[sn.length - 1];
                    position = 'after';
                } else {
                    // place it before the first <script>
                    refNode = query('head script')[0];
                    position = 'before';
                }

                attributes = {
                    rel: 'stylesheet',
                    media: stylesheet.media || 'all',
                    href: stylesheet.href
                };

                stylesheetNodes[stylesheetNodes.length] = domConstruct.create('link', attributes, refNode, position);
            };
            
            array.forEach(this.stylesheetNodes, function (node) {
                domConstruct.destroy(node);
            });
            
            this.stylesheetNodes  = [];
            
            if (stylesheets && stylesheets.length) {
                array.forEach(stylesheets, lang.hitch(this, function (stylesheet) {
                    addStylesheet(this.stylesheetNodes, stylesheet);
                }));
            } else {
                addStylesheet(this.stylesheetNodes, stylesheets);
            }
        },

        setCss: function (css, media) {
            var css = css || '',
                tag = 'style',
                attributes = { media: media || 'all' },
                refNode = query('head script')[0],
                position = 'before';
                
            if (this.cssNode) {
                domConstruct.destroy(this.cssNode);
            }
            
            // place it before the first <script>
            this.cssNode = domConstruct.create(tag, attributes, refNode, position);

            if (this.cssNode.styleSheet) {
                this.cssNode.styleSheet.cssText = css; // IE
            } else {
                this.cssNode.innerHTML = css; // the others
            }
        },

        setPageNode: function () {
            var tag = 'div',
                attributes = { id: this.pageNodeId },
                refNode = query('body')[0],
                position = 'last';
                
            if (registry.byId(this.pageNodeId)) {
                registry.byId(this.pageNodeId).destroyRecursive();
            }
            
            domConstruct.create(tag, attributes, refNode, position);
        },

        handleState: debounce(function () {
            var route = null, request = new Request(window.location.href);

            this.router.route(request);
            route = this.router.getCurrentRoute();

            if (route) {
                route.run(request);
            } else {
                this.makeNotFoundPage();
            }
        }, 500, true),

        registerPopState: function () {
            on(window, 'popstate', lang.hitch(this, function (ev) {
                this.handleState();
            }));
        },
        
        makePage: function (request, widget, layers, stylesheets) {
            var makePage = function (Page) {
                this.setStylesheets(stylesheets);
                this.setCss();
                this.setPageNode();
                
                var page = new Page({
                    request: request,
                    router: this.router,
                    session: this.session,
                    notification: this.notification.get()
                }, this.pageNodeId);
                
                this.notification.clear();
                page.startup();
            };
            
            if (layers.length) {
                require(layers, lang.hitch(this, function () {
                    require([widget], lang.hitch(this, makePage));
                }));
            }
            else {
                require([widget], lang.hitch(this, makePage));
            }
        },
        
        makeNotFoundPage: function () {
            alert('Page not found');
        },

        makeErrorPage: function (error) {
            alert('An error has occured');
        },

        setSubscriptions: function () {
            topic.subscribe('dojomat/_AppAware/css', lang.hitch(this, function (args) {
                this.setCss(args.css, args.media);
            }));
            
            topic.subscribe('dojomat/_AppAware/stylesheets', lang.hitch(this, function (stylesheets) {
                this.setStylesheets(stylesheets);
            }));

            topic.subscribe('dojomat/_AppAware/title', lang.hitch(this, function (args) {
                window.document.title = args.title;
            }));

            topic.subscribe('dojomat/_AppAware/notification', lang.hitch(this, function (notification) {
                this.notification.set(notification);
            }));

            topic.subscribe('dojomat/_AppAware/error', lang.hitch(this, function (error) {
                this.makeErrorPage(error);
            }));

            topic.subscribe('dojomat/_AppAware/not-found', lang.hitch(this, function () {
                this.makeNotFoundPage();
            }));

            topic.subscribe('dojomat/_StateAware/push-state', lang.hitch(this, function (args) {
                this.pushState(args);
            }));
        },
        
        pushState: function (args) {
            if (!has('native-history-state')) {
                window.location = args.url;
                return;
            }
            
            history.pushState({}, '', args.url);
            this.handleState();
        }
    });
});