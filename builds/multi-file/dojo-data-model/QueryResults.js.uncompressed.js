/*global define: true */

define("dojo-data-model/QueryResults", [
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/promise/Promise",
    "dojo/when"
], function (
    array,
    lang,
    Deferred,
    Promise,
    when
) {
    "use strict";

    var QueryResults = function (results, modelCreatorCallback) {

        // summary:
        //      A function that wraps the results of a store query with additional
        //      methods.
        // description:
        //      QueryResults behaves just like dojo/store/util/QueryResults and
        //      is a basic wrapper that allows for array-like iteration
        //      over any kind of returned data from a query.  While the simplest store
        //      will return a plain array of data, other stores may return deferreds or
        //      promises; this wrapper makes sure that *all* results can be treated
        //      the same.
        //
        //      Additional methods include `forEach`, `filter` and `map`.
        //      
        //      In constrast to dojo/store/util/QueryResults, this function
        //      initializes model objects for the returned data
        //
        // results: Array|dojo/promise/Promise
        //      The result set as an array, or a promise for an array.
        // returns:
        //      An array-like object that can be used for iterating over.
        // example:
        //      Query a store and iterate over the results.
        //
        //  |   store.query({ prime: true }).forEach(function (item) {
        //  |       //  do something with model class
        //  |   });

        var deferred = null,
            createModels = function (items) {
                var models = [], model = null;

                array.forEach(items, function (item) {
                    model = modelCreatorCallback();
                    model.deserialize(item);
                    models[models.length] = model;
                });

                return models;
            },
            addIterativeMethodToPromise = function (promise, method) {
                promise[method] = function () {
                    var args = arguments;
                    return promise.then(function (items) {
                        Array.prototype.unshift.call(args, createModels(items));
                        return QueryResults(array[method].apply(array, args), modelCreatorCallback);
                    });
                };
            },
            addIterativeMethodToArray = function(models, method) {
                if (!models[method]) {
                    models[method] = function () {
                        var args = arguments;
                        Array.prototype.unshift.call(args, models);
                        return array[method].apply(array, args);
                    };
                }
            }
        ;

        if (!results) {
            return results;
        } else if (!results.then) {
            results = createModels(results);
            addIterativeMethodToArray(results, "forEach");
            addIterativeMethodToArray(results, "filter");
            addIterativeMethodToArray(results, "map");
        } else {
            deferred = new Deferred();

            // intercept callbacks of promise returned by store.query()
            results.then(
                function (r) {
                    deferred.resolve(createModels(r));
                },
                function (error) {
                    deferred.reject(error);
                },
                function (update) {
                    deferred.progress(update);
                }
            );

            results = lang.delegate(new Promise(), deferred.promise); // work around frozen deferred.promise
            addIterativeMethodToPromise(results, "forEach");
            addIterativeMethodToPromise(results, "filter");
            addIterativeMethodToPromise(results, "map");
        }

        if (!results.total) {
            results.total = when(results, function (results) {
                return results.length;
            });
        }
        
        if (results.then && Object.freeze) {
            // don't freeze it - otherwise Observable can't add observe() method
            //Object.freeze(results);
        }

        return results;
    };

    return QueryResults;
});
