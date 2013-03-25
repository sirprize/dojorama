// http://dojotoolkit.org/reference-guide/1.7/build/index.html (Documentation)
// http://dojotoolkit.org/reference-guide/1.7/build/qref.html (Reference for Optimization Build Program)
// http://dojotoolkit.org/documentation/tutorials/1.7/build/ (Creating Builds)
// http://www.sitepen.com/blog/2012/06/12/feature-detection-and-device-optimized-builds/ (Feature Detection and Device Optimized Builds)
// http://www.sitepen.com/blog/2012/06/11/dgrid-and-dojo-nano-build/
// http://jamesthom.as/blog/2012/08/03/finding-nano/
// http://dojotoolkit.org/reference-guide/1.8/build/localizationExample.html


////////////////////////////////////////////////////
// Define arrays of layer contents to facilitate including and excluding for individual layers.
// The dojo base stuff is split into separate layers - each layer should be smaller than 25k uncompressed
// (iPhone won't cache components bigger than 25K)

var doscho = [
    "dojo/sniff",
    "dojo/has",
    "dojo/_base/config",
    "dojo/_base/declare",
    "dojo/_base/kernel",
    "dojo/_base/lang"
];

var d01 = [
    "dojo/_base/connect",
    "dojo/on",
    "dojo/topic",
    "dojo/Evented",
    "dojo/aspect",
    "dojo/_base/event",
    "dojo/dom-geometry",
    "dojo/_base/window",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/mouse",
    "dojo/_base/sniff",
    "dojo/keys"
];

var d02 = [
    "dojo/Deferred",
    "dojo/promise/all",
    "dojo/promise/first",
    "dojo/promise/Promise",
    "dojo/when"
];

var d03 = [
    "dojo/ready",
    "dojo/_base/unload",
    "dojo/_base/window"
];

var d04 = [
    "dojo/_base/xhr"
];

var d05 = [
    "dojo/_base/array",
    "dojo/_base/html"
];

var d06 = [
    "dojo/_base/NodeList",
    "dojo/query"
];

var d07 = [
    "dojo/window",
    "dojo/touch",
    "dojo/Stateful",
    "dojo/cache",
    "dojo/cookie",
    "dojo/i18n",
    "dojo/regexp",
    "dojo/string",
    "dojo/text",
    //"dojo/parser",
    "dojo/_base/url"
];

var d08 = [
    "dojo/date/locale",
    "dojo/date/stamp",
	"dojo/date",
	"dojo/cldr/supplemental",
	"dojo/cldr/nls/gregorian"
];

var d09 = [
    "dojo/store/Cache",
    "dojo/store/JsonRest",
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dojo/store/util/QueryResults",
    "dojo/store/util/SimpleQueryEngine",
    // dojo-sm2-playlist
    "dojo-sm2-playlist/Playlist"
];

var mijit = [
    "mijit/_TemplatedMixin",
    "mijit/_WidgetBase",
    "mijit/_WidgetsInTemplateMixin",
    "mijit/Destroyable",
    "mijit/main",
    "mijit/registry"
];

var app = [
    "dojomat/_AppAware",
    "dojomat/_StateAware",
    "dojomat/Application",
    "dojomat/Notification",
    "dojomat/populateRouter",
    "dojomat/Session",
    "dojorama/routing-map",
    "dojorama/App"
];

var model = [
    "dojo-local-storage/LocalStorage",
    "dojo-data-model/_CrudModel",
    "dojo-data-model/DataModel",
    "dojo-data-model/ModelStore",
    "dojo-data-model/Observable",
    "dojo-data-model/QueryResults",
    "dojo-data-model/sync",
    "dojorama/model/ReleaseModel"
];

var form = [
    "dojo-form-controls/Button",
    "dojo-form-controls/Checkbox",
    "dojo-form-controls/Option",
    "dojo-form-controls/Radio",
    "dojo-form-controls/Select",
    "dojo-form-controls/Textarea",
    "dojo-form-controls/Textbox"
];

var dobolo = [
    "dobolo/Alert",
    "dobolo/Button",
    "dobolo/DatepickerInput"
];

var base = [].concat(
    d01,
    d02,
    d03,
    d04,
    d05,
    d06,
    d07,
    d08,
    d09,
    mijit,
    app,
    model,
    form,
    dobolo
);

////////////////////////////////////////////////////

var dgridCommon = [
	"put-selector/put",
	"xstyle/has-class",
	"xstyle/css",
	"dgrid/List",
	"dgrid/util/misc",
	"dgrid/OnDemandList",
	"dgrid/_StoreMixin"
];

var dgridExtra = [
    "dgrid/OnDemandGrid",
	"dgrid/Grid",
    "dgrid/Selection",
    "dgrid/Keyboard",
    "dgrid/editor"
];

////////////////////////////////////////////////////

var globalStuff = [
    "dojorama/ui/_global/mixin/_FooterMixin",
    "dojorama/ui/_global/mixin/_NavigationMixin",
    "dojorama/ui/_global/mixin/_NotificationMixin",
    "dojorama/ui/_global/mixin/_PlayerMixin",
    "dojorama/ui/_global/mixin/_ToggleMixin",
    "dojorama/ui/_global/widget/ActionsWidget",
    "dojorama/ui/_global/widget/BreadcrumbsWidget",
    "dojorama/ui/_global/widget/ControlGroupWidget",
    "dojorama/ui/_global/widget/FooterWidget",
    "dojorama/ui/_global/widget/NavigationWidget",
    "dojorama/ui/_global/widget/PlayerWidget",
    "dojorama/ui/_global/widget/ProgressWidget"
];

var releaseWidgets = [
    "dojorama/ui/release/mixin/_ReleaseActionsMixin",
    "dojorama/ui/release/mixin/_ReleaseBreadcrumbsMixin",
    "dojorama/ui/release/mixin/_ReleaseComponentTitleMixin",
    "dojorama/ui/release/widget/ReleaseCreateFormWidget",
    "dojorama/ui/release/widget/ReleaseGridWidget",
    "dojorama/ui/release/widget/ReleaseUpdateFormWidget"
];

var releasePages = [
    "dojorama/ui/release/ReleaseCreatePage",
    "dojorama/ui/release/ReleaseIndexPage",
    "dojorama/ui/release/ReleaseUpdatePage"
];

var home = [
    "dojorama/ui/home/HomePage"
];

var storage = [
    "dojorama/ui/storage/widget/RowWidget",
    "dojorama/ui/storage/StoragePage"
];



var profile = {
    releaseDir: "./multi-file",
    basePath: ".",
    action: "release",
    cssOptimize: "comments",
    mini: true,
    optimize: "closure",
    layerOptimize: "closure",
    stripConsole: "none", // all|none
    selectorEngine: "acme",
    packages:[
        { name: "dojo", location: "../vendor/dojo/dojo" },
        { name: "dgrid", location: "../vendor/SitePen/dgrid" },
        { name: "xstyle", location: "../vendor/kriszyp/xstyle" },
        { name: "put-selector", location: "../vendor/kriszyp/put-selector" },
        { name: "dobolo", location: "../vendor/sirprize/dobolo" },
        { name: 'dojo-data-model', location: '../vendor/sirprize/dojo-data-model' },
        { name: "dojo-form-controls", location: "../vendor/sirprize/dojo-form-controls" },
        { name: 'dojo-local-storage', location: '../vendor/sirprize/dojo-local-storage' },
        { name: 'dojo-sm2-playlist', location: '../vendor/sirprize/dojo-sm2-playlist' },
        { name: "dojomat", location: "../vendor/sirprize/dojomat" },
        { name: "mijit", location: "../vendor/sirprize/mijit" },
        { name: "routed", location: "../vendor/sirprize/routed" },
        { name: 'dojorama', location: '..' }
    ],
 
    layers: {
        // This is the main loader module. It is a little special because it is treated like an AMD module even though
        // it is actually just plain JavaScript. There is some extra magic in the build system specifically for this
        // module ID.
        "dojo/dojo": {
            include: doscho,
            // By default, the build system will try to include dojo/main in the built dojo/dojo layer, which adds a
            // bunch of stuff we don’t want or need. We want the initial script load to be as small and quick as
            // possible, so we configure it as a custom, bootable base.
            customBase: true
        },
        "dojorama/layers/d01": {
            include: d01
        },
        "dojorama/layers/d02": {
            include: d02,
            exclude: [].concat(d01)
        },
        "dojorama/layers/d03": {
            include: d03,
            exclude: [].concat(d01, d02)
        },
        "dojorama/layers/d04": {
            include: d04,
            exclude: [].concat(d01, d02, d03)
        },
        "dojorama/layers/d05": {
            include: d05,
            exclude: [].concat(d01, d02, d03, d04)
        },
        "dojorama/layers/d06": {
            include: d06,
            exclude: [].concat(d01, d02, d03, d04, d05)
        },
        "dojorama/layers/d07": {
            include: d07,
            exclude: [].concat(d01, d02, d03, d04, d05, d06)
        },
        "dojorama/layers/d08": {
            include: d08,
            exclude: [].concat(d01, d02, d03, d04, d05, d06, d07)
        },
        "dojorama/layers/d09": {
            include: d09,
            exclude: [].concat(d01, d02, d03, d04, d05, d06, d07, d08)
        },
        "dojorama/layers/mijit": {
            include: mijit,
            exclude: [].concat(d01, d02, d03, d04, d05, d06, d07, d08, d09)
        },
        "dojorama/layers/app": {
            include: app,
            exclude: [].concat(d01, d02, d03, d04, d05, d06, d07, d08, d09, mijit)
        },
        "dojorama/layers/model": {
            include: model,
            exclude: [].concat(d01, d02, d03, d04, d05, d06, d07, d08, d09, mijit, app)
        },
        "dojorama/layers/form": {
            include: form,
            exclude: [].concat(d01, d02, d03, d04, d05, d06, d07, d08, d09, mijit, app, model)
        },
        "dojorama/layers/dobolo": {
            include: dobolo,
            exclude: [].concat(d01, d02, d03, d04, d05, d06, d07, d08, d09, mijit, app, model, form)
        },
        "dojorama/layers/dgrid-common": {
            include: dgridCommon,
            exclude: [].concat(base)
        },
        "dojorama/layers/dgrid-extra": {
            include: dgridExtra,
            exclude: [].concat(base, dgridCommon)
        },
        "dojorama/layers/global-stuff": {
            include: globalStuff,
            exclude: [].concat(base, dgridCommon, dgridExtra)
        },
        "dojorama/layers/release-widgets": {
            include: releaseWidgets,
            exclude: [].concat(base, dgridCommon, dgridExtra, globalStuff)
        },
        "dojorama/layers/release-pages": {
            include: releasePages,
            exclude: [].concat(base, dgridCommon, dgridExtra, globalStuff, releaseWidgets)
        },
        "dojorama/layers/home": {
            include: home,
            exclude: [].concat(base)
        },
        "dojorama/layers/storage": {
            include: storage,
            exclude: [].concat(base)
        }
    },

    // Providing hints to the build system allows code to be conditionally removed on a more granular level than
    // simple module dependencies can allow. This is especially useful for creating tiny mobile builds.
    // Keep in mind that dead code removal only happens in minifiers that support it! Currently, ShrinkSafe does not
    // support dead code removal; Closure Compiler and UglifyJS do.
    staticHasFeatures: {
        // The trace & log APIs are used for debugging the loader, so we don’t need them in the build
        'dojo-trace-api':0,
        'dojo-log-api':0,

        // This causes normally private loader data to be exposed for debugging, so we don’t need that either
        'dojo-publish-privates':0,

        // We’re fully async, so get rid of the legacy loader
        'dojo-sync-loader':0,
        
        // dojo-xhr-factory relies on dojo-sync-loader
        'dojo-xhr-factory':0,

        // We aren’t loading tests in production
        'dojo-test-sniff':0
    }
};