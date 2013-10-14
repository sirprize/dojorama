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