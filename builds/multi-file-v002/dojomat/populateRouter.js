//>>built
define("dojomat/populateRouter",["routed/Route","dojo/_base/lang"],function(c,e){return function(d,b){var a=null,f=function(a,b){return function(c){d.makePage(c,a,b)}};for(a in b)b.hasOwnProperty(a)&&d.router.addRoute(a,new c(b[a].schema,e.hitch(d,f(b[a].widget,b[a].layers||[]))))}});
//@ sourceMappingURL=populateRouter.js.map