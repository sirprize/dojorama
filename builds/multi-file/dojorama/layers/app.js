//>>built
require({cache:{"dojomat/_AppAware":function(){define("dojomat/_AppAware",["dojo/_base/declare","dojo/topic"],function(g,f){return g([],{setStylesheets:function(a){f.publish("dojomat/_AppAware/stylesheets",a)},setCss:function(a,b){f.publish("dojomat/_AppAware/css",{css:a,media:b})},setTitle:function(a){f.publish("dojomat/_AppAware/title",{title:a})},setNotification:function(a,b){f.publish("dojomat/_AppAware/notification",{message:a,type:b})},handleNotFound:function(){f.publish("dojomat/_AppAware/not-found",
{})},handleError:function(a){f.publish("dojomat/_AppAware/error",a)}})})},"dojomat/_StateAware":function(){define("dojomat/_StateAware",["dojo/_base/declare","dojo/topic"],function(g,f){return g([],{push:function(a){f.publish("dojomat/_StateAware/push-state",{url:a});if(document.body.scrollTop)document.body.scrollTop=0;if(document.documentElement.scrollTop)document.documentElement.scrollTop=0}})})},"dojomat/Application":function(){define("dojomat/Application","routed/Request,routed/Router,mijit/registry,dojo/_base/declare,dojo/_base/array,dojo/_base/lang,dojo/has,dojo/on,dojo/query,dojo/topic,dojo/dom-construct,./Notification,dojo/domReady!".split(","),
function(g,f,a,b,d,c,e,h,j,i,k,l){var m=function(){e.add("native-history-state",function(a){return void 0!==a.history&&void 0!==a.history.pushState})},n=function(){e.add("native-localstorage",function(a){var c=!1;try{c=void 0!==a.localStorage&&void 0!==a.localStorage.setItem}catch(b){}return c})};return b([],{router:new f,notification:new l,stylesheetNodes:[],cssNode:null,pageNodeId:"page",run:function(){m();n();this.setSubscriptions();this.registerPopState();this.handleState()},setStylesheets:function(a){var b=
function(a,b){var c=null,d=null,h=null,c=j("head link[rel=stylesheet]");b&&b.href&&(c.length?(d=c[c.length-1],h="after"):(d=j("head script")[0],h="before"),c={rel:"stylesheet",media:b.media||"all",href:b.href},a[a.length]=k.create("link",c,d,h))};d.forEach(this.stylesheetNodes,function(a){k.destroy(a)});this.stylesheetNodes=[];a&&a.length?d.forEach(a,c.hitch(this,function(a){b(this.stylesheetNodes,a)})):b(this.stylesheetNodes,a)},setCss:function(a,c){var a=a||"",b={media:c||"all"},d=j("head script")[0];
this.cssNode&&k.destroy(this.cssNode);this.cssNode=k.create("style",b,d,"before");this.cssNode.styleSheet?this.cssNode.styleSheet.cssText=a:this.cssNode.innerHTML=a},setPageNode:function(){var c={id:this.pageNodeId},b=j("body")[0];a.byId(this.pageNodeId)&&a.byId(this.pageNodeId).destroyRecursive();k.create("div",c,b,"last")},handleState:function(a,c,b){var d;return function(){var h=this,e=arguments,f=b&&!d;clearTimeout(d);d=setTimeout(function(){d=null;b||a.apply(h,e)},c);f&&a.apply(h,e)}}(function(){var a=
null,c=new g(window.location.href);this.router.route(c);(a=this.router.getCurrentRoute())?a.run(c):this.makeNotFoundPage()},500,!0),registerPopState:function(){h(window,"popstate",c.hitch(this,function(){this.handleState()}))},makePage:function(a,b,d,h){var e=function(c){this.setStylesheets(h);this.setCss();this.setPageNode();c=new c({request:a,router:this.router,notification:this.notification.get()},this.pageNodeId);this.notification.clear();c.startup()};d.length?require(d,c.hitch(this,function(){require([b],
c.hitch(this,e))})):require([b],c.hitch(this,e))},makeNotFoundPage:function(){alert("Page not found")},makeErrorPage:function(){alert("An error has occured")},setSubscriptions:function(){i.subscribe("dojomat/_AppAware/css",c.hitch(this,function(a){this.setCss(a.css,a.media)}));i.subscribe("dojomat/_AppAware/stylesheets",c.hitch(this,function(a){this.setStylesheets(a)}));i.subscribe("dojomat/_AppAware/title",c.hitch(this,function(a){window.document.title=a.title}));i.subscribe("dojomat/_AppAware/notification",
c.hitch(this,function(a){this.notification.set(a)}));i.subscribe("dojomat/_AppAware/error",c.hitch(this,function(a){this.makeErrorPage(a)}));i.subscribe("dojomat/_AppAware/not-found",c.hitch(this,function(){this.makeNotFoundPage()}));i.subscribe("dojomat/_StateAware/push-state",c.hitch(this,function(a){this.pushState(a)}))},pushState:function(a){e("native-history-state")?(history.pushState({},"",a.url),this.handleState()):window.location=a.url}})})},"routed/Request":function(){define("routed/Request",
[],function(){var g=function(a){return a.replace(/^\s+|\s+$/g,"")},f=function(a){a=a.split("?")[0].split("#")[0].replace(/\w+:\/\/[\w\d\._\-]*/,"");return a.match(/^\//)?a:""},a=function(a){var d={},a=a.split("?")[1]||"",c=null,e=null,h=null;if(a){c=a.split("&");for(e=0;e<c.length;e+=1)h=c[e].split("="),d[g(decodeURIComponent(h[0]))]=g(decodeURIComponent(h[1]))}return d};return function(b){var d=f(g(decodeURIComponent(b))),c=a(b),e={};return{getPathname:function(){return d},getQueryParams:function(){return c},
getPathParams:function(){return e},setPathParam:function(a,c){e[a]=c},getPathParam:function(a){return e[a]||null},getQueryParam:function(a){return c[a]||null},isSame:function(b){var e;if(d!==f(b))return!1;b=a(b);for(e in c)if(c.hasOwnProperty(e)&&(void 0===b[e]||b[e]!==c[e]))return!1;for(e in b)if(b.hasOwnProperty(e)&&(void 0===c[e]||b[e]!==c[e]))return!1;return!0},debug:function(){console.log("getPathname(): ",this.getPathname());console.log("getQueryParams(): ",this.getQueryParams());console.log("getPathParams(): ",
this.getPathParams())}}}})},"routed/Router":function(){define("routed/Router",["./Route"],function(){return function(g){var f=null,a=[],b=null;for(b in g)g.hasOwnProperty(b)&&(a[b]=g[b]);return{addRoute:function(b,c){a[b]=c},route:function(b){var c,e,h=[];for(c in a)if(a.hasOwnProperty(c)&&(h=a[c].match(b.getPathname()))){f=c;for(e in h)h.hasOwnProperty(e)&&b.setPathParam(e,h[e]);return b}return null},getCurrentRoute:function(){return a[f]||null},getCurrentRouteName:function(){return f},getRoute:function(b){if(!a[b])throw Error("Route does not exist: "+
b);return a[b]}}}})},"routed/Route":function(){define("routed/Route",[],function(){return function(g,f){return{run:f,match:function(a){var a=a.replace(/^\/|\/$/g,"").split("/"),b=g.replace(/^\/|\/$/g,"").split("/"),d={},c=0,e=null;if(a.length!==b.length)return!1;for(c=0;c<a.length;c+=1)if(b[c].match(/^\:(\w*)$/))e=b[c].replace(/^\:(\w*)$/,"$1"),d[e]=decodeURIComponent(a[c]);else if(b[c]!==decodeURIComponent(a[c]))return!1;return d},assemble:function(a,b){for(var d="",c=null,c=null,e=0,f=g.replace(/^\/|\/$/g,
"").split("/"),j=null,i=[],e=0;e<f.length;e+=1){if(f[e].match(/^\:(\w*)$/)){c=f[e].replace(/^\:(\w*)$/,"$1");if(void 0===a[c])throw Error('Missing param "'+c+'" for schema: "'+g+'"');c=a[c]}else c=f[e];d+="/"+c}g.match(/\/$/)&&(d+="/");if(b){for(j in b)b.hasOwnProperty(j)&&i.push(j+"="+encodeURIComponent(b[j]));i.length&&(d+="?"+i.join("&"))}return d}}}})},"dojomat/Notification":function(){define("dojomat/Notification",["dojo/_base/declare","dojo/_base/json","dojo/has","dojo/cookie"],function(g,f,
a,b){return g([],{id:"dojomat-notification",get:function(){return a("native-localstorage")&&a("native-history-state")?f.fromJson(localStorage.getItem(this.id)):f.fromJson(b(this.id))},clear:function(){a("native-localstorage")&&a("native-history-state")?localStorage.removeItem(this.id):b(this.id,null,{expires:-1,path:"/"})},set:function(d){a("native-localstorage")&&a("native-history-state")?localStorage.setItem(this.id,f.toJson(d)):b(this.id,f.toJson(d),{expires:1,path:"/"})}})})},"dojomat/populateRouter":function(){define("dojomat/populateRouter",
["routed/Route","dojo/_base/lang"],function(g,f){return function(a,b){var d=null,c=function(b,c,d){return function(f){a.makePage(f,b,c,d)}};for(d in b)b.hasOwnProperty(d)&&a.router.addRoute(d,new g(b[d].schema,f.hitch(a,c(b[d].widget,b[d].layers||[],b[d].stylesheets))))}})},"dojorama/routing-map":function(){define("dojorama/routing-map",["dojo/_base/config","require"],function(g,f){var a=g["routing-map"].pathPrefix,b=g["routing-map"].layers,d=f.toAbsMid;return{home:{schema:a+"/",widget:d("./ui/home/HomePage"),
layers:b.home||[]},storage:{schema:a+"/storage",widget:d("./ui/storage/StoragePage"),layers:b.storage||[]},releaseIndex:{schema:a+"/releases",widget:d("./ui/release/ReleaseIndexPage"),layers:b.release||[]},releaseUpdate:{schema:a+"/release/:id",widget:d("./ui/release/ReleaseUpdatePage"),layers:b.release||[]},releaseCreate:{schema:a+"/new-release/",widget:d("./ui/release/ReleaseCreatePage"),layers:b.release||[]}}})},"dojorama/App":function(){define("dojorama/App","dojo/_base/declare,dojo/_base/lang,dojo/_base/array,dojo/query,dojomat/Application,dojomat/populateRouter,./routing-map,require,dojo/domReady!".split(","),
function(g,f,a,b,d,c,e,h){return g([d],{constructor:function(){c(this,e);this.run()},makeNotFoundPage:function(){h(["./ui/error/NotFoundPage"],f.hitch(this,function(a){this.setStylesheets();this.setCss();this.setPageNode();(new a({router:this.router},this.pageNodeId)).startup();this.notification.clear()}))},makeErrorPage:function(a){h(["./ui/error/ErrorPage"],f.hitch(this,function(b){this.setStylesheets();this.setCss();this.setPageNode();(new b({router:this.router,error:a},this.pageNodeId)).startup();
this.notification.clear()}))}})})}}});define("dojorama/layers/app",[],1);