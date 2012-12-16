define([
    "routed/Router",
    "routed/Route",
    "dojorama/routing-map"
], function (
    Router,
    Route,
    map
) {
    "use strict";
    
    var router = new Router(),
        name = null,
        cb = function () {}
    ;

    for (name in map) {
        if (map.hasOwnProperty(name)) {
            router.addRoute(name, new Route(map[name].schema, cb));
        }
    }

    return router;
});