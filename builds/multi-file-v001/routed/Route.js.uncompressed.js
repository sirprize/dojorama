/*global define: true */

define("routed/Route", [], function () {
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