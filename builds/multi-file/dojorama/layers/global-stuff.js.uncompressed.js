require({cache:{
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
'url:dojorama/ui/_global/widget/template/FooterWidget.html':"<div class=\"footer\">\n    <div class=\"container\">\n        <!--<p class=\"pull-right\"><a href=\"#\">Back to top</a></p>-->\n        <p>Dojorama is written by <a href=\"http://sirprize.me\">sirprize</a>, hosted on <a href=\"http://github.com/sirprize/dojorama\">Github</a> and released under the <a href=\"http://opensource.org/licenses/mit-license.php\">MIT license</a>.</p>\n        <!--\n        <ul class=\"footer-links\">\n            <li><a href=\"\">aaa</a></li>\n            <li><a href=\"\">bbb</a></li>\n        </ul>\n        -->\n    </div>\n</div>",
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
'url:dojorama/ui/_global/widget/template/NavigationWidget.html':"<div class=\"navbar navbar-inverse navbar-fixed-top\">\n    <div class=\"navbar-inner\">\n        <div class=\"container\">\n            <!-- Be sure to leave the brand out there if you want it shown -->\n            <a class=\"brand\" href=\"#\" data-dojo-attach-point=\"homeNode\"></a>\n            \n            <ul class=\"nav\">\n                <li><a href=\"#\" data-dojo-attach-point=\"releaseIndexNode\"></a></li>\n                <li><a href=\"#\" data-dojo-attach-point=\"storageNode\"></a></li>\n            </ul>\n\n            <!-- Everything you want hidden at 940px or less, place within here -->\n            <div class=\"nav-collapse\">\n            <!-- .nav, .navbar-search, .navbar-form, etc -->\n            </div>\n            <!--\n            <ul class=\"nav pull-right\">\n                <li>asdf</li>\n            </ul>\n            -->\n        </div>\n    </div>\n</div>",
'dojorama/ui/_global/mixin/_NotificationMixin':function(){
define("dojorama/ui/_global/mixin/_NotificationMixin", [
    "dojo/_base/declare",
    "dobolo/Alert",
    "dojo/dom-construct"
], function (
    declare,
    Alert,
    domConstruct
) {
    "use strict";
    
    return declare([], {
        // summary:
        //      Creates, shows and hides a dobolo/Alert widget to notify the user of interesting events
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="notificationNode" in the template
        
        alertNode: null,
        alertWidget: null,
        
        showNotification: function (notification) {
            var alertClass = 'alert-info';
            
            if (notification.type === 'ok') {
                alertClass = 'alert-success';
            } else if (notification.type === 'error') {
                alertClass = 'alert-error';
            }
            
            this.hideNotification();
            
            if (this.alertNode) {
                domConstruct.destroy(this.alertNode);
            }
            
            this.alertNode = domConstruct.create('div', {}, this.notificationNode, 'first');
            
            this.alertWidget = new Alert({
                'class': alertClass + ' fade in',
                content: notification.message,
                closable: true
            }, this.alertNode);
            
            this.alertWidget.startup();
        },
        
        hideNotification: function () {
            if (this.alertWidget) {
                this.alertWidget.destroyRecursive();
            }
        }
    });
});
},
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
'dojorama/ui/_global/widget/ActionsWidget':function(){
require({cache:{
'url:dojorama/ui/_global/widget/template/ActionsWidget.html':"<ul class=\"nav nav-pills\"></ul>"}});
/*jshint strict:false */

define("dojorama/ui/_global/widget/ActionsWidget", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_StateAware",
    "../mixin/_ToggleMixin",
    "dojo/on",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/text!./template/ActionsWidget.html"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _StateAware,
    _ToggleMixin,
    on,
    lang,
    array,
    domConstruct,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _StateAware, _ToggleMixin], {

        actions: [],
        templateString: template,
        
        constructor: function (params) {
            this.actions = params.actions;
        },

        postCreate: function () {
            this.inherited(arguments);
            this.hide();
            
            array.forEach(this.actions, lang.hitch(this, function (action) {
                var props = (action.active) ? { 'class': 'active' } : {},
                    liNode = domConstruct.create('li', props, this.domNode, 'last'),
                    aNode = domConstruct.create('a', {
                        href: action.url,
                        innerHTML: action.label
                    }, liNode, 'last')
                ;
                
                this.own(on(aNode, 'click', lang.hitch(this, function (ev) {
                    ev.preventDefault();
                    this.push(action.url);
                })));
            }));
        }
    });
});
},
'url:dojorama/ui/_global/widget/template/ActionsWidget.html':"<ul class=\"nav nav-pills\"></ul>",
'dojorama/ui/_global/widget/BreadcrumbsWidget':function(){
require({cache:{
'url:dojorama/ui/_global/widget/template/BreadcrumbsWidget.html':"<ul class=\"breadcrumb\"></ul>"}});
/*jshint strict:false */

define("dojorama/ui/_global/widget/BreadcrumbsWidget", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_StateAware",
    "../mixin/_ToggleMixin",
    "dojo/on",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/text!./template/BreadcrumbsWidget.html"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _StateAware,
    _ToggleMixin,
    on,
    lang,
    array,
    domConstruct,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _StateAware, _ToggleMixin], {

        divider: '/',
        templateString: template,
        
        constructor: function (params) {
            this.divider = params.divider || this.divider;
        },

        postCreate: function () {
            this.inherited(arguments);
            this.hide();
        },
        
        _setItemsAttr: function (items) {
            var i = 0,
                addItem = function (item) {
                    var liNode = domConstruct.create('li', {}, this.domNode, 'last'),
                        aNode = domConstruct.create('a', {
                            href: item.url,
                            innerHTML: item.label
                        }, liNode, 'last'),
                        spaceNode = document.createTextNode(' '),
                        spanNode = domConstruct.create('span', {
                            'class': 'divider',
                            innerHTML: this.divider
                        }, liNode, 'last')
                    ;

                    domConstruct.place(spaceNode, aNode, 'after');

                    this.own(on(aNode, 'click', lang.hitch(this, function (ev) {
                        ev.preventDefault();
                        this.push(item.url);
                    })));
                }
            ;
            
            // create item nodes:
            // <li><a href="/some-url">Some label</a> <span class="divider">//</span></li>
            for (i = 0; i < items.length - 1; i = i + 1) {
                lang.hitch(this, addItem)(items[i]);
            }
            
            // create the last item node:
            // <li class="active">Some label</li>
            domConstruct.create('li', {
                'class': 'active',
                innerHTML: items[items.length - 1].label
            }, this.domNode, 'last');
        }
    });
});
},
'url:dojorama/ui/_global/widget/template/BreadcrumbsWidget.html':"<ul class=\"breadcrumb\"></ul>",
'dojorama/ui/_global/widget/ControlGroupWidget':function(){
require({cache:{
'url:dojorama/ui/_global/widget/template/ControlGroupWidget.html':"<div class=\"control-group\">\n    <label class=\"control-label\" for=\"inputEmail\" data-dojo-attach-point=\"labelNode\"></label>\n    <div class=\"controls\">\n        <span data-dojo-attach-point=\"inputNode\"></span>\n        <span class=\"help-inline\" data-dojo-attach-point=\"inlineHelpNode\"></span>\n        <span class=\"help-block\" data-dojo-attach-point=\"blockHelpNode\"></span>\n    </div>\n</div>"}});
/*jshint strict:false */

define("dojorama/ui/_global/widget/ControlGroupWidget", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/text!./template/ControlGroupWidget.html"
], function (
    declare,
    lang,
    WidgetBase,
    TemplatedMixin,
    domClass,
    domAttr,
    template
) {
    return declare([WidgetBase, TemplatedMixin], {

        inputWidget: null,
        widgetProperty: 'value',
        value: '',
        label: '',
        error: '',
        templateString: template,
        
        postCreate: function () {
            this.inherited(arguments);
            this.inputWidget.placeAt(this.inputNode);
            this.labelNode.innerHTML = this.label;
            
            this.own(this.watch('value', lang.hitch(this, function (prop, old, val) {
                this.inputWidget.set('value', val);
            })));
            
            this.own(this.inputWidget.watch(this.widgetProperty, lang.hitch(this, function (prop, old, val) {
                this.set('value', val);
            })));
            
            this.inputWidget.set(this.widgetProperty, this.get('value'));
            domAttr.set(this.labelNode, 'for', this.inputWidget.id);
        },

        startup: function () {
            this.inherited(arguments);
            this.inputWidget.startup();
        },

        _setValueAttr: function (value) {
            this._set('value', value);
        },

        _setErrorAttr: function (error) {
            var method = (error) ? 'add' : 'remove';
            domClass[method](this.domNode, 'error');
            this.inlineHelpNode.innerHTML = error;
            this._set("error", error);
        }
    });
});
},
'url:dojorama/ui/_global/widget/template/ControlGroupWidget.html':"<div class=\"control-group\">\n    <label class=\"control-label\" for=\"inputEmail\" data-dojo-attach-point=\"labelNode\"></label>\n    <div class=\"controls\">\n        <span data-dojo-attach-point=\"inputNode\"></span>\n        <span class=\"help-inline\" data-dojo-attach-point=\"inlineHelpNode\"></span>\n        <span class=\"help-block\" data-dojo-attach-point=\"blockHelpNode\"></span>\n    </div>\n</div>",
'dojorama/ui/_global/widget/ProgressWidget':function(){
require({cache:{
'url:dojorama/ui/_global/widget/template/ProgressWidget.html':"<div class=\"progress-widget\">\n    <div class=\"animation\"></div>\n</div>"}});
/*jshint strict:false */

define("dojorama/ui/_global/widget/ProgressWidget", [
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "../mixin/_ToggleMixin",
    "dojo/text!./template/ProgressWidget.html"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _ToggleMixin,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin, _ToggleMixin], {

        templateString: template,

        postCreate: function () {
            this.inherited(arguments);
            this.hide();
        }
    });
});
},
'url:dojorama/ui/_global/widget/template/ProgressWidget.html':"<div class=\"progress-widget\">\n    <div class=\"animation\"></div>\n</div>",
'*now':function(r){r(['dojo/i18n!*preload*dojorama/layers/nls/global-stuff*["ar","ca","cs","da","de","el","en-gb","en-us","es-es","fi-fi","fr-fr","he-il","hu","it-it","ja-jp","ko-kr","nl-nl","nb","pl","pt-br","pt-pt","ru","sk","sl","sv","th","tr","zh-tw","zh-cn","ROOT"]']);}
}});
define("dojorama/layers/global-stuff", [], 1);
