define([
    "dojo/_base/declare",
    "dobolo/Alert",
    "dojo/dom-construct"
], function (
    declare,
    Alert,
    domConstruct
) {
    "use strict";
    
    return declare([], {
        // summary:
        //      Creates, shows and hides a dobolo/Alert widget to notify the user of interesting events
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="notificationNode" in the template
        
        alertNode: null,
        alertWidget: null,
        
        showNotification: function (notification) {
            var alertClass = 'alert-info';
            
            if (notification.type === 'ok') {
                alertClass = 'alert-success';
            } else if (notification.type === 'error') {
                alertClass = 'alert-error';
            }
            
            this.hideNotification();
            
            if (this.alertNode) {
                domConstruct.destroy(this.alertNode);
            }
            
            this.alertNode = domConstruct.create('div', {}, this.notificationNode, 'first');
            
            this.alertWidget = new Alert({
                'class': alertClass + ' fade in',
                content: notification.message,
                closable: true
            }, this.alertNode);
            
            this.alertWidget.startup();
        },
        
        hideNotification: function () {
            if (this.alertWidget) {
                this.alertWidget.destroyRecursive();
            }
        }
    });
});