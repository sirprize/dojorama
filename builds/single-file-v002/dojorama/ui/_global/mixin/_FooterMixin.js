//>>built
define("dojorama/ui/_global/mixin/_FooterMixin",["dojo/_base/declare","../widget/FooterWidget"],function(a,b){return a([],{footerWidget:null,postCreate:function(){this.inherited(arguments);this.footerWidget=new b({router:this.router},this.footerNode)},startup:function(){this.inherited(arguments);this.footerWidget.startup()},showFooter:function(){this.footerWidget.show()}})});
//@ sourceMappingURL=_FooterMixin.js.map