/*jshint strict:false */

define([
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
            
            var sessionId = 'ui/_global/widget/PlayerWidget/playlist',
                playlist = this.session.get(sessionId),
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
                    this.trackTitleNode.innerHTML = playlist.getCurrentTrack().title;
                    this.trackArtistNode.innerHTML = playlist.getCurrentTrack().artist;
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
                
                this.session.set(sessionId, playlist);
            }
            
            if (playlist.isPlaying()) {
                lang.hitch(this, setPauseIcon)();
            } else {
                lang.hitch(this, setPlayIcon)();
            }
            
            lang.hitch(this, setTrackInfo)();
            
            array.forEach(playlist.getTracks(), lang.hitch(this, function (track) {
                this.own(on(track, 'onfinish', function (ev) {
                    playlist.next();
                    lang.hitch(this, setPauseIcon)();
                    lang.hitch(this, setTrackInfo)();
                }));
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
            })));
            
            this.own(on(this.nextNode, 'click', lang.hitch(this, function (ev) {
                ev.preventDefault();
                playlist.next();
                lang.hitch(this, setPauseIcon)();
                lang.hitch(this, setTrackInfo)();
            })));
        }
    });
});