require([
    "dojo/dom",
    "dojo/on",
    "dojo-form-controls/Textbox",
    'dojorama/ui/_global/widget/ControlGroupWidget',
    "dojo/domReady!"
], function (
    dom,
    on,
    Textbox,
    ControlGroupWidget
) {
    "use strict";

    var w1 = new ControlGroupWidget({
        label: 'Some Label',
        value: 'aaaa',
        inputWidget: new Textbox({
            id: 'some-input',
            'class': 'form-control'
        })
    }, 'w1');

    w1.startup();

    on(dom.byId('w1-ok'), 'click', function () {
        w1.set('error', '');
    });

    on(dom.byId('w1-error'), 'click', function () {
        w1.set('error', 'Input required');
    });
});