require([
    "doh",
    "../../_util/router.js",
    "routed/Request",
    "mijit/registry",
    'dojorama/ui/error/NotFoundPage',
    "dojo/domReady!"
], function (
    doh,
    router,
    Request,
    registry,
    NotFoundPage
) {
    "use strict";
    
    doh.register("page destruction", [
        {
            name: 'all widgets should be destroyed',
            timeout: 10000,
            runTest: function () {
                var d = new doh.Deferred(),
                    request = new Request(''),
                    page = new NotFoundPage({
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