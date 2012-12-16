require([
    "doh",
    "../../_util/router.js",
    "routed/Request",
    "mijit/registry",
    'dojorama/ui/release/ReleaseIndexPage',
    "dojo/domReady!"
], function (
    doh,
    router,
    Request,
    registry,
    ReleaseIndexPage
) {
    "use strict";
    
    doh.register("ui/release/ReleaseIndexPage", [
        {
            name: 'Destruction',
            timeout: 10000,
            runTest: function () {
                var d = new doh.Deferred(),
                    request = new Request(''),
                    page = new ReleaseIndexPage({
                        request: request,
                        router: router
                    }, 'page');

                page.startup();

                setTimeout(function () {
                    page.destroy();
                    doh.is(0, registry.length);
                    d.callback(true);
                }, 1000);
                
                return d;
            }
        }
    ]);

    doh.run();
});