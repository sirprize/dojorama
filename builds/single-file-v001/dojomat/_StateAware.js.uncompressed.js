/*jslint browser: true */
/*global define: true */

define("dojomat/_StateAware", [
    "dojo/_base/declare",
    "dojo/topic"
], function (
    declare,
    topic
) {
    "use strict";

    return declare([], {
        push: function (url) {
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