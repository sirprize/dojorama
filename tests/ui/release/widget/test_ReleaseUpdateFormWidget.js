require([
    "../../../_util/data/release-creator.js",
    "dojo/on",
    "dojorama/service/release-store",
    "dojorama/ui/release/widget/ReleaseUpdateFormWidget",
    "dojo/domReady!"
], function (
    releaseCreator,
    on,
    releaseStore,
    ReleaseUpdateFormWidget
) {
    "use strict";
    
    var releaseId = releaseCreator.createOne();

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