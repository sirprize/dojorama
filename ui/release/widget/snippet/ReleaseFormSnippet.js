/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "../../../_global/mixin/_ToggleMixin",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom-style",
    "dojo/keys",
    "../../../_global/widget/ControlGroupWidget",
    "dobolo/Button",
    "dobolo/DatepickerInput",
    "dojo-form-controls/Textbox",
    "dojo-form-controls/Textarea",
    "dojo-form-controls/Checkbox",
    "dojo-form-controls/Select",
    "dojo-data-model/sync",
    "dojo/text!./template/ReleaseFormSnippet.html",
    "dojo/i18n!./nls/ReleaseFormSnippet"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _ToggleMixin,
    array,
    lang,
    domStyle,
    keys,
    ControlGroupWidget,
    Button,
    DatepickerInput,
    Textbox,
    Textarea,
    Checkbox,
    Select,
    sync,
    template,
    nls
) {
    return declare([_WidgetBase, _TemplatedMixin, _ToggleMixin], {

        releaseModel: null,
        templateString: template,
        controlGroupWidgets: {},
        submitButton: null,
        submitButtonTimeoutId: null,
        errorModel: null,
        /*
        constructor: function (params) {
            this.releaseModel = params.releaseModel;
            this.errorModel = this.releaseModel.getErrorModel();
        },
        */
        postCreate: function () {
            this.inherited(arguments);
            this.errorModel = this.releaseModel.getErrorModel();
            this.hide();
            this.build();
        },

        startup: function () {
            var prop = null;
            
            this.inherited(arguments);
            this.submitButton.startup();
            
            for (prop in this.releaseModel.getProps()) {
                if (this.releaseModel.getProps().hasOwnProperty(prop)) {
                    if (this.controlGroupWidgets[prop]) {
                        this.own(sync(this.releaseModel, prop, this.controlGroupWidgets[prop], 'value'));
                        this.own(sync(this.errorModel, prop, this.controlGroupWidgets[prop], 'error'));
                        this.controlGroupWidgets[prop].startup();
                    }
                }
            }
        },

        destroy: function () {
            this.inherited(arguments);
            this.releaseModel.destroy();
            clearTimeout(this.submitButtonTimeoutId);
        },

        _onSubmit: function (ev) {
            ev.preventDefault();
            this.submitButton.loading();
            this.onSubmit();
        },

        onSubmit: function () {
            this.releaseModel.save().then(
                lang.hitch(this, this.cancelSubmitButton),
                lang.hitch(this, this.cancelSubmitButton)
            );
        },

        build: function () {
            // change the default behaviour which only updates the value once the focus is taken off the field
            /*
            var onKeyPress = function (ev) {
                if (ev.keyCode === keys.ENTER) {
                    this.set('value', this.get('displayedValue'));
                }
            }
            */
            this.controlGroupWidgets.title = new ControlGroupWidget({
                label: nls.fieldTitleLabel,
                inputWidget: new Textbox({ 'class': 'form-control' })
            }, this.titleNode);

            this.controlGroupWidgets.format = new ControlGroupWidget({
                label: nls.fieldFormatLabel,
                inputWidget: new Select({
                     'class': 'form-control',
                    options: [
                        { value: "", label: nls.fieldFormatOptionLabel },
                        { value: "cd", label: "Cd" },
                        { value: "vinyl", label: "Vinyl" },
                        { value: "digital", label: "Digital", disabled: true }
                    ]
                })
            }, this.formatNode);

            this.controlGroupWidgets.releaseDate = new ControlGroupWidget({
                label: nls.fieldReleaseDateLabel,
                inputWidget: new DatepickerInput({ 'class': 'form-control' })
            }, this.releaseDateNode);
            
            this.controlGroupWidgets.price = new ControlGroupWidget({
                label: nls.fieldPriceLabel,
                inputWidget: new Textbox({ 'class': 'form-control' })
            }, this.priceNode);

            this.controlGroupWidgets.publish = new ControlGroupWidget({
                label: nls.fieldPublishLabel,
                inputWidget: new Checkbox({}),
                widgetProperty: 'checked'
            }, this.publishNode);

            this.controlGroupWidgets.info = new ControlGroupWidget({
                label: nls.fieldInfoLabel,
                inputWidget: new Textarea({ 'class': 'form-control' })
            }, this.infoNode);

            this.submitButton = new Button({
                type: 'submit',
                label: nls.submitLabel,
                loadingText: nls.submitBusyLabel,
                resetText: nls.submitLabel,
                'class': 'btn btn-primary'
            }, this.submitNode);
        },

        cancelSubmitButton: function () {
            this.submitButton.reset();
            /*
            // hack to make submitButton.cancel() work
            this.submitButtonTimeoutId = setTimeout(lang.hitch(this, function () {
                this.submitButton.reset();
            }), 0);
            */
        }
    });
});