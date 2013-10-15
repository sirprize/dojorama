//>>built
define("dojo-form-controls/Textarea",["dojo/_base/declare","./Textbox"],function(a,b){return a([b],{rows:"3",cols:"20",templateString:"\x3ctextarea ${!nameAttr}\x3e\x3c/textarea\x3e",postMixInProperties:function(){!this.value&&this.srcNodeRef&&(this.value=this.srcNodeRef.value);this.inherited(arguments)}})});
//@ sourceMappingURL=Textarea.js.map