require([
    'doh',
    'dojo/store/JsonRest',
    'dojorama/model/ReleaseModel'
], function (
    doh,
    JsonRest,
    ReleaseModel
) {
    "use strict";
    
    doh.register("model/DataModel", [
        {
            name: 'deserialize()',
            runTest: function () {
                var model = new ReleaseModel({
                    props: { releaseDate: null }
                });

                model.deserialize({
                    releaseDate: '2012-12-21'
                });

                doh.t(typeof model.get('releaseDate') === 'object');
                doh.t(model.get('releaseDate').getFullYear() === 2012);
            }
        },
        {
            name: 'serialize()',
            runTest: function () {
                var model = new ReleaseModel({
                    props: { releaseDate: null }
                });

                model.set('releaseDate', new Date('2012-12-21'));
                doh.t(model.serialize().releaseDate === '2012-12-21');
            }
        },
        {
            name: 'validate()',
            runTest: function () {
                var model = new ReleaseModel({
                        props: { title: null }
                    }),
                    thrown = false;

                try {
                    model.validate();
                } catch (e) {
                    thrown = true;
                    doh.t(e.errors && e.errors.title !== '');
                }

                if (!thrown) {
                    doh.t(false);
                }
            }
        }
    ]);

    doh.register("model/DataModel (create/save() tests)", [
        {
            name: 'Client-Side Validation',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),
                    store = new JsonRest({
                        target: null
                    }),
                    model = new ReleaseModel({
                        store: store
                    });

                model.save().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'invalid-input');
                        d.callback(true);
                    }
                );

                return d;
            }
        }
    ]);

    doh.register("model/DataModel (create/save() tests)", [
        {
            name: 'Created ok',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),
                    store = new JsonRest({
                        target: './ReleaseModel/default/'
                    }),
                    model = new ReleaseModel({
                        store: store
                    }),
                    title = 'Some title';

                model.set({
                    title: title
                });

                model.save().then(
                    function (m) {
                        doh.is(m.get('title'), title);
                        d.callback(true);
                    }
                );

                return d;
            }
        },
        {
            name: 'Invalid input',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),
                    store = new JsonRest({
                        target: './ReleaseModel/invalid/'
                    }),
                    model = new ReleaseModel({
                        store: store
                    });

                model.save().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'invalid-input');
                        d.callback(true);
                    }
                );

                return d;
            }
        }
    ]);

    doh.register("model/DataModel (update/save() tests)", [
        {
            name: 'Updated ok',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),
                    store = new JsonRest({
                        target: './ReleaseModel/default/'
                    }),
                    model = new ReleaseModel({
                        store: store
                    }),
                    title = 'Some title';

                model.set({
                    id: 0,
                    title: title
                });

                model.save().then(
                    function (m) {
                        doh.is(m.get('title'), title);
                        d.callback(true);
                    }
                );

                return d;
            }
        },
        {
            name: 'Not found',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),
                    store = new JsonRest({
                        target: './ReleaseModel/not-found/'
                    }),
                    model = new ReleaseModel({
                        store: store
                    }),
                    title = 'Some title';

                model.set({
                    id: 5,
                    title: title
                });

                model.save().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'not-found');
                        d.callback(true);
                    }
                );

                return d;
            }
        },
        {
            name: 'Invalid input',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),
                    store = new JsonRest({
                        target: './ReleaseModel/invalid/'
                    }),
                    model = new ReleaseModel({
                        store: store
                    });

                model.set({
                    id: 0
                });

                model.save().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'invalid-input');
                        d.callback(true);
                    }
                );

                return d;
            }
        }
    ]);

    doh.register("model/DataModel (remove() tests)", [
        {
            name: 'Removed ok',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),
                    store = new JsonRest({
                         target: './ReleaseModel/default/'
                    }),
                    myModel = new ReleaseModel({ store: store });

                myModel.deserialize({
                    id: 0,
                    title: 'Title 1',
                    releaseDate: '2012-12-21'
                });

                myModel.remove().then(
                    function (model) {
                        doh.t(myModel.get('id') === '');
                        d.callback(true);
                    }
                );

                return d;
            }
        },
        {
            name: 'Not found',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),
                    store = new JsonRest({
                         target: './ReleaseModel/not-found/'
                    }),
                    myModel = new ReleaseModel({ store: store });

                myModel.deserialize({
                    id: 5,
                    title: 'Title 1',
                    releaseDate: '2012-12-21'
                });

                myModel.remove().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'not-found');
                        d.callback(true);
                    }
                );

                return d;
            }
        }
    ]);

    doh.run();
});