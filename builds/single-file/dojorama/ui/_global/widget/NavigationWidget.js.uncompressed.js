require({cache:{
'url:dojorama/ui/_global/widget/template/NavigationWidget.html':"<div class=\"navbar navbar-inverse\">\n    <div class=\"navbar-inner\">\n        <div class=\"container\">\n            <!-- Be sure to leave the brand out there if you want it shown -->\n            <a class=\"brand\" href=\"#\" data-dojo-attach-point=\"homeNode\"></a>\n            \n            <ul class=\"nav\">\n                <li><a href=\"#\" data-dojo-attach-point=\"releaseIndexNode\"></a></li>\n                <li><a href=\"#\" data-dojo-attach-point=\"storageNode\"></a></li>\n            </ul>\n\n            <!-- Everything you want hidden at 940px or less, place within here -->\n            <div class=\"nav-collapse\">\n            <!-- .nav, .navbar-search, .navbar-form, etc -->\n            </div>\n            \n            <ul class=\"nav pull-right\">\n                <li><a href=\"#\">Log out</a></li>\n            </ul>\n        </div>\n    </div>\n</div>"}});
/*jshint strict:false */

define("dojorama/ui/_global/widget/NavigationWidget", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_StateAware",
    "../mixin/_ToggleMixin",
    "dojo/on",
    "dojo/_base/lang",
    "dojo/text!./template/NavigationWidget.html",
    "dojo/i18n!./nls/NavigationWidget"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _StateAware,
    _ToggleMixin,
    on,
    lang,
    template,
    nls
) {
    return declare([_WidgetBase, _TemplatedMixin, _StateAware, _ToggleMixin], {

        router: null,
        templateString: template,
        
        constructor: function (params) {
            this.router = params.router;
        },

        postCreate: function () {
            var setNode = function (node, label, url) {
                node.innerHTML = label;
                node.href = url;
                
                this.own(on(node, 'click', lang.hitch(this, function (ev) {
                    ev.preventDefault();
                    this.push(url);
                })));
            };
            
            this.inherited(arguments);
            this.hide();
            lang.hitch(this, setNode)(this.homeNode, nls.labelHome, this.router.getRoute('home').assemble());
            lang.hitch(this, setNode)(this.releaseIndexNode, nls.labelReleaseIndex, this.router.getRoute('releaseIndex').assemble());
            lang.hitch(this, setNode)(this.storageNode, nls.labelStorage, this.router.getRoute('storage').assemble());
        }
    });
});