/*jshint strict:false */

define("dojorama/ui/release/mixin/_ReleaseComponentTitleMixin", [
    "dojo/_base/declare",
    "dojo/i18n!./nls/_ReleaseComponentTitleMixin"
], function (
    declare,
    nls
) {
    return declare([], {
        
        // summary:
        //      Adds the title to a page-widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="sectionTitleNode" in the template

        postCreate: function () {
            this.inherited(arguments);
            this.sectionTitleNode.innerHTML = nls.sectionTitle;
        }
    });
});