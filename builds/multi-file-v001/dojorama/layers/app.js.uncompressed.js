require({cache:{
'dojomat/_AppAware':function(){
/*jslint browser: true */
/*global define: true */

define([
    "dojo/_base/declare",
    "dojo/topic"
], function (
    declare,
    topic
) {
    "use strict";

    return declare([], {
        setCss: function (css, media) {
            topic.publish('dojomat/_AppAware/css', { css: css, media: media });
        },

        setTitle: function (title) {
            topic.publish('dojomat/_AppAware/title', { title: title });
        },

        setNotification: function (message, type) {
            topic.publish('dojomat/_AppAware/notification', { message: message, type: type });
        },

        handleNotFound: function () {
            topic.publish('dojomat/_AppAware/not-found', {});
        },

        handleError: function (error) {
            topic.publish('dojomat/_AppAware/error', error);
        }
    });
});
},
'dojomat/_StateAware':function(){
/*jslint browser: true */
/*global define: true */

define([
    "dojo/_base/declare",
    "dojo/topic"
], function (
    declare,
    topic
) {
    "use strict";

    return declare([], {
        pushState: function (url) {
            topic.publish('dojomat/_StateAware/push-state', { url: url });
            
            if (document.body.scrollTop) {
                document.body.scrollTop = 0;
            }
            
            if (document.documentElement.scrollTop) {
                document.documentElement.scrollTop = 0;
            }
        }
    });
});
},
'dojomat/Application':function(){
/*jslint browser: true */
/*global define: true */

define([
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
},
'routed/Request':function(){
/*global define: true */

define([], function () {
    "use strict";

    var trim = function (s) {
            return s.replace(/^\s+|\s+$/g, "");
        },

        getPathname = function (url) {
            var pathname = url.split('?')[0].split('#')[0].replace(/\w+:\/\/[\w\d\._\-]*:?\d*/, '');
            return (pathname.match(/^\//)) ? pathname : ''; // only allow absolute urls
        },
        
        getQueryString = function (url) {
            return (url.split('?')[1] || '').split("#")[0];
        },

        getQueryParams = function (url) {
            var queryParams = {},
                queryString = getQueryString(url),
                nameVals = null,
                i = null,
                nameVal = null;

            if (queryString) {
                nameVals = queryString.split('&');

                for (i = 0; i < nameVals.length; i = i + 1) {
                    nameVal = nameVals[i].split('=');
                    queryParams[trim(decodeURIComponent(nameVal[0]))] = trim(decodeURIComponent(nameVal[1]));
                }
            }

            return queryParams;
        };

    return function (url) {
        var pathname = getPathname(trim(decodeURIComponent(url))),
            queryString = getQueryString(url),
            queryParams = getQueryParams(url),
            pathParams = {};

        return {
            getPathname: function () {
                return pathname;
            },

            getQueryString: function () {
                return queryString;
            },
            
            getQueryParams: function () {
                return queryParams;
            },

            getPathParams: function () {
                return pathParams;
            },

            setPathParam: function (name, val) {
                pathParams[name] = val;
            },

            getPathParam: function (name) {
                return pathParams[name] || null;
            },

            getQueryParam: function (name) {
                return queryParams[name] || null;
            },

            isSame: function (url) {
                var name, qp;

                if (pathname !== getPathname(url)) {
                    // pathname is different
                    return false;
                }

                qp = getQueryParams(url);

                for (name in queryParams) {
                    if (queryParams.hasOwnProperty(name) && (qp[name] === undefined || qp[name] !== queryParams[name])) {
                        // param is missing in qp or value is different
                        return false;
                    }
                }

                for (name in qp) {
                    if (qp.hasOwnProperty(name) && (queryParams[name] === undefined || qp[name] !== queryParams[name])) {
                        // param is missing in queryParams or value is different
                        return false;
                    }
                }

                return true;
            },

            debug: function () {
                console.log('getPathname(): ', this.getPathname());
                console.log('getQueryParams(): ', this.getQueryParams());
                console.log('getPathParams(): ', this.getPathParams());
            }
        };
    };
});
},
'routed/Router':function(){
/*global define: true */

define(["./Route"], function (Route) {
    "use strict";

    return function (routeMap) {
        var currentRouteName = null,
            routes = [],
            mapItemName = null,

            addRoute = function (mapItemName, route) {
                routes[mapItemName] = route;
            };

        for (mapItemName in routeMap) {
            if (routeMap.hasOwnProperty(mapItemName)) {
                addRoute(mapItemName, routeMap[mapItemName]);
            }
        }

        return {
            addRoute: function (mapItemName, route) {
                addRoute(mapItemName, route);
            },

            route: function (request) {
                var routeName, paramName, routeParams = [];

                for (routeName in routes) {
                    if (routes.hasOwnProperty(routeName)) {
                        // find a matching route to the current PATH_INFO
                        routeParams = routes[routeName].match(request.getPathname());
                        if (routeParams) {
                            // route found
                            currentRouteName = routeName;
                            for (paramName in routeParams) {
                                if (routeParams.hasOwnProperty(paramName)) {
                                    // inject returning values to the request object.
                                    request.setPathParam(paramName, routeParams[paramName]);
                                }
                            }
                            return request;
                        }
                    }
                }
                return null;
            },

            getCurrentRoute: function () {
                return routes[currentRouteName] || null;
            },

            getCurrentRouteName: function () {
                return currentRouteName;
            },

            getRoute: function (name) {
                return routes[name] || undefined;
            }
        };
    };
});
},
'routed/Route':function(){
/*global define: true */

define([], function () {
    "use strict";

    return function (schema, run) {
        return {
            run: run,

            match: function (pathname) {
                var pathParts = pathname.replace(/^\/|\/$/g, "").split('/'),
                    schemaParts = schema.replace(/^\/|\/$/g, "").split('/'),
                    params = {},
                    partIndex = 0,
                    param = null;

                if (pathParts.length !== schemaParts.length) {
                    return false;
                }

                for (partIndex = 0; partIndex < pathParts.length; partIndex += 1) {
                    if (schemaParts[partIndex].match(/^\:(\w*)$/)) {
                        param = schemaParts[partIndex].replace(/^\:(\w*)$/, "$1");
                        params[param] = decodeURIComponent(pathParts[partIndex]);
                    } else if (schemaParts[partIndex] !== decodeURIComponent(pathParts[partIndex])) {
                        return false;
                    }
                }

                return params;
            },

            assemble: function (pathParams, queryParams) {
                var url = '',
                    pathParam = null,
                    part = null,
                    partIndex = 0,
                    schemaParts = schema.replace(/^\/|\/$/g, "").split('/'),
                    queryParam = null,
                    queryPairs = [];

                for (partIndex = 0; partIndex < schemaParts.length; partIndex += 1) {
                    if (schemaParts[partIndex].match(/^\:(\w*)$/)) {
                        pathParam = schemaParts[partIndex].replace(/^\:(\w*)$/, "$1");

                        if (pathParams[pathParam] === undefined) {
                            throw new Error('Missing param "' + pathParam + '" for schema: "' + schema + '"');
                        }

                        part = pathParams[pathParam];
                    } else {
                        part = schemaParts[partIndex];
                    }

                    url += '/' + part;
                }

                if (schema.match(/\/$/)) {
                    url += '/';
                }
                
                if (queryParams) {
                    for (queryParam in queryParams) {
                        if (queryParams.hasOwnProperty(queryParam)) {
                            queryPairs.push(queryParam + '=' + encodeURIComponent(queryParams[queryParam]));
                        }
                    }
                    
                    if (queryPairs.length) {
                        url += '?' + queryPairs.join('&');
                    }
                }

                return url;
            }
        };
    };
});
},
'dojomat/Notification':function(){
/*jslint browser: true */
/*global define: true */

define([
    "dojo/_base/declare",
    "dojo/_base/json",
    "dojo/has",
    "dojo/cookie"
], function (
    declare,
    json,
    has,
    cookie
) {
    "use strict";

    return declare([], {
        id: 'dojomat-notification',
        
        get: function () {
            if (has('native-localstorage') && has('native-history-state')) {
                return json.fromJson(localStorage.getItem(this.id));
            }
            return json.fromJson(cookie(this.id));
        },

        clear: function () {
            if (has('native-localstorage') && has('native-history-state')) {
                localStorage.removeItem(this.id);
            } else {
                cookie(this.id, null, { expires: -1, path: '/' });
            }
        },

        set: function (notification) {
            if (has('native-localstorage') && has('native-history-state')) {
                localStorage.setItem(this.id, json.toJson(notification));
            } else {
                cookie(this.id, json.toJson(notification), { expires: 1, path: '/' });
            }
        }
    });
});
},
'dojomat/Session':function(){
/*jslint browser: true */
/*global define: true */

define([
    "dojo/_base/declare"
], function (
    declare
) {
    "use strict";

    return declare([], {
        props: {},
        
        get: function (name) {
            return this.props[name];
        },

        set: function (name, item) {
            this.props[name] = item;
        },
        
        destroy: function (name) {
            if (this.props[name] && this.props[name].remove) {
                this.props[name].remove();
                delete this.props[name];
            }
            
            if (this.props[name] && this.props[name].destroy) {
                this.props[name].destroy();
                delete this.props[name];
            }
        }
    });
});
},
'dojomat/populateRouter':function(){
/*jslint browser: true */
/*global define: true */

define([
    "routed/Route",
    "dojo/_base/lang"
], function (
    Route,
    lang
) {
    "use strict";
    
    return function (application, map) {
        var name = null,
            makeCallback = function (widgetClass, layers) {
                return function (request) {
                    application.makePage(request, widgetClass, layers);
                };
            };

        for (name in map) {
            if (map.hasOwnProperty(name)) {
                application.router.addRoute(
                    name,
                    new Route(
                        map[name].schema,
                        lang.hitch(
                            application,
                            makeCallback(
                                map[name].widget,
                                map[name].layers || []
                            )
                        )
                    )
                );
            }
        }
    };
});
},
'dojorama/routing-map':function(){
define(["dojo/_base/config", "require"], function (config, require) {
    "use strict";
    
    var p = config['routing-map'].pathPrefix,
        l = config['routing-map'].layers || {},
        mid = require.toAbsMid
    ;
    
    return {
        home: {
            schema: p + '',
            widget: mid('./ui/home/HomePage'),
            layers: l.home || []
        },
        storage: {
            schema: p + '/storage',
            widget: mid('./ui/storage/StoragePage'),
            layers: l.storage || []
        },
        releaseIndex: {
            schema: p + '/releases',
            widget: mid('./ui/release/ReleaseIndexPage'),
            layers: l.release || []
        },
        releaseUpdate: {
            schema: p + '/release/:id',
            widget: mid('./ui/release/ReleaseUpdatePage'),
            layers: l.release || []
        },
        releaseCreate: {
            schema: p + '/new-release/',
            widget: mid('./ui/release/ReleaseCreatePage'),
            layers: l.release || []
        }
    };
});
},
'dojorama/App':function(){
/*jshint strict:false */

define([
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
                    this.clearCss();
                    this.prepareDomNode();

                    var page = new Page({
                        request: request,
                        router: this.router
                    }, this.domNode);

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
                    this.clearCss();
                    this.prepareDomNode();

                    var page = new Page({
                        request: request,
                        router: this.router,
                        error: error
                    }, this.domNode);

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
}}});
define("dojorama/layers/app", [], 1);
