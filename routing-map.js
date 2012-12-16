define(["dojo/_base/config", "require"], function (config, require) {
    "use strict";
    
    var p = config['routing-map'].pathPrefix,
        l = config['routing-map'].layers,
        mid = require.toAbsMid
    ;
    
    return {
        home: {
            schema: p + '/',
            widget: mid('./ui/home/HomePage')
        },
        storage: {
            schema: p + '/storage',
            widget: mid('./ui/storage/StoragePage')
        },
        releaseIndex: {
            schema: p + '/releases',
            widget: mid('./ui/release/ReleaseIndexPage'),
            layers: l.release || []
        },
        releaseUpdate: {
            schema: p + '/release/:id',
            widget: mid('./ui/release/ReleaseUpdatePage'),
            layers: l.release || []
        },
        releaseCreate: {
            schema: p + '/new-release/',
            widget: mid('./ui/release/ReleaseCreatePage'),
            layers: l.release || []
        }
    };
});