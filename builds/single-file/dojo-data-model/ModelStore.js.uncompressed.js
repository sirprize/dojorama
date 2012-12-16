/*global define: true */

define("dojo-data-model/ModelStore", [
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/promise/Promise",
    "dojo/when",
    "./QueryResults"
], function (
    lang,
    Deferred,
    Promise,
    when,
    QueryResults
) {
    "use strict";

    return function (store, ModelClass) {

        var getModelInstance = function () {
            return new ModelClass({ store: store });
        };

        return lang.delegate(store, {
            getModelInstance: getModelInstance,
            get: function () {
                var promiseOrValue = store.get.apply(store, arguments),
                    deferred = null,
                    model = null;

                if (!promiseOrValue) {
                    return null;
                }

                if (!promiseOrValue.then) {
                    model = getModelInstance();
                    model.deserialize(promiseOrValue);
                    return model;
                }

                deferred = new Deferred();

                // intercept callbacks of promise returned by store.get()
                promiseOrValue.then(
                    function (r) {
                        model = getModelInstance();
                        model.deserialize(r);
                        deferred.resolve(model);
                    },
                    function (error) {
                        deferred.reject(error);
                    },
                    function (update) {
                        deferred.progress(update);
                    }
                );

                return lang.delegate(new Promise(), deferred.promise); // work around frozen deferred.promise
            },
            query: function () {
                return QueryResults(store.query.apply(store, arguments), getModelInstance);
            },
            put: function (model, options) {
                return store.put(model.serialize(), options);
            },
            add: function (model, options) {
                return store.add(model.serialize(), options);
            }
        });
    };
});
