dojoConfig['service/release-store'] = {
    deps: [
        'dojo-local-storage/LocalStorage',
        'dojo-data-model/ModelStore',
        '../model/ReleaseModel'
    ],
    callback: function (LocalStorage, ModelStore, ReleaseModel) {
        "use strict";
        return ModelStore(new LocalStorage({
            subsetProperty: 'dojomatSubset',
            subsetName: "release"
        }), ReleaseModel);
    }
};