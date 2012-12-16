require([
    "doh",
    "../../_util/router.js",
    "routed/Request",
    "mijit/registry",
    'dojorama/ui/release/ReleaseUpdatePage',
    "dojo/domReady!"
], function (
    doh,
    router,
    Request,
    registry,
    ReleaseUpdatePage
) {
    "use strict";
    
    doh.register("ui/release/ReleaseUpdatePage", [
        {
            name: 'Destruction',
            timeout: 10000,
            runTest: function () {
                var d = new doh.Deferred(),
                    request = new Request(''),
                    page = new ReleaseUpdatePage({
                        request: request,
                        router: router
                    }, 'page');

                page.startup();

                setTimeout(function () {
                    page.destroy();
                    doh.is(0, registry.length);
                    d.callback(true);
                }, 5000);
                
                return d;
            }
        }
    ]);

    doh.run();
});