//>>built
define("dojo-data-model/sync",[],function(){return function(a,b,c,d){var f=a.watch(b,function(a,b,e){c.get(d)!==e&&c.set(d,e)}),g=c.watch(d,function(c,d,e){a.get(b)!==e&&a.set(b,e)});c.set(d,a.get(b));return{remove:function(){f.remove();g.remove()}}}});
//@ sourceMappingURL=sync.js.map