define([
    "require",
    "doh/main"
], function (require, doh) {
    "use strict";
    
    if(doh.isBrowser) {
        doh.register("model/ReleaseModel", "../../../../tests/model/ReleaseModel.html", 10000);
        doh.register("ui/error/ErrorPage", "../../../../tests/ui/error/ErrorPage.html", 30000);
        doh.register("ui/error/NotFoundPage", "../../../../tests/ui/error/NotFoundPage.html", 30000);
        doh.register("ui/home/HomePage", "../../../../tests/ui/home/HomePage.html", 30000);
        doh.register("ui/release/ReleaseCreatePage", "../../../../tests/ui/release/ReleaseCreatePage.html", 30000);
        doh.register("ui/release/ReleaseIndexPage", "../../../../tests/ui/release/ReleaseIndexPage.html", 30000);
        doh.register("ui/release/ReleaseUpdatePage", "../../../../tests/ui/release/ReleaseUpdatePage.html", 30000);
	}
});
