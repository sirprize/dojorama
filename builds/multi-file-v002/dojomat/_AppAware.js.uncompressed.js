/*jslint browser: true */
/*global define: true */

define("dojomat/_AppAware", [
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