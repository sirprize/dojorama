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