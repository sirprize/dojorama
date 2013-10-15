require({cache:{
'dojorama/ui/home/HomePage':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_AppAware",
    "dojomat/_StateAware",
    "../_global/mixin/_NavigationMixin",
    "../_global/mixin/_PlayerMixin",
    "../_global/mixin/_FooterMixin",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/query",
    "dojo/on",
    "dojo/text!./template/HomePage.html",
    "dojo/text!../../styles/inline/ui/home/HomePage.css"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _AppAware,
    _StateAware,
    _NavigationMixin,
    _PlayerMixin,
    _FooterMixin,
    lang,
    domAttr,
    query,
    on,
    template,
    css
) {
    return declare([_WidgetBase, _TemplatedMixin, _AppAware, _StateAware, _NavigationMixin, _PlayerMixin, _FooterMixin], {

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
            this.setTitle('Home');
            
            query('a.push', this.domNode).forEach(lang.hitch(this, function (node) {
                var url, route = this.router.getRoute(domAttr.get(node, 'data-dojorama-route')); // valid route name in data-dojo-props attribute of node?
                if (!route) { return; }
                
                url = route.assemble();
                node.href = url;
                
                this.own(on(node, 'click', lang.hitch(this, function (ev) {
                    ev.preventDefault();
                    this.pushState(url);
                })));
            }));
        },

        startup: function () {
            this.inherited(arguments);
            this.showNavigation();
            this.showPlayer();
            this.showFooter();
        }
    });
});
},
'url:dojorama/ui/home/template/HomePage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n    \n    <div class=\"jumbotron\">\n        <div class=\"container\">\n            <h1>Dojorama</h1>\n            <p class=\"lead\">Single page demo application based on Dojo 1.9, Twitter Bootstrap 3 and history API</p>\n            <p>\n                <a onclick=\"_gaq.push(['_trackEvent', 'Jumbotron actions', 'Download', 'Download Dojorama']);\" class=\"btn btn-primary btn-large\" href=\"http://github.com/sirprize/dojorama\">Download</a>\n                \n                <a onclick=\"_gaq.push(['_trackEvent', 'Jumbotron actions', 'Tutorial', 'Dojorama Tutorial']);\" class=\"btn btn-success btn-large\" href=\"http://sirprize.me/scribble/dojorama-introduction-building-a-dojo-single-page-application/\">Tutorial</a>\n            </p>\n        </div>\n    </div>\n    \n    <div class=\"container\">\n        <div class=\"well well-lg\">\n            <p>This is a live demo application for the tutorial: <a href=\"http://sirprize.me/scribble/dojorama-introduction-building-a-dojo-single-page-application/\">Building a Dojo single page application</a>. This fictional application is all about music and it's the place for the website owners to manage their music.</p>\n            \n            <p>If you're visiting with a decently modern browser, you'll be able to play some music in the player below and keep listening while browsing around. <a href=\"#\" data-dojorama-route=\"releaseCreate\" class=\"push\">Start here</a> and create a new release.</p>\n        </div>\n        \n        <div data-dojo-attach-point=\"playerNode\"></div>\n\n        <div class=\"well well-lg\">\n            <p>Dojorama is built on top of these fine libraries:</p>\n            <ul>\n                <li><a href=\"http://github.com/dojo/dojo\">dojo/dojo</a> - The Dojo Toolkit</li>\n                <li><a href=\"http://github.com/dojo/util\">dojo/utils</a> - Dojo build tool and unit testing (DOH)</li>\n                <li><a href=\"http://github.com/SitePen/dgrid\">SitePen/dgrid</a> - Dojo grid widget</li>\n                <li><a href=\"http://github.com/kriszyp/put-selector\">kriszyp/put-selector</a> - DOM manipulation (dependency of dgrid)</li>\n                <li><a href=\"http://github.com/kriszyp/xstyle\">kriszyp/xstyle</a> - CSS loader (dependency of dgrid)</li>\n                <li><a href=\"http://github.com/twbs/bootstrap\">twbs/bootstrap</a> - Frontend framework (CSS only)</li>\n                <li><a href=\"http://github.com/scottjehl/Respond\">scottjehl/Respond</a> - Media query polyfill</li>\n                <li><a href=\"http://github.com/aFarkas/html5shiv\">aFarkas/html5shiv</a> - Enable use of HTML5 sectioning elements in legacy IE</li>\n                <li><a href=\"http://github.com/scottschiller/SoundManager2\">scottschiller/SoundManager2</a> - JavaScript sound API</li>\n                <li><a href=\"http://github.com/sirprize/mijit\">sirprize/mijit</a> - Essential Dijit stuff (<code>_WidgetBase</code>, <code>_TemplatedMixin</code> and <code>registry</code>)</li>\n                <li><a href=\"http://github.com/sirprize/dojomat\">sirprize/dojomat</a> - Application controller</li>\n                <li><a href=\"http://github.com/sirprize/routed\">sirprize/routed</a> - Routing</li>\n                <li><a href=\"http://github.com/sirprize/dobolo\">sirprize/dobolo</a> - Dojo port of some Twitter Bootstrap JavaScript components</li>\n                <li><a href=\"http://github.com/sirprize/dojo-data-model\">sirprize/dojo-data-model</a> - Data model for Dojo Applications</li>\n                <li><a href=\"http://github.com/sirprize/dojo-form-controls\">sirprize/dojo-form-controls</a> - Dojo widgets for native form controls</li>\n                <li><a href=\"http://github.com/sirprize/dojo-local-storage\">sirprize/dojo-local-storage</a> - LocalStorage wrapper providing dojo/store interface</li>\n                <li><a href=\"http://github.com/sirprize/dojo-sm2-playlist\">sirprize/dojo-sm2-playlist</a> - Dojo/SoundManager2 playlist</li>\n            </ul>\n        </div>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/styles/inline/ui/home/HomePage.css':".jumbotron {position: relative; padding: 40px 0; color: #333; text-align: center; background: #F5F5F5;}.jumbotron h1 {font-size: 80px; font-weight: bold; letter-spacing: -1px; line-height: 1;}.jumbotron p {font-size: 24px; font-weight: 300; line-height: 30px; margin-bottom: 30px;}.jumbotron a {color: #fff; color: rgba(255, 255, 255, 0.5); -webkit-transition: all 0.2s ease-in-out; -moz-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out;}.jumbotron a:hover {color: #fff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.25);}.jumbotron .btn {padding: 14px 24px; font-size: 24px; font-weight: 200; color: #fff; border: 0; -webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); -webkit-transition: none; -moz-transition: none; transition: none;}.masthead .btn:hover {-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25);}.masthead .btn:active {-webkit-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1); -moz-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);}.jumbotron .container {position: relative; z-index: 2;}.jumbotron:after {content: ''; display: block; position: absolute; top: 0; right: 0; bottom: 0; left: 0; opacity: .4;}.masthead {padding: 70px 0 80px; margin-bottom: 0; color: #fff;}.masthead h1 {font-size: 120px; line-height: 1; letter-spacing: -2px;}.masthead p {font-size: 40px; font-weight: 200; line-height: 1.25;}.masthead-links {margin: 0; list-style: none;}.masthead-links li {display: inline; padding: 0 10px; color: rgba(255, 255, 255, 0.25);}.bs-docs-social {padding: 15px 0; text-align: center; background-color: #f5f5f5; border-top: 1px solid #fff; border-bottom: 1px solid #ddd;}.bs-docs-social-buttons {margin-left: 0; margin-bottom: 0; padding-left: 0; list-style: none;}.bs-docs-social-buttons li {display: inline-block; padding: 5px 8px; line-height: 1; *display: inline; *zoom: 1;}.subhead h1 {font-size: 60px;}.subhead p {margin-bottom: 20px;}.subhead .navbar {display: none;}"}});
define("dojorama/layers/home", [], 1);
