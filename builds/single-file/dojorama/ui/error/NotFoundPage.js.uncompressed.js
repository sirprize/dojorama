require({cache:{
'url:dojorama/ui/error/template/NotFoundPage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n    \n    <div class=\"container main\">\n        <h1 data-dojo-attach-point=\"messageNode\"></h1>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/styles/inline/ui/error/NotFoundPage.css':"body {background: red;}"}});
/*jshint strict:false */

define("dojorama/ui/error/NotFoundPage", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_AppAware",
    "dojomat/_StateAware",
    "../_global/mixin/_NavigationMixin",
    "../_global/mixin/_FooterMixin",
    "dojo/text!./template/NotFoundPage.html",
    "dojo/text!../../styles/inline/ui/error/NotFoundPage.css"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _AppAware,
    _StateAware,
    _NavigationMixin,
    _FooterMixin,
    template,
    css
) {
    return declare([_WidgetBase, _TemplatedMixin, _AppAware, _StateAware, _NavigationMixin, _FooterMixin], {
        
        router: null,
        request: null,
        session: null,
        templateString: template,
        
        constructor: function (params) {
            this.router = params.router;
            this.request = params.request;
            this.session = params.session;
        },

        postCreate: function () {
            this.inherited(arguments);
            this.setCss(css, 'all');
            this.setTitle('Page not found');
            this.messageNode.innerHTML = 'Page not found';
        },

        startup: function () {
            this.inherited(arguments);
            this.showNavigation();
            this.showFooter();
        }
    });
});