require([
    "../../../_util/router.js",
    "../../../_util/data/release-creator.js",
    "routed/Request",
    "dojo/on",
    "dojorama/service/release-store",
    "dojorama/ui/release/widget/ReleaseGridWidget",
    "dojo/domReady!"
], function (
    router,
    releaseCreator,
    Request,
    on,
    releaseStore,
    ReleaseGridWidget
) {
    "use strict";
    
    var releaseId = releaseCreator.createOne();

    var w1 = new ReleaseGridWidget({
        router: router,
        request: new Request(''),
        store: releaseStore
    }, 'w1');

    w1.startup();

    on(window, 'unload', function () {
        releaseStore.remove(releaseId);
    });
});