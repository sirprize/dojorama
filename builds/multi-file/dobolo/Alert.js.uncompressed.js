require({cache:{
'url:dobolo/templates/Alert.html':"<div class=\"alert\" data-dojo-attach-point=\"containerNode\">\n    <button data-dojo-attach-point=\"closeNode\" class=\"close\">&times;</button>\n    <div data-dojo-attach-point=\"contentNode\"></div>\n</div>"}});
define("dobolo/Alert", [
    './Util',
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojo/query",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/text!./templates/Alert.html"
], function (
    Util,
    declare,
    _WidgetBase,
    _TemplatedMixin,
    query,
    lang,
    on,
    domAttr,
    domClass,
    domStyle,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        
        templateString: template,
        closable: true,
        
        postCreate: function () {
            // summary:
            //      Attach event to dismiss this alert if an immediate child-node has class="close"
            this.inherited(arguments);
            
            if (domAttr.get(this.srcNodeRef, 'data-dojo-type')) {
                // declarative instantiation assumed > hide template stuff
                domStyle.set(this.closeNode, 'display', 'none');
                domStyle.set(this.contentNode, 'display', 'none');
            }
            
            query("> *", this.domNode).forEach(lang.hitch(this, function (node) {
                if (domClass.contains(node, 'close')) {
                    this.own(on(node, 'click', lang.hitch(this, function (ev) {
                        ev.preventDefault();
                        this.close();
                    })));
                }
            }));
        },
        
        close: function () {
            // summary:
            //      Destroy itself after an optional fade transition
            var eventObj = {
                    bubbles: true,
                    cancelable: true
                },
                transition = Util.transition && domClass.contains(this.domNode, 'fade'),
                remove = function () {
                    this.emit('closed', eventObj);
                    this.destroyRecursive();
                };

            this.emit('close', eventObj);
            domClass.remove(this.domNode, 'in');
            
            if (transition) {
                on(this.domNode, Util.transition.end, lang.hitch(this, remove)());
            } else {
                lang.hitch(this, remove)();
            }
        },
        
        _setContentAttr: function (val) {
            this.contentNode.innerHTML = val;
        },
        
        _setClassAttr: function (val) {
            domClass.add(this.domNode, val);
        },
        
        _setClosableAttr: function (val) {
            domStyle.set(this.closeNode, 'display', (val) ? 'block' : 'none');
        }
    });
});