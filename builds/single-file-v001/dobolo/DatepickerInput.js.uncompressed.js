define("dobolo/DatepickerInput", [
    "dojo/_base/declare",
    "dojo/_base/window",
    "dojo/_base/lang",
    "dojo/date/locale",
    "dojo/date/stamp",
    "dojo/on",
    "dojo/dom-geometry",
    "dojo-form-controls/MappedTextbox",
    "./Calendar"
 ], function (
    declare,
    win,
    lang,
    locale,
    stamp,
    on,
    domGeom,
    MappedTextbox,
    Calendar
) {
    return declare([MappedTextbox], {
        
        displayFormat: 'full', // the date format length used for display
        weekStart: 0,
        
        _setWeekStartAttr: function (weekStart) {
            this._set('weekStart', weekStart);
        },

        _parseValue: function (v) {
            if (v instanceof Date) {
                return v;
            } else if (v) {
                return stamp.fromISOString(v);
            }
            return null;
        },
        
        _serializeValue: function (v) {
            return (v instanceof Date) ? stamp.toISOString(v, { selector: 'date' }) : '';
        },
        
        _formatValue: function (v) {
            var f = this.get('displayFormat');
            f = (f === 'long' || f === 'short' || f === 'medium' || f === 'full') ? f : 'full';
            return (v instanceof Date) ? locale.format(v, { selector: 'date', formatLength: f }) : '';
        },

        positionCalendar: function () {
            var pos = domGeom.position(this.domNode, true);
            this.calendar.set('posTop', (pos.y + this.domNode.offsetHeight) + 'px');
            this.calendar.set('posLeft', pos.x + 'px');
            this.calendar.position();
        },
        
        showCalendar: function () {
            this.calendar.placeAt(document.body, 'last');
            this.positionCalendar();
            this.calendar.show();
        },
        
        hideCalendar: function () {
            this.calendar.hide();
        },
        
        postCreate: function () {
            this.inherited(arguments);
            
            this.own(this.calendar = new Calendar({
                weekStart: this.weekStart,
                date: this.get('value')
            }));
            
            this.own(this.watch('value', lang.hitch(this, function (prop, old, val) {
                this.calendar.set('date', val);
            })));
            
            this.own(this.calendar.watch('date', lang.hitch(this, function (prop, old, val) {
                this.set('value', val);
            })));
            
            this.own(on(this.calendar, 'show', lang.hitch(this, function (ev) {
                this.emit('show-calendar', {
                    bubbles: true,
                    cancelable: true
                });
            })));
            
            this.own(on(this.calendar, 'hide', lang.hitch(this, function (ev) {
                this.emit('hide-calendar', {
                    bubbles: true,
                    cancelable: true
                });
            })));
            
            this.calendar.startup();
            this.own(on(win.global, 'resize', lang.hitch(this, 'positionCalendar')));
            this.own(on(this.domNode, 'focus', lang.hitch(this, 'showCalendar')));
            this.own(on(this.domNode, 'click', lang.hitch(this, 'showCalendar')));
            this.own(on(this.domNode, 'blur', lang.hitch(this, 'hideCalendar')));
            
            this.own(on(this.domNode, 'keydown', lang.hitch(this, function (e) {
                if (e.keyCode === 9 || e.keyCode === 13) {
                    this.calendar.hide();
                }
            })));
            
            this.own(on(this.domNode, 'keyup', lang.hitch(this, function (e) {
                // make domNode read-only
                this.domNode.value = this._formatValue(this.get('value'));
            })));
        }
    });
});