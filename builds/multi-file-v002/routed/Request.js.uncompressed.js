/*global define: true */

define("routed/Request", [], function () {
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