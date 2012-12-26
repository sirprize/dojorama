define([
    "dojorama/service/release-store",
    "dojo/_base/lang"
], function (
    releaseStore,
    lang
) {
    "use strict";
    
    return {
        createOne: function () {
            var releaseModel = releaseStore.getModelInstance();

            releaseModel.deserialize({
                title: 'Some title',
                format: 'cd',
                releaseDate: '2012-12-21',
                price: 100,
                publish: false,
                info: 'The info'
            });

            releaseModel.save();
            return releaseModel.get('id');
        },
        
        createMany: function (count) {
            var i = 0;
            count = count || 100;
            
            for (i = 0; i < count; i = i + 1) {
                lang.hitch(this, this.createOne)();
            }
        }
    };
});