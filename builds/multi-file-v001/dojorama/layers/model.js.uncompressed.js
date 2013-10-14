require({cache:{
'dojo-local-storage/LocalStorage':function(){
/*jslint browser: true */
/*global define: true */

define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/json",
    "dojo/store/util/QueryResults",
    "dojo/store/util/SimpleQueryEngine"
], function (
    declare,
    lang,
    json,
    QueryResults,
    SimpleQueryEngine
) {
    "use strict";

    return declare(null, {

        // idProperty: String
        //      Indicates the property to use as the identity property. The values of this
        //      property should be unique.
        idProperty: "id",

        // queryEngine: Function
        //      Defines the query engine to use for querying the data store
        queryEngine: SimpleQueryEngine,

        // subsetProperty: String
        //      Limit this store by configuration to work with a specified subset of objects
        //      Before storing an object, the store adds a property with this name to it
        //      This property is removed upon object retrieval, making this feature transparent to a client
        subsetProperty: null,

        // subsetName: mixed
        //      Define a subset name. See subsetProperty for more information
        subsetName: null,

        constructor: function (options) {
            // summary:
            //      localStorage based object store.
            // options:
            //      This provides any configuration information that will be mixed into the store.
            //      This should generally include the data property to provide the starting set of data.
            lang.mixin(this, options);
            this.setData(this.data || []);
        },

        get: function (id) {
            // summary:
            //      Retrieves an object by its identity
            // id: Number
            //      The key of the key/value pair as stored in localStorage
            //      If not already present, the id is added to the returned object - object[this.idProperty]
            // returns: Object
            //      The value in the store that matches the given id (key).
            var item = localStorage.getItem(id), object = null;

            try {
                object = json.parse(item);
                object[this.idProperty] = id;

                if (this.subsetProperty) {
                    if (object[this.subsetProperty] !== this.subsetName) {
                        return undefined;
                    }

                    delete object[this.subsetProperty];
                }

                return object;
            } catch (e) {
                return undefined;
            }
        },

        getIdentity: function (object) {
            // summary:
            //      Returns an object's identity
            // object: Object
            //      The object to get the identity from
            // returns: Number
            return object[this.idProperty];
        },

        put: function (object, options) {
            // summary:
            //      Stores an object
            // object: Object
            //      The object to store.
            // options: Object?
            //      Additional metadata for storing the data. Includes an "id"
            //      property if a specific id is to be used.
            // returns: Number
            var id = (options && options.id) || object[this.idProperty] || Math.random();

            if (this.subsetProperty) {
                object[this.subsetProperty] = this.subsetName;
            }

            localStorage.setItem(id, json.stringify(object));
            return id;
        },

        add: function (object, options) {
            // summary:
            //      Creates an object, throws an error if the object already exists
            // object: Object
            //      The object to store.
            // options: Object?
            //      Additional metadata for storing the data. Includes an "id"
            //      property if a specific id is to be used.
            // returns: Number
            if (this.get(object[this.idProperty])) {
                throw new Error("Object already exists");
            }

            return this.put(object, options);
        },

        remove: function (id) {
            // summary:
            //      Deletes an object by its identity
            // id: Number
            //      The identity to use to delete the object
            localStorage.removeItem(id);
        },

        query: function (query, options) {
            // summary:
            //      Queries the store for objects.
            // query: Object
            //      The query to use for retrieving objects from the store.
            // options: dojo.store.util.SimpleQueryEngine.__queryOptions?
            //      The optional arguments to apply to the resultset.
            // returns: dojo.store.util.QueryResults
            //      The results of the query, extended with iterative methods.
            //
            // example:
            // Given the following store:
            //
            // | var store = new dojo.store.LocalStorage({
            // | data: [
            // | {id: 1, name: "one", prime: false },
            // | {id: 2, name: "two", even: true, prime: true},
            // | {id: 3, name: "three", prime: true},
            // | {id: 4, name: "four", even: true, prime: false},
            // | {id: 5, name: "five", prime: true}
            // | ]
            // | });
            //
            // ...find all items where "prime" is true:
            //
            // | var results = store.query({ prime: true });
            //
            // ...or find all items where "even" is true:
            //
            // | var results = store.query({ even: true });

            var data = [], i = 0, id = null, item = null;

            for (i = 0; i < localStorage.length; i += 1) {
                id = localStorage.key(i);
                item = this.get(id);

                if (item) {
                    data.push(item);
                }
            }

            return QueryResults(this.queryEngine(query, options)(data));
        },

        setData: function (data) {
            // summary:
            //      Sets the given data as the source for this store, and indexes it
            // data: Object[]
            //      An array of objects to use as the source of data.

            var i = 0, object = null;

            if (data.items) {
                // just for convenience with the data format IFRS expects
                this.idProperty = data.identifier;
                data = this.data = data.items;
            }

            for (i = 0; i < data.length; i += 1) {
                object = data[i];
                this.put(object);
            }
        }
    });
});
},
'dojo-data-model/_CrudModel':function(){
/*global define: true */

define([
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
},
'dojo-data-model/DataModel':function(){
/*global define: true */

define([
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
},
'dojo-data-model/ModelStore':function(){
/*global define: true */

define([
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

},
'dojo-data-model/QueryResults':function(){
/*global define: true */

define([
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

},
'dojo-data-model/Observable':function(){
/*global define: true */

define([
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

},
'dojo-data-model/sync':function(){
define([], function () {
    "use strict";

    return function (source, sourceProp, target, targetProp) {
        var s2t = source.watch(sourceProp, function (prop, old, val) {
            if (target.get(targetProp) !== val) {
                target.set(targetProp, val);
            }
        });

        var t2s = target.watch(targetProp, function (prop, old, val) {
            if (source.get(sourceProp) !== val) {
                source.set(sourceProp, val);
            }
        });

        target.set(targetProp, source.get(sourceProp));

        return {
            remove: function () {
                s2t.remove();
                t2s.remove();
            }
        }
    };
});
},
'dojorama/model/ReleaseModel':function(){
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/date/stamp",
    "dojo/json",
    "dojo-data-model/_CrudModel",
    "dojo/i18n!./nls/ReleaseModel"
], function (
    declare,
    array,
    lang,
    stamp,
    json,
    CrudModel,
    nls
) {
    "use strict";

    return declare([CrudModel], {

        props: {
            id: '',
            title: '',
            format: '',
            releaseDate: null,
            price: '',
            publish: false,
            info: ''
        },
        
        releaseDateDeserializer: function (val) {
            this.set('releaseDate', stamp.fromISOString(val));
        },
        
        releaseDateSerializer: function () {
            if (!this.get('releaseDate')) { return null; }
            return stamp.toISOString(this.get('releaseDate'), { selector: 'date' });
        },
        
        releaseDateInitializer: function () {
            this.set('releaseDate', null);
        },
        
        titleValidator: function () {
            if (this.get('title') === undefined || this.get('title').length < 3) {
                throw {
                    message: nls.titleInvalid
                };
            }
        },
        
        normalizeServerSideValidationErrors: function (error) {
            var data = json.parse(error.response.data);
            
            array.forEach(data.errors, lang.hitch(this, function (error) {
                if (this.props[error.field]) {
                    if (error.code === 'missing') {
                        this.errorModel.set(error.field, nls.titleMissing);
                    } else {
                        this.errorModel.set(error.field, nls.titleInvalid);
                    }
                }
            }));
        }
    });
});
},
'*now':function(r){r(['dojo/i18n!*preload*dojorama/layers/nls/model*["ar","ca","cs","da","de","el","en-gb","en-us","es-es","fi-fi","fr-fr","he-il","hu","it-it","ja-jp","ko-kr","nl-nl","nb","pl","pt-br","pt-pt","ru","sk","sl","sv","th","tr","zh-tw","zh-cn","ROOT"]']);}
}});
define("dojorama/layers/model", [], 1);
