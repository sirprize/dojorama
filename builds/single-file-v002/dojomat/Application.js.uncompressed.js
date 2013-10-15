/*jslint browser: true */
/*global define: true */

define("dojomat/Application", [
    "routed/Request",
    "routed/Router",
    "dojo/has!dijit?dijit/registry:mijit/registry",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/has",
    "dojo/on",
    "dojo/dom",
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
    lang,
    has,
    on,
    dom,
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

        lastRequest: null,
        router: new Router(),
        session: new Session(),
        notification: new Notification(),
        cssNodes: {},
        domNode: null,

        constructor: function(params, domNodeOrId) {
            lang.mixin(this, params);
            this.domNode = dom.byId(domNodeOrId);
        },

        run: function () {
            registerHasHistory();
            registerHasLocalStorage();
            this.setSubscriptions();
            this.registerPopState();
            this.handleState();
        },

        clearCss: function () {
            var media;

            for (media in this.cssNodes) {
                if (this.cssNodes.hasOwnProperty(media)) {
                    domConstruct.destroy(this.cssNodes[media]);
                }
            }

            this.cssNodes = {};
        },
        
        setCss: function (css, media) {
            var css = css || '', media = media || 'all';

            if (!this.cssNodes[media]) {
                this.cssNodes[media] = domConstruct.create(
                    'style',
                    { media: media },
                    query('head')[0],
                    'last'
                );
            }

            if (this.cssNodes[media].styleSheet) {
                this.cssNodes[media].styleSheet.cssText = css; // IE
            } else {
                this.cssNodes[media].innerHTML = css; // the others
            }
        },

        prepareDomNode: function () {
            var newDomNode, domNodeId = this.domNode.id;

            if (registry.byId(domNodeId)) {
                newDomNode = domConstruct.create(
                    'div',
                    { id: 'new-dojomat-' + domNodeId + '-node' },
                    registry.byId(domNodeId).domNode,
                    'after'
                );

                registry.byId(domNodeId).destroyRecursive();
                this.domNode = newDomNode;
                this.domNode.id = domNodeId;
            }
        },

        handleState: debounce(function () {
            var route = null, request = new Request(window.location.href);

            if (this.lastRequest && this.lastRequest.isSame(window.location.href)) {
                // re-requesting url or hash update - don't reload page
                return;
            }

            this.lastRequest = request;
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
        
        makePage: function (request, widget, layers) {
            var makePage = function (Page) {
                this.clearCss();
                this.prepareDomNode();
                
                var page = new Page({
                    request: request,
                    router: this.router,
                    session: this.session,
                    notification: this.notification.get()
                }, this.domNode);
                
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