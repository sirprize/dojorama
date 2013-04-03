//>>built
define("dojomat/_StateAware",["dojo/_base/declare","dojo/topic"],function(a,b){return a([],{push:function(a){b.publish("dojomat/_StateAware/push-state",{url:a});document.body.scrollTop&&(document.body.scrollTop=0);document.documentElement.scrollTop&&(document.documentElement.scrollTop=0)}})});
//@ sourceMappingURL=_StateAware.js.map