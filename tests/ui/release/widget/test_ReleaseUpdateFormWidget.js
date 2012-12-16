require([
    "../../../_util/fixture/release.js",
    "dojo/on",
    "dojorama/service/release-store",
    "dojorama/ui/release/widget/ReleaseUpdateFormWidget",
    "dojo/domReady!"
], function (
    release,
    on,
    releaseStore,
    ReleaseUpdateFormWidget
) {
    "use strict";
    
    var releaseId = release.createOne();

    var w1 = new ReleaseUpdateFormWidget({
        store: releaseStore,
        releaseId: releaseId
    }, 'w1');

    w1.startup();
    w1.show();

    on(window, 'unload', function () {
        releaseStore.remove(releaseId);
    });
});