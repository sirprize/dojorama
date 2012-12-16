/*global define: true */

define("dojo-data-model/DataModel", [
    "dojo/_base/declare",
    "dojo/Stateful"
], function (
    declare,
    Stateful
) {
    "use strict";

    return declare([Stateful], {
        props: {},

        constructor: function (params) {
            this.props = params.props || this.props;
            this.initialize();
        },

        // load data from storage
        deserialize: function (data) {
            var deserializer = null, prop = null;
            this.initialize();

            for (prop in this.props) {
                if (this.props.hasOwnProperty(prop)) {
                    if (data[prop] !== undefined) {
                        deserializer = this[prop + 'Deserializer'];

                        if (typeof deserializer === 'function') {
                            deserializer.apply(this, [data[prop]]);
                        } else {
                            this.set(prop, data[prop]);
                        }
                    }
                }
            }
        },

        // collect data for starage
        serialize: function () {
            var data = {}, serializer = null, prop = null;

            for (prop in this.props) {
                if (this.props.hasOwnProperty(prop)) {
                    serializer = this[prop + 'Serializer'];

                    if (typeof serializer === 'function') {
                        data[prop] = serializer.apply(this, []);
                    } else {
                        data[prop] = this.get(prop);
                    }
                }
            }

            return data;
        },

        validate: function () {
            var errors = {}, ok = true, validator = null, prop = null;

            for (prop in this.props) {
                if (this.props.hasOwnProperty(prop)) {
                    try {
                        validator = this[prop + 'Validator'];

                        if (typeof validator === 'function') {
                            validator.apply(this, []);
                        }
                    } catch (e) {
                        errors[prop] = e.message;
                        ok = false;
                    }
                }
            }

            if (!ok) {
                throw {
                    errors: errors
                };
            }
        },

        initialize: function () {
            var prop = null;

            for (prop in this.props) {
                if (this.props.hasOwnProperty(prop)) {
                    this.set(prop, this.props[prop]);
                }
            }
        },

        getProps: function () {
            return this.props;
        }
    });
});