/*jslint browser: true */
/*global define: true */

define("dojomat/populateRouter", [
    "routed/Route",
    "dojo/_base/lang"
], function (
    Route,
    lang
) {
    "use strict";
    
    return function (application, map) {
        var name = null,
            makeCallback = function (widgetClass, layers, stylesheets) {
                return function (request) {
                    application.makePage(request, widgetClass, layers, stylesheets);
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
                                map[name].layers || [],
                                map[name].stylesheets
                            )
                        )
                    )
                );
            }
        }
    };
});