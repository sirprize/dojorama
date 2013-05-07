/*jshint strict:false */

define("dojorama/ui/release/widget/ReleaseUpdateFormWidget", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "../../_global/mixin/_ToggleMixin",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/topic",
    "dojo/when",
    "dojo/dom-style",
    "../../_global/widget/ProgressWidget",
    "./snippet/ReleaseFormSnippet",
    "dojo/text!./template/ReleaseUpdateFormWidget.html",
    "dojo/i18n!./nls/ReleaseUpdateFormWidget"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _ToggleMixin,
    lang,
    aspect,
    topic,
    when,
    domStyle,
    ProgressWidget,
    ReleaseFormSnippet,
    template,
    nls
) {
    return declare([_WidgetBase, _TemplatedMixin, _ToggleMixin], {
        
        store: null,
        releaseId: null,
        templateString: template,
        formSnippet: null,
        progressWidget: null,
        
        constructor: function (params) {
            this.releaseId = params.releaseId;
        },

        postscript: function (params) {
            this.inherited(arguments);
            this.store = params.store;
        },

        postCreate: function () {
            this.inherited(arguments);
            this.hide();
            this.progressWidget = new ProgressWidget({}, this.progressNode);
        },

        startup: function () {
            this.inherited(arguments);
            this.progressWidget.startup();
            this.progressWidget.show();
            var promise = this.store.get(this.releaseId);
            
            when(
                promise,
                lang.hitch(this, function (model) {
                    if (!model) { // usage with synchronous store
                        topic.publish('ui/release/widget/ReleaseUpdateFormWidget/load-not-found', {});
                    } else {
                        this.progressWidget.hide();
                        domStyle.set(this.mainNode, 'display', 'block');
                        this.formSnippet = new ReleaseFormSnippet({ releaseModel: model }, this.formNode);
                        
                        this.own(aspect.before(this.formSnippet, 'onSubmit', lang.hitch(this, function () {
                            topic.publish('ui/release/widget/ReleaseUpdateFormWidget/submit', {});
                        })));

                        this.own(aspect.after(model, 'save', lang.hitch(this, function (promise) {
                            promise.then(
                                lang.hitch(this, function () {
                                    this.titleNode.innerHTML = model.get('title');
                                    topic.publish('ui/release/widget/ReleaseUpdateFormWidget/update-ok', {
                                        model: model,
                                        notification: {
                                            message: nls.notificationUpdateOk,
                                            type: 'ok'
                                        }
                                    });
                                }
                            ));
                            return promise;
                        })));
                        
                        this.titleNode.innerHTML = model.get('title');
                        this.formSnippet.startup();
                        this.formSnippet.show();
                        topic.publish('ui/release/widget/ReleaseUpdateFormWidget/load-ok', model);
                    }
                }),
                lang.hitch(this, function (error) {
                    if (error.response.status === 404) {
                        topic.publish('ui/release/widget/ReleaseUpdateFormWidget/load-not-found', {});
                    } else {
                        topic.publish('ui/release/widget/ReleaseUpdateFormWidget/load-error', {});
                    }
                })
            );
        }
    });
});require({cache:{
'url:dojorama/ui/release/widget/template/ReleaseUpdateFormWidget.html':"<div>\n    <div data-dojo-attach-point=\"progressNode\"></div>\n    \n    <div data-dojo-attach-point=\"mainNode\" style=\"display:none\">\n        <h2 data-dojo-attach-point=\"titleNode\"></h2><hr />\n        <div data-dojo-attach-point=\"formNode\"></div>\n    </div>\n</div>"}});
