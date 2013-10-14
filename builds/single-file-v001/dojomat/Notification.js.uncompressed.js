/*jslint browser: true */
/*global define: true */

define("dojomat/Notification", [
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