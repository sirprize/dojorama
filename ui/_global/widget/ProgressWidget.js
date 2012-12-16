/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "../mixin/_ToggleMixin",
    "dojo/text!./template/ProgressWidget.html"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _ToggleMixin,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _ToggleMixin], {

        templateString: template,

        postCreate: function () {
            this.inherited(arguments);
            this.hide();
        }
    });
});