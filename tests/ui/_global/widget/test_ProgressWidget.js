require([
    'dojorama/ui/_global/widget/ProgressWidget',
    "dojo/domReady!"
], function (
    ProgressWidget
) {
    "use strict";
    
    var w1 = new ProgressWidget({}, 'w1');

    w1.startup();
    w1.show();
});