define("dobolo/Button", [
    'dojo/_base/declare',
    'dojo-form-controls/Button',
    'mijit/registry',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/domReady!'
], function (
    declare,
    Button,
    registry,
    array,
    lang,
    domClass,
    domAttr
) {
    return declare([Button], {

        loadingText: 'Loading...',
        resetText: 'Loaded',
        mode: null,
        group: null,
        
        postCreate: function () {
            this.inherited(arguments);
            
            if (this.mode === 'radio' || this.mode === 'checkbox') {
                this.own(this.on('click', lang.hitch(this, function (ev) {
                    this.toggle();
                })));
            }
        },
        
        loading: function () {
            this.domNode.innerHTML = this.loadingText;
            domClass.add(this.domNode, 'disabled');
            domAttr.set(this.domNode, 'disabled', 'disabled');
        },
        
        reset: function () {
            this.domNode.innerHTML = this.resetText;
            domClass.remove(this.domNode, 'disabled');
            domAttr.remove(this.domNode, 'disabled');
        },
        
        toggle: function () {
            if (this.mode === 'radio') { this.deactivateGroup(); }
            domClass.toggle(this.domNode, 'active');
        },
        
        deactivateGroup: function () {
            array.forEach(registry.toArray(), lang.hitch(this, function(widget) {
                if (widget.get('mode') === 'radio' && widget.get('group') === this.group) {
                    domClass.remove(widget.domNode, 'active');
                }
            }));
        }
    });
});