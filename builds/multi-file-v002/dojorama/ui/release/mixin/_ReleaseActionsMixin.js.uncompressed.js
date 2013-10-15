/*jshint strict:false */

define("dojorama/ui/release/mixin/_ReleaseActionsMixin", [
    "dojo/_base/declare",
    "../../_global/widget/ActionsWidget",
    "dojo/i18n!./nls/_ReleaseActionsMixin"
], function (
    declare,
    ActionsWidget,
    nls
) {
    return declare([], {
        
        // summary:
        //      Adds a ActionsWidget to a page-widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="actionsNode" in the template
        
        actionsWidget: null,

        postCreate: function () {
            this.inherited(arguments);
            
            this.actionsWidget = new ActionsWidget({
                actions: [
                    {
                        label: nls.indexLabel,
                        url: this.router.getRoute('releaseIndex').assemble(),
                        active: (this.router.getCurrentRouteName() === 'releaseIndex')
                    },
                    {
                        label: nls.createLabel,
                        url: this.router.getRoute('releaseCreate').assemble(),
                        active: (this.router.getCurrentRouteName() === 'releaseCreate')
                    }
                ]
            }, this.actionsNode);
        },

        startup: function () {
            this.inherited(arguments);
            this.actionsWidget.startup();
        },
        
        showReleaseActions: function () {
            this.actionsWidget.show();
        }
    });
});