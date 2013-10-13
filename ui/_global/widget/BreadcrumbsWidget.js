/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_StateAware",
    "../mixin/_ToggleMixin",
    "dojo/on",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/text!./template/BreadcrumbsWidget.html"
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

        templateString: template,

        postCreate: function () {
            this.inherited(arguments);
            this.hide();
        },
        
        _setItemsAttr: function (items) {
            var i = 0,
                addItem = function (item) {
                    var liNode = domConstruct.create('li', {}, this.domNode, 'last'),
                        aNode = domConstruct.create('a', {
                            href: item.url,
                            innerHTML: item.label
                        }, liNode, 'last')
                    ;

                    this.own(on(aNode, 'click', lang.hitch(this, function (ev) {
                        ev.preventDefault();
                        this.push(item.url);
                    })));
                }
            ;
            
            // create item nodes:
            // <li><a href="/some-url">Some label</a></li>
            for (i = 0; i < items.length - 1; i = i + 1) {
                lang.hitch(this, addItem)(items[i]);
            }
            
            // create the last item node:
            // <li class="active">Some label</li>
            domConstruct.create('li', {
                'class': 'active',
                innerHTML: items[items.length - 1].label
            }, this.domNode, 'last');
        }
    });
});