define("dojo-form-controls/Select", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/query",
    "dojo/on",
    "./Option",
    "./_FormWidget"
], function (
    declare,
    array,
    lang,
    domConstruct,
    domAttr,
    query,
    on,
    Option,
    _FormWidget
) {
    return declare([_FormWidget], {
        // summary:
        //      Provide widget functionality for an HTML <select> control
        
        multiple: false,
        options: [],
        templateString: '<select name="${name}" data-dojo-attach-point="containerNode"></select>',
        
        _attrToDom: function (attr, value, commands) {
            // summary:
            //      _WidgetBase::_attrToDom() considers 'options' a standard attribute name
            //      for <select> tags and adds the option objects as an attribute to the domNode.
            //      We don't want that
            if (attr !== 'options') {
                this.inherited(arguments);
            }
        },
        
        _fillContent: function () {
            var value = [], option = {}, options = [];
            
            if (this.srcNodeRef && domAttr.has(this.srcNodeRef, 'data-dojo-type')) {
                query("> *", this.srcNodeRef).forEach(function (node) {
                    options[options.length] = {
                        value: node.value,
                        label: node.innerHTML,
                        disabled: domAttr.get(node, 'disabled')
                    }
                    
                    if (node.selected) {
                        value[value.length] = node.value;
                    }
                });
                
                if (!domAttr.get(this.srcNodeRef, 'multiple')) {
                    value = value.length ? value[value.length - 1] : '';
                }
                
                this.set('options', options);
                this.set('value', value);
            }
        },
        
        postCreate: function () {
            this.inherited(arguments);
            
            this.own(on(this.domNode, 'change', lang.hitch(this, function (e) {
                this.set('value', this._getValueFromChildren());
            })));
            
            this._loadChildren();
            this._selectChildren();
        },
        
        _setOptionsAttr: function (options) {
            this._set('options', options);
            
            if (this._created) {
                this._loadChildren();
                this._selectChildren();
            }
        },
        
        _setValueAttr: function (value) {
            this._set('value', value);
            
            if (this._created) {
                this._selectChildren();
            }
            
            this._handleOnChange(value);
        },
        
        _setRequiredAttr: function (value) {
            var required = (value && !this.get('disabled')) ? 'true' : 'false';
            domAttr.set(this.domNode, { 'required': required, 'aria-required': required});
            this._set('required', value);
        },
        
        _loadChildren: function () {
            array.forEach(this.getChildren(), function (child) {
                child.destroyRecursive();
            });
            
            array.forEach(this.get('options'), lang.hitch(this, function (option) {
                var widget = new Option({
                    value: option.value,
                    label: option.label,
                    disabled: option.disabled || false
                });
                
                widget.placeAt(this.domNode, 'last');
                widget.startup();
            }));
        },
        
        _selectChildren: function () {
            array.forEach(this.getChildren(), lang.hitch(this, function (child) {
                this._selectChild(child)
            }));
        },

        _selectChild: function (child) {
            // summary:
            //      Set the selected="" attribute on an <option> widget
            var selected = false, value = this.get('value');
            
            if (lang.isArray(value)) {
                array.forEach(value, function (v) {
                    if (v === child.get('value')) {
                        selected = true;
                    }
                });
            } else {
                if (value === child.get('value')) {
                    selected = true;
                }
            }
            
            child.set('selected', selected);
        },
        
        _getValueFromChildren: function () {
            // summary:
            //      Get the currently selected options
            var vals = [];
            
            if (!this.get('multiple')) {
                return (this.domNode.selectedIndex === -1) ? null : this.domNode.options[this.domNode.selectedIndex].value;
            }
            
            for (x = 0; x < this.domNode.length; x += 1) {
                if (this.domNode[x].selected) {
                    vals[vals.length] = this.domNode[x].value;
                }
            }
            
            return vals;
        }
    });
});