define("dojo-form-controls/Option", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojo/dom-attr"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    domAttr
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        // summary:
        //      Provide widget functionality for an HTML <option> control
        
        templateString: '<option></option>',
        value: '',
        label: '',
        selected: false,
        disabled: false,
        
        _setValueAttr: function (value) {
            domAttr.set(this.domNode, 'value', value);
            this._set('value', value);
        },
        
        _setLabelAttr: function (value) {
            this.domNode.innerHTML = value;
            this._set('label', value);
        },
        
        _setSelectedAttr: function (value) {
            if (value && !this.get('disabled')) {
                domAttr.set(this.domNode, 'selected', 'selected');
            } else {
                domAttr.remove(this.domNode, 'selected');
            }
            this._set('selected', value);
        },
        
        _setDisabledAttr: function (value) {
            if (value || this.get('disabled')) {
                domAttr.set(this.domNode, 'disabled', 'true');
            } else {
                domAttr.remove(this.domNode, 'disabled');
            }
            this._set('disabled', (value));
        }
    });
});