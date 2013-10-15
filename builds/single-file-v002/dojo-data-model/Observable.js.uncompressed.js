/*global define: true */

define("dojo-data-model/Observable", [
    "dojo/store/Observable"
], function (
    Observable
) {
    "use strict";

    return function (s) {
        var store = Observable(s), oldQuery = store.query;
        store.query = function (query, options) {
            var result = oldQuery(query, options), oldObserve = result.observe;
            result.observe = function (listener, includeObjectUpdates) {
                var l = function (item, removedIndex, insertedIndex) {
                    var model = item;
                    if (!(typeof item.deserialize === 'function')) {
                        model = store.getModelInstance();
                        model.deserialize(item);
                    }
                    return listener(model, removedIndex, insertedIndex);
                };
                return oldObserve(l, includeObjectUpdates);
            };
            return result;
        };
        return store;
    };
});
