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