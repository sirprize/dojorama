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
                    //this.trackArtistNode.innerHTML = playlist.getCurrentTrack().artist;
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
                formatTime = function(sec) {
                    var seconds = parseInt(sec, 10),
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
                            title: 'Pachanga Voice',
                            artist: 'Pachanga Boys',
                            cover: ''
                        }, {
                            id: 'pachangaVoice',
                            url: 'http://media.kompakt.fm/dojorama/pachanga-boys-pachanga-voice.mp3'
                    });
                    
                    playlist.addTrack({
                            title: 'The River',
                            artist: 'Pachanga Boys',
                            cover: ''
                        }, {
                            id: 'theRiver',
                            url: 'http://media.kompakt.fm/dojorama/pachanga-boys-the-river.mp3'
                    });
                    
                    playlist.addTrack({
                            title: 'Vampiros Hermanos',
                            artist: 'Pachanga Boys',
                            cover: ''
                        }, {
                            id: 'vampirosHermanos',
                            url: 'http://media.kompakt.fm/dojorama/pachanga-boys-vampiros-hermanos.mp3'
                    });
                    
                    playlist.addTrack({
                            title: 'Fiesta Forever (Reprise)',
                            artist: 'Pachanga Boys',
                            cover: ''
                        }, {
                            id: 'fiestaForever',
                            url: 'http://media.kompakt.fm/dojorama/pachanga-boys-fiesta-forever.mp3'
                    });
                    /*
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
                    */
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