require([
    "dojomat/Session",
    'dojorama/ui/_global/widget/PlayerWidget',
    "dojo/domReady!"
], function (
    Session,
    PlayerWidget
) {
    "use strict";
    
    var w1 = new PlayerWidget({ session: new Session() }, 'w1');
    w1.startup();
    w1.show();
});