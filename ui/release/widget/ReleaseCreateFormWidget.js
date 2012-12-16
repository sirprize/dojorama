/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "../../_global/mixin/_ToggleMixin",
    "./snippet/ReleaseFormSnippet",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/text!./template/ReleaseCreateFormWidget.html",
    "dojo/i18n!./nls/ReleaseCreateFormWidget"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _ToggleMixin,
    ReleaseFormSnippet,
    lang,
    aspect,
    topic,
    domStyle,
    template,
    nls
) {
    return declare([_WidgetBase, _TemplatedMixin, _ToggleMixin], {

        store: null,
        templateString: template,
        formSnippet: null,
        
        constructor: function (params) {
            this.inherited(arguments);
            this.store = params.store;
        },

        postCreate: function () {
            this.titleNode.innerHTML = nls.title;
            var releaseModel = this.store.getModelInstance();
            
            this.inherited(arguments);
            this.hide();
            this.formSnippet = new ReleaseFormSnippet({ releaseModel: releaseModel }, this.formNode);
            
            this.own(aspect.after(releaseModel, 'save', lang.hitch(this, function (promise) {
                promise.then(
                    lang.hitch(this, function () {
                        topic.publish('ui/release/widget/ReleaseCreateFormWidget/create-ok', {
                            model: releaseModel,
                            notification: {
                                message: nls.notificationCreateOk,
                                type: 'ok'
                            }
                        });
                    }
                ));
                return promise;
            })));
        },

        startup: function () {
            this.inherited(arguments);
            this.formSnippet.startup();
            this.formSnippet.show();
        }
    });
});