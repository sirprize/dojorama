require({cache:{
'dojorama/ui/home/HomePage':function(){
require({cache:{
'url:dojorama/ui/home/template/HomePage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n    \n    <div class=\"jumbotron subhead\">\n        <div class=\"container\">\n            <h1>Dojorama</h1>\n            <p class=\"lead\">Single page demo application based on Dojo, Twitter Bootstrap and history API</p>\n        </div>\n    </div>\n    \n    <div class=\"container main\">\n        <div data-dojo-attach-point=\"playerNode\"></div>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/styles/inline/ui/home/HomePage.css':".jumbotron {position: relative; padding: 40px 0; color: #333; text-align: center;}.jumbotron h1 {font-size: 80px; font-weight: bold; letter-spacing: -1px; line-height: 1;}.jumbotron p {font-size: 24px; font-weight: 300; line-height: 30px; margin-bottom: 30px;}.jumbotron a {color: #fff; color: rgba(255, 255, 255, 0.5); -webkit-transition: all 0.2s ease-in-out; -moz-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out;}.jumbotron a:hover {color: #fff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.25);}.masthead .btn {padding: 14px 24px; font-size: 24px; font-weight: 200; color: #fff; border: 0; -webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); -webkit-transition: none; -moz-transition: none; transition: none;}.masthead .btn:hover {-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25);}.masthead .btn:active {-webkit-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1); -moz-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);}.jumbotron .container {position: relative; z-index: 2;}.jumbotron:after {content: ''; display: block; position: absolute; top: 0; right: 0; bottom: 0; left: 0; opacity: .4;}.masthead {padding: 70px 0 80px; margin-bottom: 0; color: #fff;}.masthead h1 {font-size: 120px; line-height: 1; letter-spacing: -2px;}.masthead p {font-size: 40px; font-weight: 200; line-height: 1.25;}.masthead-links {margin: 0; list-style: none;}.masthead-links li {display: inline; padding: 0 10px; color: rgba(255, 255, 255, 0.25);}.bs-docs-social {padding: 15px 0; text-align: center; background-color: #f5f5f5; border-top: 1px solid #fff;}.bs-docs-social-buttons {margin-left: 0; margin-bottom: 0; padding-left: 0; list-style: none;}.bs-docs-social-buttons li {display: inline-block; padding: 5px 8px; line-height: 1; *display: inline; *zoom: 1;}.subhead {text-align: left;}.subhead h1 {font-size: 60px;}.subhead p {margin-bottom: 20px;}.subhead .navbar {display: none;}"}});
/*jshint strict:false */

define("dojorama/ui/home/HomePage", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_AppAware",
    "dojomat/_StateAware",
    "../_global/mixin/_NavigationMixin",
    "../_global/mixin/_PlayerMixin",
    "../_global/mixin/_FooterMixin",
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
'dojorama/ui/_global/mixin/_NavigationMixin':function(){
/*jshint strict:false */

define("dojorama/ui/_global/mixin/_NavigationMixin", [
    "dojo/_base/declare",
    "../widget/NavigationWidget"
], function (
    declare,
    NavigationWidget
) {
    return declare([], {
        // summary:
        //      Adds a NavigationWidget to a page-widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="navigationNode" in the template

        navigationWidget: null,

        postCreate: function () {
            this.inherited(arguments);
            
            this.navigationWidget = new NavigationWidget({
                router: this.router
            }, this.navigationNode);
        },

        startup: function () {
            this.inherited(arguments);
            this.navigationWidget.startup();
        },
        
        showNavigation: function () {
            this.navigationWidget.show();
        }
    });
});
},
'dojorama/ui/_global/widget/NavigationWidget':function(){
require({cache:{
'url:dojorama/ui/_global/widget/template/NavigationWidget.html':"<div class=\"navbar navbar-inverse navbar-fixed-top\">\n    <div class=\"navbar-inner\">\n        <div class=\"container\">\n            <!-- Be sure to leave the brand out there if you want it shown -->\n            <a class=\"brand\" href=\"#\" data-dojo-attach-point=\"homeNode\"></a>\n            \n            <ul class=\"nav\">\n                <li><a href=\"#\" data-dojo-attach-point=\"releaseIndexNode\"></a></li>\n                <li><a href=\"#\" data-dojo-attach-point=\"storageNode\"></a></li>\n            </ul>\n\n            <!-- Everything you want hidden at 940px or less, place within here -->\n            <div class=\"nav-collapse\">\n            <!-- .nav, .navbar-search, .navbar-form, etc -->\n            </div>\n            <!--\n            <ul class=\"nav pull-right\">\n                <li>asdf</li>\n            </ul>\n            -->\n        </div>\n    </div>\n</div>"}});
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
            var setNavItem = function (node, label, url) {
                    node.innerHTML = label;
                    node.href = url;
                
                    this.own(on(node, 'click', lang.hitch(this, function (ev) {
                        ev.preventDefault();
                        this.push(url);
                    })));
                }
            ;
            
            this.inherited(arguments);
            this.hide();
            lang.hitch(this, setNavItem)(this.homeNode, nls.labelHome, this.router.getRoute('home').assemble());
            lang.hitch(this, setNavItem)(this.releaseIndexNode, nls.labelReleaseIndex, this.router.getRoute('releaseIndex').assemble());
            lang.hitch(this, setNavItem)(this.storageNode, nls.labelStorage, this.router.getRoute('storage').assemble());
        }
    });
});
},
'dojorama/ui/_global/mixin/_ToggleMixin':function(){
define("dojorama/ui/_global/mixin/_ToggleMixin", [
    "dojo/_base/declare",
    "dojo/dom-style"
], function (
    declare,
    domStyle
) {
    "use strict";
    
    return declare([], {
        // summary:
        //      Toggle visibility of a widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget
        
        show: function () {
            domStyle.set(this.domNode, {
                display: "block"
            });
        },

        hide: function () {
            domStyle.set(this.domNode, {
                display: "none"
            });
        }
    });
});
},
'url:dojorama/ui/_global/widget/template/NavigationWidget.html':"<div class=\"navbar navbar-inverse navbar-fixed-top\">\n    <div class=\"navbar-inner\">\n        <div class=\"container\">\n            <!-- Be sure to leave the brand out there if you want it shown -->\n            <a class=\"brand\" href=\"#\" data-dojo-attach-point=\"homeNode\"></a>\n            \n            <ul class=\"nav\">\n                <li><a href=\"#\" data-dojo-attach-point=\"releaseIndexNode\"></a></li>\n                <li><a href=\"#\" data-dojo-attach-point=\"storageNode\"></a></li>\n            </ul>\n\n            <!-- Everything you want hidden at 940px or less, place within here -->\n            <div class=\"nav-collapse\">\n            <!-- .nav, .navbar-search, .navbar-form, etc -->\n            </div>\n            <!--\n            <ul class=\"nav pull-right\">\n                <li>asdf</li>\n            </ul>\n            -->\n        </div>\n    </div>\n</div>",
'dojorama/ui/_global/mixin/_PlayerMixin':function(){
/*jshint strict:false */

define("dojorama/ui/_global/mixin/_PlayerMixin", [
    "dojo/_base/declare",
    "../widget/PlayerWidget"
], function (
    declare,
    PlayerWidget
) {
    return declare([], {
        // summary:
        //      Adds a PlayerWidget to a page-widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="playerNode" in the template

        playerWidget: null,

        postCreate: function () {
            this.inherited(arguments);
            this.playerWidget = new PlayerWidget({
                session: this.session
            }, this.playerNode);
        },

        startup: function () {
            this.inherited(arguments);
            this.playerWidget.startup();
        },
        
        showPlayer: function () {
            this.playerWidget.show();
        }
    });
});
},
'dojorama/ui/_global/widget/PlayerWidget':function(){
require({cache:{
'url:dojorama/ui/_global/widget/template/PlayerWidget.html':"<div class=\"well well-large\">\n    <p>Listen to some music while you play with this app</p>\n    \n    <div class=\"btn-group\">\n        <a class=\"btn\" href=\"#\" data-dojo-attach-point=\"prevNode\"><i class=\"icon-backward\"></i></a>\n        <a class=\"btn\" href=\"#\" data-dojo-attach-point=\"playNode\"><i class=\"icon-play\"></i></a>\n        <a class=\"btn\" href=\"#\" data-dojo-attach-point=\"nextNode\"><i class=\"icon-forward\"></i></a>\n    </div>\n    \n    <div data-dojo-attach-point=\"infoNode\">\n        Track <span data-dojo-attach-point=\"trackNrNode\"></span> of <span data-dojo-attach-point=\"numTracksNode\"></span>\n        <span data-dojo-attach-point=\"positionOuterNode\" style=\"display:none\">\n            // <span data-dojo-attach-point=\"positionNode\"></span>\n        </span>\n        <h2 class=\"track-title\" data-dojo-attach-point=\"trackTitleNode\">Title</h2>\n        <p class=\"track-artist\" data-dojo-attach-point=\"trackArtistNode\">Artist</p>\n    </div>\n</div>"}});
/*jshint strict:false */

define("dojorama/ui/_global/widget/PlayerWidget", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_StateAware",
    "../mixin/_ToggleMixin",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/on",
    "dojo/query",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo-sm2-playlist/Playlist",
    "dojo/text!./template/PlayerWidget.html"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _StateAware,
    _ToggleMixin,
    domStyle,
    domClass,
    on,
    query,
    lang,
    array,
    Playlist,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _StateAware, _ToggleMixin], {

        session: null,
        templateString: template,
        
        constructor: function (params) {
            this.session = params.session;
        },

        postCreate: function () {
            this.inherited(arguments);
            
            var playlist = this.session.get('playlist'),
                playIconNode = query('i', this.playNode)[0],
                setPlayIcon = function () {
                    domClass.remove(playIconNode, 'icon-pause');
                    domClass.add(playIconNode, 'icon-play');
                },
                setPauseIcon = function () {
                    domClass.remove(playIconNode, 'icon-play');
                    domClass.add(playIconNode, 'icon-pause');
                },
                setTrackInfo = function () {
                    this.trackNrNode.innerHTML = playlist.getCurrentPosition();
                    this.numTracksNode.innerHTML = playlist.getTracks().length;
                    this.trackTitleNode.innerHTML = playlist.getCurrentTrack().title;
                    this.trackArtistNode.innerHTML = playlist.getCurrentTrack().artist;
                },
                showPlayInfo = function () {
                    domStyle.set(this.positionOuterNode, 'display', 'inline');
                },
                setPlayInfo = function () {
                    this.positionNode.innerHTML = formatTime(Math.round(playlist.getCurrentSound().position / 1000));
                },
                resetPlayInfo = function () {
                    this.positionNode.innerHTML = '0:00';
                },
                formatTime = function(seconds) {
                    var seconds = parseInt(seconds, 10),
                        h = (seconds >= 3600) ? Math.floor(seconds / 3600) : 0,
                        m = ((seconds - h * 3600) >= 60) ? Math.floor((seconds - h * 3600) / 60) : 0,
                        s = seconds - (h * 3600) - (m * 60),
                        hh = (h < 10) ? '0' + h : h,
                        mm = (m < 10) ? '0' + m : m,
                        ss = (s < 10) ? '0' + s : s
                    ;
                    
                    if(seconds < 3600) { return m + ':' + ss; }
                    return h + ':' + mm + ':' + ss;
                }
            ;
            
            if (!playlist) {
                playlist = new Playlist();
                
                playlist.onready(function () {
                    playlist.addTrack({
                            title: 'The River',
                            artist: 'Pachanga Boys',
                            cover: ''
                        }, {
                            id: 'theRiver',
                            url: 'http://sirprize.me/chrigu/dojorama/pachanga-boys-the-river.mp3'
                    });
                    
                    playlist.addTrack({
                            title: 'Is this power',
                            artist: 'The Field',
                            cover: ''
                        }, {
                            id: 'isThisPower',
                            url: 'http://sirprize.me/chrigu/dojorama/the-field-is-this-power.mp3'
                    });
                    
                    playlist.addTrack({
                            title: 'Geffen (Philipp Gorbatchev Remix)',
                            artist: 'Barnt',
                            cover: ''
                        }, {
                            id: 'geffen',
                            url: 'http://sirprize.me/chrigu/dojorama/barnt-geffen-philipp-gorbatchev-remix.mp3'
                    });
                });
                
                this.session.set('playlist', playlist);
            }
            
            playlist.onready(lang.hitch(this, function () {
                if (playlist.isPlaying()) {
                    lang.hitch(this, setPauseIcon)();
                    lang.hitch(this, showPlayInfo)();
                } else {
                    lang.hitch(this, setPlayIcon)();
                }

                lang.hitch(this, setTrackInfo)();
            }));
            
            array.forEach(playlist.getTracks(), lang.hitch(this, function (track) {
                this.own(on(track, 'onplay', lang.hitch(this, function (ev) {
                    lang.hitch(this, showPlayInfo)();
                    lang.hitch(this, resetPlayInfo)();
                })));
                
                this.own(on(track, 'onfinish', lang.hitch(this, function (ev) {
                    playlist.next();
                    lang.hitch(this, setPauseIcon)();
                    lang.hitch(this, setTrackInfo)();
                })));
                
                this.own(on(track, 'whileplaying', lang.hitch(this, function (ev) {
                    lang.hitch(this, setPlayInfo)();
                })));
            }));
            
            this.own(on(this.playNode, 'click', lang.hitch(this, function (ev) {
                ev.preventDefault();
                
                if (playlist.isPlaying()) {
                    playlist.pause();
                    lang.hitch(this, setPlayIcon)();
                } else {
                    playlist.play();
                    lang.hitch(this, setPauseIcon)();
                    lang.hitch(this, setTrackInfo)();
                }
            })));
            
            this.own(on(this.prevNode, 'click', lang.hitch(this, function (ev) {
                ev.preventDefault();
                playlist.previous();
                lang.hitch(this, setPauseIcon)();
                lang.hitch(this, setTrackInfo)();
                lang.hitch(this, resetPlayInfo)();
            })));
            
            this.own(on(this.nextNode, 'click', lang.hitch(this, function (ev) {
                ev.preventDefault();
                playlist.next();
                lang.hitch(this, setPauseIcon)();
                lang.hitch(this, setTrackInfo)();
                lang.hitch(this, resetPlayInfo)();
            })));
        }
    });
});
},
'url:dojorama/ui/_global/widget/template/PlayerWidget.html':"<div class=\"well well-large\">\n    <p>Listen to some music while you play with this app</p>\n    \n    <div class=\"btn-group\">\n        <a class=\"btn\" href=\"#\" data-dojo-attach-point=\"prevNode\"><i class=\"icon-backward\"></i></a>\n        <a class=\"btn\" href=\"#\" data-dojo-attach-point=\"playNode\"><i class=\"icon-play\"></i></a>\n        <a class=\"btn\" href=\"#\" data-dojo-attach-point=\"nextNode\"><i class=\"icon-forward\"></i></a>\n    </div>\n    \n    <div data-dojo-attach-point=\"infoNode\">\n        Track <span data-dojo-attach-point=\"trackNrNode\"></span> of <span data-dojo-attach-point=\"numTracksNode\"></span>\n        <span data-dojo-attach-point=\"positionOuterNode\" style=\"display:none\">\n            // <span data-dojo-attach-point=\"positionNode\"></span>\n        </span>\n        <h2 class=\"track-title\" data-dojo-attach-point=\"trackTitleNode\">Title</h2>\n        <p class=\"track-artist\" data-dojo-attach-point=\"trackArtistNode\">Artist</p>\n    </div>\n</div>",
'dojorama/ui/_global/mixin/_FooterMixin':function(){
/*jshint strict:false */

define("dojorama/ui/_global/mixin/_FooterMixin", [
    "dojo/_base/declare",
    "../widget/FooterWidget"
], function (
    declare,
    FooterWidget
) {
    return declare([], {
        
        // summary:
        //      Adds a FooterWidget to a page-widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="footerNode" in the template
        
        footerWidget: null,

        postCreate: function () {
            this.inherited(arguments);
            
            this.footerWidget = new FooterWidget({
                router: this.router
            }, this.footerNode);
        },

        startup: function () {
            this.inherited(arguments);
            this.footerWidget.startup();
        },
        
        showFooter: function () {
            this.footerWidget.show();
        }
    });
});
},
'dojorama/ui/_global/widget/FooterWidget':function(){
require({cache:{
'url:dojorama/ui/_global/widget/template/FooterWidget.html':"<div class=\"footer\">\n    <div class=\"container\">\n        <!--<p class=\"pull-right\"><a href=\"#\">Back to top</a></p>-->\n        <p>Dojorama is written by <a href=\"http://sirprize.me\">sirprize</a>, hosted on <a href=\"http://github.com/sirprize/dojorama\">Github</a> and released under the <a href=\"http://opensource.org/licenses/mit-license.php\">MIT license</a>.</p>\n        <!--\n        <ul class=\"footer-links\">\n            <li><a href=\"\">aaa</a></li>\n            <li><a href=\"\">bbb</a></li>\n        </ul>\n        -->\n    </div>\n</div>"}});
/*jshint strict:false */

define("dojorama/ui/_global/widget/FooterWidget", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_StateAware",
    "../mixin/_ToggleMixin",
    "dojo/text!./template/FooterWidget.html",
    "dojo/i18n!./nls/FooterWidget"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _StateAware,
    _ToggleMixin,
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
            this.inherited(arguments);
            this.hide();
        }
    });
});
},
'url:dojorama/ui/_global/widget/template/FooterWidget.html':"<div class=\"footer\">\n    <div class=\"container\">\n        <!--<p class=\"pull-right\"><a href=\"#\">Back to top</a></p>-->\n        <p>Dojorama is written by <a href=\"http://sirprize.me\">sirprize</a>, hosted on <a href=\"http://github.com/sirprize/dojorama\">Github</a> and released under the <a href=\"http://opensource.org/licenses/mit-license.php\">MIT license</a>.</p>\n        <!--\n        <ul class=\"footer-links\">\n            <li><a href=\"\">aaa</a></li>\n            <li><a href=\"\">bbb</a></li>\n        </ul>\n        -->\n    </div>\n</div>",
'url:dojorama/ui/home/template/HomePage.html':"<div>\n    <div data-dojo-attach-point=\"navigationNode\"></div>\n    \n    <div class=\"jumbotron subhead\">\n        <div class=\"container\">\n            <h1>Dojorama</h1>\n            <p class=\"lead\">Single page demo application based on Dojo, Twitter Bootstrap and history API</p>\n        </div>\n    </div>\n    \n    <div class=\"container main\">\n        <div data-dojo-attach-point=\"playerNode\"></div>\n    </div>\n    \n    <div data-dojo-attach-point=\"footerNode\"></div>\n</div>",
'url:dojorama/styles/inline/ui/home/HomePage.css':".jumbotron {position: relative; padding: 40px 0; color: #333; text-align: center;}.jumbotron h1 {font-size: 80px; font-weight: bold; letter-spacing: -1px; line-height: 1;}.jumbotron p {font-size: 24px; font-weight: 300; line-height: 30px; margin-bottom: 30px;}.jumbotron a {color: #fff; color: rgba(255, 255, 255, 0.5); -webkit-transition: all 0.2s ease-in-out; -moz-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out;}.jumbotron a:hover {color: #fff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.25);}.masthead .btn {padding: 14px 24px; font-size: 24px; font-weight: 200; color: #fff; border: 0; -webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); -webkit-transition: none; -moz-transition: none; transition: none;}.masthead .btn:hover {-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 5px rgba(0, 0, 0, 0.25);}.masthead .btn:active {-webkit-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1); -moz-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);}.jumbotron .container {position: relative; z-index: 2;}.jumbotron:after {content: ''; display: block; position: absolute; top: 0; right: 0; bottom: 0; left: 0; opacity: .4;}.masthead {padding: 70px 0 80px; margin-bottom: 0; color: #fff;}.masthead h1 {font-size: 120px; line-height: 1; letter-spacing: -2px;}.masthead p {font-size: 40px; font-weight: 200; line-height: 1.25;}.masthead-links {margin: 0; list-style: none;}.masthead-links li {display: inline; padding: 0 10px; color: rgba(255, 255, 255, 0.25);}.bs-docs-social {padding: 15px 0; text-align: center; background-color: #f5f5f5; border-top: 1px solid #fff;}.bs-docs-social-buttons {margin-left: 0; margin-bottom: 0; padding-left: 0; list-style: none;}.bs-docs-social-buttons li {display: inline-block; padding: 5px 8px; line-height: 1; *display: inline; *zoom: 1;}.subhead {text-align: left;}.subhead h1 {font-size: 60px;}.subhead p {margin-bottom: 20px;}.subhead .navbar {display: none;}",
'*now':function(r){r(['dojo/i18n!*preload*dojorama/layers/nls/home*["ar","ca","cs","da","de","el","en-gb","en-us","es-es","fi-fi","fr-fr","he-il","hu","it-it","ja-jp","ko-kr","nl-nl","nb","pl","pt-br","pt-pt","ru","sk","sl","sv","th","tr","zh-tw","zh-cn","ROOT"]']);}
}});
define("dojorama/layers/home", [], 1);
