var profile = (function () {
    "use strict";
    
    var miniExcludes = {
            "dojorama/package": 1
        },
        amdExcludes = {},
        isTestRe = /\/tests\//,
        isBuildRe = /\/builds\//,
        isVendorRe = /\/vendor\//
    ;

    return {
        resourceTags: {
            test: function (filename, mid) {
                return isTestRe.test(filename);
            },

            miniExclude: function (filename, mid) {
                return isTestRe.test(filename) || isBuildRe.test(filename) || isVendorRe.test(filename) || mid in miniExcludes;
            },

            amd: function (filename, mid) {
                return (/\.js$/).test(filename) && !(mid in amdExcludes);
            },

            copyOnly: function (filename, mid) {
                return false;
            }
        }
    };
})();