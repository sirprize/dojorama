//>>built
require({cache:{"url:dojorama/ui/release/widget/template/ReleaseCreateFormWidget.html":'\x3cdiv\x3e\n    \x3ch2 data-dojo-attach-point\x3d"titleNode"\x3e\x3c/h2\x3e\x3chr\x3e\n    \x3cdiv data-dojo-attach-point\x3d"formNode"\x3e\x3c/div\x3e\n\x3c/div\x3e'}});
define("dojorama/ui/release/widget/ReleaseCreateFormWidget","dojo/_base/declare mijit/_WidgetBase mijit/_TemplatedMixin ../../_global/mixin/_ToggleMixin ./snippet/ReleaseFormSnippet dojo/_base/lang dojo/aspect dojo/topic dojo/dom-style dojo/text!./template/ReleaseCreateFormWidget.html dojo/i18n!./nls/ReleaseCreateFormWidget".split(" "),function(e,f,g,h,k,b,l,m,p,n,c){return e([f,g,h],{store:null,templateString:n,formSnippet:null,constructor:function(a){this.inherited(arguments);this.store=a.store},
postCreate:function(){this.titleNode.innerHTML=c.title;var a=this.store.getModelInstance();this.inherited(arguments);this.hide();this.formSnippet=new k({releaseModel:a},this.formNode);this.own(l.after(a,"save",b.hitch(this,function(d){d.then(b.hitch(this,function(){m.publish("ui/release/widget/ReleaseCreateFormWidget/create-ok",{model:a,notification:{message:c.notificationCreateOk,type:"ok"}})}));return d})))},startup:function(){this.inherited(arguments);this.formSnippet.startup();this.formSnippet.show()}})});
//@ sourceMappingURL=ReleaseCreateFormWidget.js.map