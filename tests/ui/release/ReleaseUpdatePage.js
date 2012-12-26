require([
    "doh",
    "../../_util/router.js",
    "../../_util/data/release-creator.js",
    "routed/Request",
    "dojomat/Session",
    "mijit/registry",
    "dojorama/service/release-store",
    'dojorama/ui/release/ReleaseUpdatePage',
    "dojo/domReady!"
], function (
    doh,
    router,
    releaseCreator,
    Request,
    Session,
    registry,
    releaseStore,
    ReleaseUpdatePage
) {
    "use strict";
    
    doh.register("page destruction", [
        {
            name: 'all widgets should be destroyed',
            timeout: 10000,
            releaseId: null,
            request: null,
            setUp: function () {
                this.releaseId = releaseCreator.createOne();
                this.request = new Request('');
                this.request.setPathParam('id', this.releaseId);
            },
            runTest: function () {
                var d = new doh.Deferred(),
                    request = this.request,
                    session = new Session(),
                    page = new ReleaseUpdatePage({
                        request: request,
                        session: session,
                        router: router
                    }, 'page');

                page.startup();

                setTimeout(function () {
                    page.destroy();
                    doh.is(0, registry.length);
                    d.callback(true);
                }, 5000);
                
                return d;
            },
            tearDown: function () {
                releaseStore.remove(this.releaseId);
            }
        }
    ]);

    doh.run();
});