//>>built
require({cache:{"dojo/_base/html":function(){define("./kernel ../dom ../dom-style ../dom-attr ../dom-prop ../dom-class ../dom-construct ../dom-geometry".split(" "),function(a,g,k,l,m,q,n,e){a.byId=g.byId;a.isDescendant=g.isDescendant;a.setSelectable=g.setSelectable;a.getAttr=l.get;a.setAttr=l.set;a.hasAttr=l.has;a.removeAttr=l.remove;a.getNodeProp=l.getNodeProp;a.attr=function(a,c,b){return 2==arguments.length?l["string"==typeof c?"get":"set"](a,c):l.set(a,c,b)};a.hasClass=q.contains;a.addClass=q.add;
a.removeClass=q.remove;a.toggleClass=q.toggle;a.replaceClass=q.replace;a._toDom=a.toDom=n.toDom;a.place=n.place;a.create=n.create;a.empty=function(a){n.empty(a)};a._destroyElement=a.destroy=function(a){n.destroy(a)};a._getPadExtents=a.getPadExtents=e.getPadExtents;a._getBorderExtents=a.getBorderExtents=e.getBorderExtents;a._getPadBorderExtents=a.getPadBorderExtents=e.getPadBorderExtents;a._getMarginExtents=a.getMarginExtents=e.getMarginExtents;a._getMarginSize=a.getMarginSize=e.getMarginSize;a._getMarginBox=
a.getMarginBox=e.getMarginBox;a.setMarginBox=e.setMarginBox;a._getContentBox=a.getContentBox=e.getContentBox;a.setContentSize=e.setContentSize;a._isBodyLtr=a.isBodyLtr=e.isBodyLtr;a._docScroll=a.docScroll=e.docScroll;a._getIeDocumentElementOffset=a.getIeDocumentElementOffset=e.getIeDocumentElementOffset;a._fixIeBiDiScrollLeft=a.fixIeBiDiScrollLeft=e.fixIeBiDiScrollLeft;a.position=e.position;a.marginBox=function(a,c){return c?e.setMarginBox(a,c):e.getMarginBox(a)};a.contentBox=function(a,c){return c?
e.setContentSize(a,c):e.getContentBox(a)};a.coords=function(f,c){a.deprecated("dojo.coords()","Use dojo.position() or dojo.marginBox().");f=g.byId(f);var b=k.getComputedStyle(f),b=e.getMarginBox(f,b),d=e.position(f,c);b.x=d.x;b.y=d.y;return b};a.getProp=m.get;a.setProp=m.set;a.prop=function(a,c,b){return 2==arguments.length?m["string"==typeof c?"get":"set"](a,c):m.set(a,c,b)};a.getStyle=k.get;a.setStyle=k.set;a.getComputedStyle=k.getComputedStyle;a.__toPixelValue=a.toPixelValue=k.toPixelValue;a.style=
function(a,c,b){switch(arguments.length){case 1:return k.get(a);case 2:return k["string"==typeof c?"get":"set"](a,c)}return k.set(a,c,b)};return a})},"dojo/dom-attr":function(){define("exports ./sniff ./_base/lang ./dom ./dom-style ./dom-prop".split(" "),function(a,g,k,l,m,q){function n(a,b){var d=a.getAttributeNode&&a.getAttributeNode(b);return d&&d.specified}var e={innerHTML:1,className:1,htmlFor:g("ie"),value:1},f={classname:"class",htmlfor:"for",tabindex:"tabIndex",readonly:"readOnly"};a.has=
function(a,b){var d=b.toLowerCase();return e[q.names[d]||b]||n(l.byId(a),f[d]||b)};a.get=function(a,b){a=l.byId(a);var d=b.toLowerCase(),r=q.names[d]||b,p=a[r];if(e[r]&&"undefined"!=typeof p||"href"!=r&&("boolean"==typeof p||k.isFunction(p)))return p;d=f[d]||b;return n(a,d)?a.getAttribute(d):null};a.set=function(c,b,d){c=l.byId(c);if(2==arguments.length){for(var r in b)a.set(c,r,b[r]);return c}r=b.toLowerCase();var p=q.names[r]||b,h=e[p];if("style"==p&&"string"!=typeof d)return m.set(c,d),c;if(h||
"boolean"==typeof d||k.isFunction(d))return q.set(c,b,d);c.setAttribute(f[r]||b,d);return c};a.remove=function(a,b){l.byId(a).removeAttribute(f[b.toLowerCase()]||b)};a.getNodeProp=function(a,b){a=l.byId(a);var d=b.toLowerCase(),e=q.names[d]||b;if(e in a&&"href"!=e)return a[e];d=f[d]||b;return n(a,d)?a.getAttribute(d):null}})},"dojo/dom-prop":function(){define("exports ./_base/kernel ./sniff ./_base/lang ./dom ./dom-style ./dom-construct ./_base/connect".split(" "),function(a,g,k,l,m,q,n,e){var f=
{},c=0,b=g._scopeName+"attrid";a.names={"class":"className","for":"htmlFor",tabindex:"tabIndex",readonly:"readOnly",colspan:"colSpan",frameborder:"frameBorder",rowspan:"rowSpan",valuetype:"valueType"};a.get=function(b,f){b=m.byId(b);var c=f.toLowerCase();return b[a.names[c]||f]};a.set=function(d,r,p){d=m.byId(d);if(2==arguments.length&&"string"!=typeof r){for(var h in r)a.set(d,h,r[h]);return d}h=r.toLowerCase();h=a.names[h]||r;if("style"==h&&"string"!=typeof p)return q.set(d,p),d;if("innerHTML"==
h)return k("ie")&&d.tagName.toLowerCase()in{col:1,colgroup:1,table:1,tbody:1,tfoot:1,thead:1,tr:1,title:1}?(n.empty(d),d.appendChild(n.toDom(p,d.ownerDocument))):d[h]=p,d;if(l.isFunction(p)){var g=d[b];g||(g=c++,d[b]=g);f[g]||(f[g]={});var s=f[g][h];if(s)e.disconnect(s);else try{delete d[h]}catch(u){}p?f[g][h]=e.connect(d,h,p):d[h]=null;return d}d[h]=p;return d}})},"dojo/dom-construct":function(){define("exports ./_base/kernel ./sniff ./_base/window ./dom ./dom-attr".split(" "),function(a,g,k,l,m,
q){function n(a,b){var f=b.parentNode;f&&f.insertBefore(a,b)}function e(a){if(a.canHaveChildren)try{a.innerHTML="";return}catch(b){}for(var c;c=a.lastChild;)f(c,a)}function f(a,b){a.firstChild&&e(a);b&&(k("ie")&&b.canHaveChildren&&"removeNode"in a?a.removeNode(!1):b.removeChild(a))}var c={option:["select"],tbody:["table"],thead:["table"],tfoot:["table"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","thead","tr"],legend:["fieldset"],caption:["table"],colgroup:["table"],col:["table","colgroup"],
li:["ul"]},b=/<\s*([\w\:]+)/,d={},r=0,p="__"+g._scopeName+"ToDomId",h;for(h in c)c.hasOwnProperty(h)&&(g=c[h],g.pre="option"==h?'\x3cselect multiple\x3d"multiple"\x3e':"\x3c"+g.join("\x3e\x3c")+"\x3e",g.post="\x3c/"+g.reverse().join("\x3e\x3c/")+"\x3e");var t;8>=k("ie")&&(t=function(a){a.__dojo_html5_tested="yes";var b=s("div",{innerHTML:"\x3cnav\x3ea\x3c/nav\x3e",style:{visibility:"hidden"}},a.body);1!==b.childNodes.length&&"abbr article aside audio canvas details figcaption figure footer header hgroup mark meter nav output progress section summary time video".replace(/\b\w+\b/g,
function(b){a.createElement(b)});u(b)});a.toDom=function(a,f){f=f||l.doc;var e=f[p];e||(f[p]=e=++r+"",d[e]=f.createElement("div"));8>=k("ie")&&!f.__dojo_html5_tested&&f.body&&t(f);a+="";var g=a.match(b),h=g?g[1].toLowerCase():"",e=d[e];if(g&&c[h]){g=c[h];e.innerHTML=g.pre+a+g.post;for(g=g.length;g;--g)e=e.firstChild}else e.innerHTML=a;if(1==e.childNodes.length)return e.removeChild(e.firstChild);for(h=f.createDocumentFragment();g=e.firstChild;)h.appendChild(g);return h};a.place=function(b,f,c){f=m.byId(f);
"string"==typeof b&&(b=/^\s*</.test(b)?a.toDom(b,f.ownerDocument):m.byId(b));if("number"==typeof c){var d=f.childNodes;!d.length||d.length<=c?f.appendChild(b):n(b,d[0>c?0:c])}else switch(c){case "before":n(b,f);break;case "after":c=b;(d=f.parentNode)&&(d.lastChild==f?d.appendChild(c):d.insertBefore(c,f.nextSibling));break;case "replace":f.parentNode.replaceChild(b,f);break;case "only":a.empty(f);f.appendChild(b);break;case "first":if(f.firstChild){n(b,f.firstChild);break}default:f.appendChild(b)}return b};
var s=a.create=function(b,f,c,d){var e=l.doc;c&&(c=m.byId(c),e=c.ownerDocument);"string"==typeof b&&(b=e.createElement(b));f&&q.set(b,f);c&&a.place(b,c,d);return b};a.empty=function(a){e(m.byId(a))};var u=a.destroy=function(a){(a=m.byId(a))&&f(a,a.parentNode)}})},"dojo/dom-class":function(){define(["./_base/lang","./_base/array","./dom"],function(a,g,k){function l(a){if("string"==typeof a||a instanceof String){if(a&&!q.test(a))return n[0]=a,n;a=a.split(q);a.length&&!a[0]&&a.shift();a.length&&!a[a.length-
1]&&a.pop();return a}return!a?[]:g.filter(a,function(a){return a})}var m,q=/\s+/,n=[""],e={};return m={contains:function(a,c){return 0<=(" "+k.byId(a).className+" ").indexOf(" "+c+" ")},add:function(a,c){a=k.byId(a);c=l(c);var b=a.className,d,b=b?" "+b+" ":" ";d=b.length;for(var e=0,g=c.length,h;e<g;++e)(h=c[e])&&0>b.indexOf(" "+h+" ")&&(b+=h+" ");d<b.length&&(a.className=b.substr(1,b.length-2))},remove:function(f,c){f=k.byId(f);var b;if(void 0!==c){c=l(c);b=" "+f.className+" ";for(var d=0,e=c.length;d<
e;++d)b=b.replace(" "+c[d]+" "," ");b=a.trim(b)}else b="";f.className!=b&&(f.className=b)},replace:function(a,c,b){a=k.byId(a);e.className=a.className;m.remove(e,b);m.add(e,c);a.className!==e.className&&(a.className=e.className)},toggle:function(a,c,b){a=k.byId(a);if(void 0===b){c=l(c);for(var d=0,e=c.length,g;d<e;++d)g=c[d],m[m.contains(a,g)?"remove":"add"](a,g)}else m[b?"add":"remove"](a,c);return b}}})}}});define("dojorama/layers/d05",[],1);
//@ sourceMappingURL=d05.js.map