require({cache:{
'dojo-form-controls/Button':function(){
define("dojo-form-controls/Button", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dojo/dom-attr",
    "dojo/on",
    "./_FormWidget"
], function (
    declare,
    lang,
    event,
    domAttr,
    on,
    _FormWidget
) {
    return declare([_FormWidget], {
        // summary:
        //      Provide widget functionality for an HTML <button> control
        
        // label: HTML String
        //      Content to display in button.
        label: "",

        // type: [const] String
        //      Type of button (submit, reset, button, checkbox, radio)
        type: "button",
        
        templateString: '<button ${!nameAttr} type="${type}" value="${value}"></button>',
        
        _fillContent: function(srcNodeRef){
            if (srcNodeRef && domAttr.has(srcNodeRef, 'data-dojo-type')) {
                this.set('label', lang.trim(srcNodeRef.innerHTML));
            }
        },
        
        postCreate: function(){
            this.inherited(arguments);
            
            this.own(on(this.domNode, 'click', lang.hitch(this, function (ev) {
                if(this.disabled){
                    event.stop(ev);
                    return false;
                }

                if(this.onClick(ev) === false) {
                    ev.preventDefault();
                }
            })));
        },

        onClick: function(ev){
            return true;
        },

        _setLabelAttr: function(label){
            this.domNode.innerHTML = label;
            this._set("label", label);
        }
    });
});
},
'dojo-form-controls/_FormWidget':function(){
define("dojo-form-controls/_FormWidget", [
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
        
        // name: [const] String
        //      Name used when submitting form; same as "name" attribute or plain HTML elements
        name: "",

        // alt: String
        //      Corresponds to the native HTML `<input>` element's attribute.
        alt: "",

        // value: String
        //      Corresponds to the native HTML `<input>` element's attribute.
        value: "",

        // type: [const] String
        //      Corresponds to the native HTML `<input>` element's attribute.
        type: "text",

        // tabIndex: String
        //      Order fields are traversed when user hits the tab key
        tabIndex: "0",

        // disabled: Boolean
        //      Should this widget respond to user input?
        //      In markup, this is specified as "disabled='disabled'", or just "disabled".
        disabled: false,
        
        postMixInProperties: function(){
            // Setup name=foo string to be referenced from the template (but only if a name has been specified)
            // Unfortunately we can't use _setNameAttr to set the name due to IE limitations, see #8484, #8660.
            // Regarding escaping, see heading "Attribute values" in
            // http://www.w3.org/TR/REC-html40/appendix/notes.html#h-B.3.2
            this.nameAttr = this.name ? ('name="' + this.name.replace(/"/g, "&quot;") + '"') : '';
            this.inherited(arguments);
        },

        _setDisabledAttr: function(value){
            this._set("disabled", value);
            domAttr.set(this.domNode, 'disabled', value);
            domAttr.set(this.domNode, 'aria-disabled', value ? "true" : "false");
        },

        onChange: function() {
            // summary:
            //      Callback when this widget's value is changed.
        },
        
        _onChangeActive: false,
        
        _handleOnChange: function(value){
            if (this._onChangeActive) {
                this.onChange(value);
            }
        },
        
        create: function(){
            this.inherited(arguments);
            this._onChangeActive = true;
        }
    });
});
},
'dojo-form-controls/Checkbox':function(){
define("dojo-form-controls/Checkbox", [
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
    _FormWidget
) {
    return declare([_FormWidget], {
        // summary:
        //      Provide widget functionality for an HTML <input type="checkbox"> control
        
        type: "checkbox",
        value: "on",
        checked: false,
        templateString: '<input ${!nameAttr} type="${type}" value="${value}" ${checkedAttr}/>',
        
        postMixInProperties: function() {
            this.inherited(arguments);
            
            // Need to set initial checked state as part of template, so that form submit works.
            // domAttr.set(node, "checked", bool) doesn't work on IE until node has been attached
            // to <body>, see #8666
            this.checkedAttr = this.checked ? "checked" : "";
        },
        
        _fillContent: function() {
            // summary:
            //      Get checked attribute on IE when instantiating declaratively
            if (this.srcNodeRef && domAttr.has(this.srcNodeRef, 'data-dojo-type')) {
                this.set('checked', !!domAttr.has(this.srcNodeRef, 'checked'));
            }
        },
        
        postCreate: function () {
            this.own(on(this.domNode, 'change', lang.hitch(this, function (ev) {
                this.set('checked', this.domNode.checked);
            })));
        },
        
        _setCheckedAttr: function (value) {
            this.domNode.checked = !!value;
            this._set("checked", !!value);
            this._handleOnChange(this.get('value'));
        },
        
        _setValueAttr: function(value){
            // summary:
            //      During initialization:
            //      sets the value attribute
            //
            //      After initialization:
            //      `widget.set('value', string)` will check the checkbox and change the value
            //      `widget.set('value', boolean)` will change the checked state.
            
            this.domNode.value = !value && value !== 0 ? "on" : value;

            if(typeof value == "string"){
                value = true;
            }
            
            if(this._created){
                this.set('checked', value);
            }
        },
        
        _getValueAttr: function(){
            // summary:
            //      If the Checkbox is checked, returns the value attribute.
            //      Otherwise returns false.
            return this.checked ? this.value : false;
        }
    });
});
},
'dojo-form-controls/Option':function(){
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
},
'dojo-form-controls/Radio':function(){
define("dojo-form-controls/Radio", [
    "dojo/_base/declare",
    "./Checkbox"
], function (
    declare,
    Checkbox
) {
    return declare([Checkbox], {
        // summary:
        //      Provide widget functionality for an HTML <input type="radio"> control
        
        type: "radio"
    });
});
},
'dojo-form-controls/Select':function(){
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
},
'dojo-form-controls/Textarea':function(){
define("dojo-form-controls/Textarea", [
    "dojo/_base/declare",
    "./Textbox"
], function (
    declare,
    Textbox
) {
    return declare([Textbox], {
        
        rows: "3",
        cols: "20",
        templateString: "<textarea ${!nameAttr}></textarea>",

        postMixInProperties: function(){
            // Copy value from srcNodeRef, unless user specified a value explicitly (or there is no srcNodeRef)
            // TODO: parser will handle this in 2.0
            if(!this.value && this.srcNodeRef){
                this.value = this.srcNodeRef.value;
            }
            this.inherited(arguments);
        }
    });
});
},
'dojo-form-controls/Textbox':function(){
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
}}});
define("dojorama/layers/form", [], 1);
