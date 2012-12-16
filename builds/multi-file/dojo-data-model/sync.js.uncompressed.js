define("dojo-data-model/sync", [], function () {
    "use strict";

    return function (source, sourceProp, target, targetProp) {
        var s2t = source.watch(sourceProp, function (prop, old, val) {
            if (target.get(targetProp) !== val) {
                target.set(targetProp, val);
            }
        });

        var t2s = target.watch(targetProp, function (prop, old, val) {
            if (source.get(sourceProp) !== val) {
                source.set(sourceProp, val);
            }
        });

        target.set(targetProp, source.get(sourceProp));

        return {
            remove: function () {
                s2t.remove();
                t2s.remove();
            }
        }
    };
});