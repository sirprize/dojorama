/*jslint browser: true */
/*global define: true */

define("dojomat/Session", [
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