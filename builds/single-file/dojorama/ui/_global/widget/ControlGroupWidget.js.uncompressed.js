/*jshint strict:false */

define("dojorama/ui/_global/widget/ControlGroupWidget", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/text!./template/ControlGroupWidget.html"
], function (
    declare,
    lang,
    WidgetBase,
    TemplatedMixin,
    domClass,
    domAttr,
    template
) {
    return declare([WidgetBase, TemplatedMixin], {

        inputWidget: null,
        widgetProperty: 'value',
        value: '',
        label: '',
        error: '',
        templateString: template,
        
        postCreate: function () {
            this.inherited(arguments);
            this.inputWidget.placeAt(this.inputNode);
            this.labelNode.innerHTML = this.label;
            
            this.own(this.watch('value', lang.hitch(this, function (prop, old, val) {
                this.inputWidget.set('value', val);
            })));
            
            this.own(this.inputWidget.watch(this.widgetProperty, lang.hitch(this, function (prop, old, val) {
                this.set('value', val);
            })));
            
            this.inputWidget.set(this.widgetProperty, this.get('value'));
            domAttr.set(this.labelNode, 'for', this.inputWidget.id);
        },

        startup: function () {
            this.inherited(arguments);
            this.inputWidget.startup();
        },

        _setValueAttr: function (value) {
            this._set('value', value);
        },

        _setErrorAttr: function (error) {
            var method = (error) ? 'add' : 'remove';
            domClass[method](this.domNode, 'error');
            this.inlineHelpNode.innerHTML = error;
            this._set("error", error);
        }
    });
});require({cache:{
'url:dojorama/ui/_global/widget/template/ControlGroupWidget.html':"<div class=\"control-group\">\n    <label class=\"control-label\" for=\"inputEmail\" data-dojo-attach-point=\"labelNode\"></label>\n    <div class=\"controls\">\n        <span data-dojo-attach-point=\"inputNode\"></span>\n        <span class=\"help-inline\" data-dojo-attach-point=\"inlineHelpNode\"></span>\n        <span class=\"help-block\" data-dojo-attach-point=\"blockHelpNode\"></span>\n    </div>\n</div>"}});
