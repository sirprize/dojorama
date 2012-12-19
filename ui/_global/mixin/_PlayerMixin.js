/*jshint strict:false */

define([
    "dojo/_base/declare",
    "../widget/PlayerWidget"
], function (
    declare,
    PlayerWidget
) {
    return declare([], {
        // summary:
        //      Adds a PlayerWidget to a page-widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="playerNode" in the template

        playerWidget: null,

        postCreate: function () {
            this.inherited(arguments);
            this.playerWidget = new PlayerWidget({
                session: this.session
            }, this.playerNode);
        },

        startup: function () {
            this.inherited(arguments);
            this.playerWidget.startup();
        },
        
        showPlayer: function () {
            this.playerWidget.show();
        }
    });
});