require([
    "../../../_util/router.js",
    'dojorama/ui/_global/widget/NavigationWidget',
    "dojo/domReady!"
], function (
    router,
    NavigationWidget
) {
    "use strict";
    
    var w1 = new NavigationWidget({
            router: router
        }, 'w1');

    w1.startup();
    w1.show();
});