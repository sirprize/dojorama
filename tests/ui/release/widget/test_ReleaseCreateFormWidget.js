require([
    "dojorama/service/release-store",
    "dojorama/ui/release/widget/ReleaseCreateFormWidget",
    "dojo/domReady!"
], function (
    releaseStore,
    ReleaseCreateFormWidget
) {
    "use strict";
    
    var w1 = new ReleaseCreateFormWidget({
        store: releaseStore
    }, 'w1');

    w1.startup();
    w1.show();
});