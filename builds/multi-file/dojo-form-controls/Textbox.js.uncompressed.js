define("dojo-form-controls/Textbox", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/on",
    "./_FormWidget"
], function (
    declare,
    lang,
    domAttr,
    on,
    _FormValueWidget
) {
    return declare([_FormValueWidget], {
        // summary:
        //      Provide widget functionality for an HTML <input type="text"> control
        
        templateString: '<input ${!nameAttr} type="text" value="${value}" />',
        
        postCreate: function () {
            this.own(on(this.domNode, 'change', lang.hitch(this, function (ev) {
                this.set('value', this.domNode.value);
            })));
        },
        
        _setValueAttr: function(value){
            domAttr.set(this.domNode, 'value', value);
            this._handleOnChange(value);
            this._set("value", value);
        },
        
        _setPlaceholderAttr: function (value) {
            domAttr.set(this.domNode, 'placeholder', value);
            this._set("placeholder", value);
        },
        
        _setAutocompleteAttr: function (value) {
            domAttr.set(this.domNode, 'autocomplete', (value) ? 'on' : 'off');
            this._set("autocomplete", value);
        }
    });
});