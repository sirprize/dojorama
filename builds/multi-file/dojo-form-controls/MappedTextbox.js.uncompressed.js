define("dojo-form-controls/MappedTextbox", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojo/dom-construct"
 ], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    domConstruct
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        
        templateString: '<input type="text" data-dojo-attach-point="containerNode"/>',
        name: '',
        valueNode: null, // <input type="hidden"> holding the serialized value
        
        _setNameAttr: function (name) {
            if (this.valueNode) {
                this.valueNode.name = name;
            }
            
            this._set('name', name);
        },
        
        _setValueAttr: function (v) {
            var v = this._parseValue(v),
                oldVal = this.get('value');
            
            if (this.valueNode) {
                this.valueNode.value = this._serializeValue(v);
            }
            
            this.domNode.value = this._formatValue(v);
            this._set('value', v);
            
            if (oldVal !== v) {
                this.onChange(v);
            }
        },
        
        _parseValue: function (v) {
            return v;
        },
        
        _serializeValue: function (v) {
            return v;
        },
        
        _formatValue: function (v) {
            return v;
        },
        
        _attrToDom: function (attr, value, commands) {
            // summary:
            //      the name must be set on the hidden field holding the serialized date to be submitted by a form.
            //      here we make sure that _WidgetBase::_attrToDom() doesn't set it on domNOde
            if (attr !== 'name') {
                this.inherited(arguments);
            }
        },
        
        onChange: function (newValue) {},
        
        _getDisplayValueAttr: function () {
            return this.domNode.value;
        },
        
        startup: function () {
            this.inherited(arguments);
            
            this.valueNode = domConstruct.create('input', {
                type: 'hidden',
                name: this.get('name'),
                value: this._serializeValue(this.get('value'))
            }, this.domNode, 'after');
        },
        
        destroy: function () {
            domConstruct.destroy(this.valueNode);
            this.inherited(arguments);
        }
    });
});