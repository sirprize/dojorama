require({cache:{
'url:dojorama/ui/_global/widget/template/ActionsWidget.html':"<ul class=\"nav nav-pills\"></ul>"}});
/*jshint strict:false */

define("dojorama/ui/_global/widget/ActionsWidget", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_StateAware",
    "../mixin/_ToggleMixin",
    "dojo/on",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/text!./template/ActionsWidget.html"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _StateAware,
    _ToggleMixin,
    on,
    lang,
    array,
    domConstruct,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _StateAware, _ToggleMixin], {

        actions: [],
        templateString: template,
        
        constructor: function (params) {
            this.actions = params.actions;
        },

        postCreate: function () {
            this.inherited(arguments);
            this.hide();
            
            array.forEach(this.actions, lang.hitch(this, function (action) {
                var props = (action.active) ? { 'class': 'active' } : {},
                    liNode = domConstruct.create('li', props, this.domNode, 'last'),
                    aNode = domConstruct.create('a', {
                        href: action.url,
                        innerHTML: action.label
                    }, liNode, 'last')
                ;
                
                this.own(on(aNode, 'click', lang.hitch(this, function (ev) {
                    ev.preventDefault();
                    this.pushState(action.url);
                })));
            }));
        }
    });
});