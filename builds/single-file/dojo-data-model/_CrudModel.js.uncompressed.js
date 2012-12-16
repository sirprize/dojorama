/*global define: true */

define("dojo-data-model/_CrudModel", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/when",
    "./DataModel"
], function (
    declare,
    array,
    lang,
    Deferred,
    when,
    DataModel
) {
    "use strict";

    return declare([DataModel], {

        store: null,
        errorModel: null,
        promiseOrValue: [],

        constructor: function (params) {
            var prop, errorModelProps = {};
            this.store = params.store;

            if (params.errorModel) {
                this.errorModel = params.errorModel;
            } else {
                for (prop in this.props) {
                    if (this.props.hasOwnProperty(prop)) {
                        errorModelProps[prop] = '';
                    }
                }
                this.errorModel = new DataModel({ props: errorModelProps });
            }
        },

        getErrorModel: function () {
            return this.errorModel;
        },

        save: function (options) {
            var deferred = new Deferred(),
                errors = false,
                method = null,
                data = {},
                id = this.get(this.store.idProperty);

            this.errorModel.initialize();

            try {
                this.validate();
            } catch (e) {
                errors = e.errors;
            }

            if (errors) {
                deferred.reject(this.normalizeClientSideValidationErrors(errors));
            } else {
                method = (id === null || id === undefined || id === '') ? 'add' : 'put';
                data = this.serialize();

                if (method === 'add') {
                    delete data[this.store.idProperty];
                }

                this.promiseOrValue.save = this.store[method](data, options);

                when(
                    this.promiseOrValue.save,
                    lang.hitch(this, function (id) {
                        this.set(this.store.idProperty, id);
                        deferred.resolve(this);
                    }),
                    lang.hitch(this, function (error) {
                        deferred.reject(this.normalizeServerError(error));
                    })
                );
            }

            return deferred.promise;
        },

        remove: function (options) {
            var deferred = new Deferred(),
                id = this.get(this.store.idProperty);

            this.errorModel.initialize();
            this.promiseOrValue.remove = this.store.remove(id, options);

            when(
                this.promiseOrValue.remove,
                lang.hitch(this, function () {
                    this.initialize();
                    deferred.resolve(this);
                }),
                lang.hitch(this, function (error) {
                    deferred.reject(this.normalizeServerError(error));
                })
            );

            return deferred.promise;
        },

        normalizeClientSideValidationErrors: function (errors) {
            this.errorModel.set(errors);
            return { code: 'invalid-input' };
        },

        normalizeServerError: function (error) {
            if (!error.response) {
                return { code: 'unknown-error' };
            }

            if (error.response.status === 400) {
                return { code: 'unknown-error' };
            }

            if (error.response.status === 403) {
                return { code: 'forbidden' };
            }

            if (error.response.status === 404) {
                return { code: 'not-found' };
            }

            if (error.response.status === 422) {
                this.normalizeServerSideValidationErrors(error);
                return { code: 'invalid-input' };
            }

            return { code: 'unknown-error' };
        },

        normalizeServerSideValidationErrors: function (error) {
            // stub
        },

        destroy: function () {
            array.forEach(this.promisOrValue, function (promiseOrValue) {
                if (promiseOrValue.cancel) {
                    promiseOrValue.cancel();
                }
            });
        }
    });
});