/*global define: true */

define("routed/Router", ["./Route"], function (Route) {
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