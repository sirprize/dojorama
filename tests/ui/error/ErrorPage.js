require([
    "doh",
    "dojorama/tests/_util/router",
    "routed/Request",
    "mijit/registry",
    'dojorama/ui/error/ErrorPage',
    "dojo/domReady!"
], function (
    doh,
    router,
    Request,
    registry,
    ErrorPage
) {
    "use strict";
    
    doh.register("ui/error/ErrorPage", [
        {
            name: 'Destruction',
            timeout: 10000,
            runTest: function () {
                var d = new doh.Deferred(),
                    request = new Request(''),
                    page = new ErrorPage({
                        router: router,
                        error: { message: 'Something bad happened' }
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