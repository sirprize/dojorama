define("dojorama/ui/storage/widget/RowWidget", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin"
], function (
    declare,
    WidgetBase,
    TemplatedMixin,
    template
) {
    "use strict";
    return declare([WidgetBase, TemplatedMixin], {
        templateString: '<tr><td data-dojo-attach-point="idNode"></td><td data-dojo-attach-point="dataNode"></td></tr>',

        _setIdAttr: function (id) {
            this.idNode.innerHTML = id;
            this._set('id', id);
        },
        
        _setDataAttr: function (data) {
            this.dataNode.innerHTML = data;
            this._set('data', data);
        }
    });
});