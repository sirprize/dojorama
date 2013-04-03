//>>built
define("dojomat/Session",["dojo/_base/declare"],function(b){return b([],{props:{},get:function(a){return this.props[a]},set:function(a,b){this.props[a]=b},destroy:function(a){this.props[a]&&this.props[a].remove&&(this.props[a].remove(),delete this.props[a]);this.props[a]&&this.props[a].destroy&&(this.props[a].destroy(),delete this.props[a])}})});
//@ sourceMappingURL=Session.js.map