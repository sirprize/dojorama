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