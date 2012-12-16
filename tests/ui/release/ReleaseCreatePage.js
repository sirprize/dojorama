require([
    "doh",
    "../../_util/router.js",
    "routed/Request",
    "mijit/registry",
    'dojorama/ui/release/ReleaseCreatePage',
    "dojo/domReady!"
], function (
    doh,
    router,
    Request,
    registry,
    ReleaseCreatePage
) {
    "use strict";
    
    doh.register("ui/release/ReleaseCreatePage", [
        {
            name: 'Destruction',
            timeout: 10000,
            runTest: function () {
                var d = new doh.Deferred(),
                    request = new Request(''),
                    page = new ReleaseCreatePage({
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