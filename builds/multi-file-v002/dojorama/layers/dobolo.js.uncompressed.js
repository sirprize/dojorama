require({cache:{
'dobolo/Alert':function(){
define([
    './Util',
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojo/query",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/text!./templates/Alert.html"
], function (
    Util,
    declare,
    _WidgetBase,
    _TemplatedMixin,
    query,
    lang,
    on,
    domAttr,
    domClass,
    domStyle,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        
        templateString: template,
        closable: true,
        
        postCreate: function () {
            // summary:
            //      Attach event to dismiss this alert if an immediate child-node has class="close"
            this.inherited(arguments);
            
            if (domAttr.get(this.srcNodeRef, 'data-dojo-type')) {
                // declarative instantiation assumed > hide template stuff
                domStyle.set(this.closeNode, 'display', 'none');
                domStyle.set(this.contentNode, 'display', 'none');
            }
            
            query("> *", this.domNode).forEach(lang.hitch(this, function (node) {
                if (domClass.contains(node, 'close')) {
                    this.own(on(node, 'click', lang.hitch(this, function (ev) {
                        ev.preventDefault();
                        this.close();
                    })));
                }
            }));
        },
        
        close: function () {
            // summary:
            //      Destroy itself after an optional fade transition
            var eventObj = {
                    bubbles: true,
                    cancelable: true
                },
                transition = Util.transition && domClass.contains(this.domNode, 'fade'),
                remove = function () {
                    this.emit('closed', eventObj);
                    this.destroyRecursive();
                };

            this.emit('close', eventObj);
            domClass.remove(this.domNode, 'in');
            
            if (transition) {
                on(this.domNode, Util.transition.end, lang.hitch(this, remove)());
            } else {
                lang.hitch(this, remove)();
            }
        },
        
        _setContentAttr: function (val) {
            this.contentNode.innerHTML = val;
        },
        
        _setClassAttr: function (val) {
            domClass.add(this.domNode, val);
        },
        
        _setClosableAttr: function (val) {
            domStyle.set(this.closeNode, 'display', (val) ? 'block' : 'none');
        }
    });
});
},
'dobolo/Util':function(){
define([], function () {
    "use strict";
    
    return {
        transition: (function () {
            // summary:
            //      Get name transition-end event
            var el = document.createElement('bootstrap'),
                transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd',
                    transition: 'transitionend'
                };

            for (var name in transEndEventNames) {
                if (el.style[name] !== undefined) {
                    return { end: transEndEventNames[name] };
                }
            }
        })(),
        
        // Source: https://github.com/phiggins42/plugd
        throttle: function (cb, wait, thisObj) {
            // summary:
            //      Create a function that will only execute once per `wait` periods.
            // description:
            //      Create a function that will only execute once per `wait` periods
            //      from last execution when called repeatedly. Useful for preventing excessive
            //      calculations in rapidly firing events, such as window.resize, node.mousemove
            //      and so on.
            // cb: Function
            //      The callback to fire.
            // wait: Integer
            //      time to delay before allowing cb to call again.
            // thisObj: Object?
            //      Optional execution context
            var canrun = true;
            return function () {
                if (!canrun) return;
                canrun = false;
                cb.apply(thisObj || cb, arguments);
                setTimeout(function () {
                    canrun = true;
                }, wait);
            }
        }
    };
});
},
'dobolo/Button':function(){
define([
    'dojo/_base/declare',
    'dojo-form-controls/Button',
    'mijit/registry',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/domReady!'
], function (
    declare,
    Button,
    registry,
    array,
    lang,
    domClass,
    domAttr
) {
    return declare([Button], {

        loadingText: 'Loading...',
        resetText: 'Loaded',
        mode: null,
        group: null,
        
        postCreate: function () {
            this.inherited(arguments);
            
            if (this.mode === 'radio' || this.mode === 'checkbox') {
                this.own(this.on('click', lang.hitch(this, function (ev) {
                    this.toggle();
                })));
            }
        },
        
        loading: function () {
            this.domNode.innerHTML = this.loadingText;
            domClass.add(this.domNode, 'disabled');
            domAttr.set(this.domNode, 'disabled', 'disabled');
        },
        
        reset: function () {
            this.domNode.innerHTML = this.resetText;
            domClass.remove(this.domNode, 'disabled');
            domAttr.remove(this.domNode, 'disabled');
        },
        
        toggle: function () {
            if (this.mode === 'radio') { this.deactivateGroup(); }
            domClass.toggle(this.domNode, 'active');
        },
        
        deactivateGroup: function () {
            array.forEach(registry.toArray(), lang.hitch(this, function(widget) {
                if (widget.get('mode') === 'radio' && widget.get('group') === this.group) {
                    domClass.remove(widget.domNode, 'active');
                }
            }));
        }
    });
});
},
'dobolo/DatepickerInput':function(){
define([
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
},
'dojo-form-controls/MappedTextbox':function(){
define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojo/dom-construct"
 ], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    domConstruct
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        
        templateString: '<input type="text" data-dojo-attach-point="containerNode">',
        name: '',
        valueNode: null, // <input type="hidden"> holding the serialized value
        
        _setNameAttr: function (name) {
            if (this.valueNode) {
                this.valueNode.name = name;
            }
            
            this._set('name', name);
        },
        
        _setValueAttr: function (v) {
            var v = this._parseValue(v),
                oldVal = this.get('value');
            
            if (this.valueNode) {
                this.valueNode.value = this._serializeValue(v);
            }
            
            this.domNode.value = this._formatValue(v);
            this._set('value', v);
            
            if (oldVal !== v) {
                this.onChange(v);
            }
        },
        
        _parseValue: function (v) {
            return v;
        },
        
        _serializeValue: function (v) {
            return v;
        },
        
        _formatValue: function (v) {
            return v;
        },
        
        _attrToDom: function (attr, value, commands) {
            // summary:
            //      the name must be set on the hidden field holding the serialized date to be submitted by a form.
            //      here we make sure that _WidgetBase::_attrToDom() doesn't set it on domNOde
            if (attr !== 'name') {
                this.inherited(arguments);
            }
        },
        
        onChange: function (newValue) {},
        
        _getDisplayValueAttr: function () {
            return this.domNode.value;
        },
        
        startup: function () {
            this.inherited(arguments);
            
            this.valueNode = domConstruct.create('input', {
                type: 'hidden',
                name: this.get('name'),
                value: this._serializeValue(this.get('value'))
            }, this.domNode, 'after');
        },
        
        destroy: function () {
            domConstruct.destroy(this.valueNode);
            this.inherited(arguments);
        }
    });
});
},
'dobolo/Calendar':function(){
define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojo/date",
    "dojo/query",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/text!./templates/Calendar.html",
    "dojo/i18n!dojo/cldr/nls/gregorian",
    "dojo/NodeList-dom",
    "dojo/NodeList-traverse"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    date,
    query,
    lang,
    on,
    domClass,
    domAttr,
    domConstruct,
    domStyle,
    template,
    gregorian
) {
    var _modes = [
        { clsName: 'days', navFnc: 'Month', navStep: 1 },
        { clsName: 'months', navFnc: 'FullYear', navStep: 1 },
        { clsName: 'years', navFnc: 'FullYear', navStep: 10 }
    ];

    return declare([_WidgetBase, _TemplatedMixin], {
        
        templateString: template,
        weekStart: 0,
        posTop: 0,
        posLeft: 0,
        viewMode: 0,
        date: new Date(), // the selected date
        viewDate: new Date(), // the date currently paged to by the user
        
        _setPosTop: function (val) {
            this._set('posTop', val);
        },
        
        _setPosLeft: function (val) {
            this._set('posLeft', val);
        },
        
        _setDateAttr: function (val) {
            this._set('date', val);
            
            if (this._created) {
                this.update(this.get('date'));
            }
        },
        
        _setWeekStartAttr: function (val) {
            this._set('weekStart', val || 0);
            
            if (this._created) {
                this.update(this.get('date'));
            }
        },
        
        postCreate: function () {
            this.own(on(this.domNode, 'mousedown', lang.hitch(this, 'mousedown')));
            
            this.own(on(this.domNode, 'click', function (e) {
                e.stopPropagation();
                e.preventDefault();
            }));
            
            this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
            this.fillDow();
            this.fillMonths();
            this.update(this.date);
            this.showMode();
        },
        
        position: function () {
            domStyle.set(this.domNode, {
                left: this.posLeft,
                top: this.posTop
            });
        },
        
        show: function () {
            domStyle.set(this.domNode, 'display', 'block');
            this.emit('show', {
                bubbles: true,
                cancelable: true,
                date: this.date
            });
        },
        
        hide: function (e) {
            domStyle.set(this.domNode, 'display', 'none');
            this.viewMode = 0;
            this.showMode();
            this.emit('hide', {
                bubbles: true,
                cancelable: true,
                date: this.date
            });
        },

        update: function (d) {
            var now = new Date();
            this.date = (d instanceof Date) ? new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0) : new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0);
            this.viewDate = new Date(this.date);
            this.fill();
        },
        
        fillDow: function () {
            var dowCnt = this.weekStart,
                html = '<tr>';
            while (dowCnt < this.weekStart + 7) {
                html += '<th class="dow">'+gregorian['days-standAlone-narrow'][(dowCnt++)%7]+'</th>';
            }
            html += '</tr>';
            domConstruct.place(html, query('.calendar-days thead', this.domNode)[0]);
        },
        
        fillMonths: function () {
            var html = '',
                i = 0;
            while (i < 12) {
                html += '<span class="month" data-dojo-month="'+i+'">'+gregorian['months-standAlone-abbr'][i++]+'</span>';
            }
            domConstruct.place(html, query('.calendar-months td', this.domNode)[0]);
        },
        
        fill: function (item) {
            var clsName,
                html = [],
                d = new Date(this.viewDate),
                year = d.getFullYear(),
                month = d.getMonth(),
                currentDate = this.date.valueOf(),
                currentYear = this.date.getFullYear(),
                prevMonth = new Date(year, month-1, 28,0,0,0,0),
                day = date.getDaysInMonth(prevMonth);

            query('.calendar-days th.switch', this.domNode)[0].innerHTML = gregorian['months-standAlone-wide'][month]+' '+year;

            prevMonth.setDate(day);
            prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7)%7);

            var nextMonth = new Date(prevMonth);
            nextMonth.setDate(nextMonth.getDate() + 42);
            nextMonth = nextMonth.valueOf();

            while(prevMonth.valueOf() < nextMonth) {
                if (prevMonth.getDay() === this.weekStart) {
                    html.push('<tr>');
                }
                clsName = '';
                if (prevMonth.getMonth() < month) {
                    clsName += ' old';
                } else if (prevMonth.getMonth() > month) {
                    clsName += ' new';
                }
                if (prevMonth.valueOf() === currentDate) {
                    clsName += ' active';
                }
                html.push('<td class="day'+clsName+'">'+prevMonth.getDate() + '</td>');
                if (prevMonth.getDay() === this.weekEnd) {
                    html.push('</tr>');
                }
                prevMonth.setDate(prevMonth.getDate()+1);
            }
            domConstruct.empty(query('.calendar-days tbody', this.domNode)[0]);
            domConstruct.place(html.join(' '), query('.calendar-days tbody', this.domNode)[0]);

            var months = query('.calendar-months', this.domNode);
            query('th.switch', months[0])[0].innerHTML = year;
            query('span', months[0]).removeClass('active');
            if (currentYear === year) {
                domClass.add(query('span', months[0])[this.date.getMonth()], 'active');
            }

            html = '';
            year = parseInt(year/10, 10) * 10;

            var yearCont = query('.calendar-years', this.domNode);
            query('th.switch', yearCont[0]).innerHTML = year + '-' + (year + 9);
            yearCont = query('td', yearCont[0]);

            year -= 1;
            for (var i = -1; i < 11; i++) {
                html += '<span class="year'+(i === -1 || i === 10 ? ' old' : '')+(currentYear === year ? ' active' : '')+'">'+year+'</span>';
                year += 1;
            }
            yearCont[0].innerHTML = html;
        },
        
        mousedown: function (e) {
            var month, year, day;
            e.stopPropagation();
            e.preventDefault();
            var target = query(e.target).closest('span, td, th');
            if (target.length === 1) {
                switch(target[0].nodeName.toLowerCase()) {
                    case 'th':
                        switch(target[0].className) {
                            case 'switch':
                                this.showMode(1);
                                break;
                            case 'prev':
                            case 'next':
                                this.viewDate['set'+_modes[this.viewMode].navFnc].call(
                                    this.viewDate,
                                    this.viewDate['get'+_modes[this.viewMode].navFnc].call(this.viewDate) +
                                        _modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1)
                                );
                                this.fill();
                                break;
                        }
                        break;
                    case 'span':
                        if (domClass.contains(target[0], 'month')) {
                            month = domAttr.get(target[0], 'data-dojo-month');
                            this.viewDate.setMonth(month);
                        } else {
                            var yearText = target[0].innerText || target[0].textContent;
                            year = parseInt(yearText, 10) || 0;
                            this.viewDate.setFullYear(year);
                        }
                        this.showMode(-1);
                        this.fill();
                        break;
                    case 'td':
                        if (domClass.contains(target[0], 'day')){
                            var dayText = target[0].innerText || target[0].textContent;
                            day = parseInt(dayText, 10) || 1;
                            month = this.viewDate.getMonth();
                            if (domClass.contains(target[0], 'old')) {
                                month -= 1;
                            } else if (domClass.contains(target[0], 'new')) {
                                month += 1;
                            }
                            year = this.viewDate.getFullYear();
                            this.set('date', new Date(year, month, day,0,0,0,0));
                            this.set('viewDate', new Date(year, month, day,0,0,0,0));
                            this.fill();
                            this.hide();
                        }
                        break;
                }
            }
        },
        
        showMode: function (dir) {
            if (dir) {
                this.viewMode = Math.max(0, Math.min(2, this.viewMode + dir));
            }
            
            query('>div', this.domNode).forEach(function (node) {
                domStyle.set(node, 'display', 'none');
            });
            
            query('>div.calendar-' + _modes[this.viewMode].clsName, this.domNode).forEach(function (node) {
                domStyle.set(node, 'display', 'block');
            });
        }
    });
});
},
'dojo/NodeList-traverse':function(){
define(["./query", "./_base/lang", "./_base/array"], function(dquery, lang, array){

// module:
//		dojo/NodeList-traverse

/*=====
return function(){
	// summary:
	//		Adds chainable methods to dojo/query() / NodeList instances for traversing the DOM
};
=====*/

var NodeList = dquery.NodeList;

lang.extend(NodeList, {
	_buildArrayFromCallback: function(/*Function*/ callback){
		// summary:
		//		builds a new array of possibly differing size based on the input list.
		//		Since the returned array is likely of different size than the input array,
		//		the array's map function cannot be used.
		var ary = [];
		for(var i = 0; i < this.length; i++){
			var items = callback.call(this[i], this[i], ary);
			if(items){
				ary = ary.concat(items);
			}
		}
		return ary;	//Array
	},

	_getUniqueAsNodeList: function(/*Array*/ nodes){
		// summary:
		//		given a list of nodes, make sure only unique
		//		elements are returned as our NodeList object.
		//		Does not call _stash().
		var ary = [];
		//Using for loop for better speed.
		for(var i = 0, node; node = nodes[i]; i++){
			//Should be a faster way to do this. dojo/query has a private
			//_zip function that may be inspirational, but there are pathways
			//in query that force nozip?
			if(node.nodeType == 1 && array.indexOf(ary, node) == -1){
				ary.push(node);
			}
		}
		return this._wrap(ary, null, this._NodeListCtor);	 // dojo/NodeList
	},

	_getUniqueNodeListWithParent: function(/*Array*/ nodes, /*String*/ query){
		// summary:
		//		gets unique element nodes, filters them further
		//		with an optional query and then calls _stash to track parent NodeList.
		var ary = this._getUniqueAsNodeList(nodes);
		ary = (query ? dquery._filterResult(ary, query) : ary);
		return ary._stash(this);  // dojo/NodeList
	},

	_getRelatedUniqueNodes: function(/*String?*/ query, /*Function*/ callback){
		// summary:
		//		cycles over all the nodes and calls a callback
		//		to collect nodes for a possible inclusion in a result.
		//		The callback will get two args: callback(node, ary),
		//		where ary is the array being used to collect the nodes.
		return this._getUniqueNodeListWithParent(this._buildArrayFromCallback(callback), query);  // dojo/NodeList
	},

	children: function(/*String?*/ query){
		// summary:
		//		Returns all immediate child elements for nodes in this dojo/NodeList.
		//		Optionally takes a query to filter the child elements.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// query:
		//		a CSS selector.
		// returns:
		//		all immediate child elements for the nodes in this dojo/NodeList.
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".container").children();
		//	|	});
		//		returns the four divs that are children of the container div.
		//		Running this code:
		//	|	dojo.query(".container").children(".red");
		//		returns the two divs that have the class "red".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			return lang._toArray(node.childNodes);
		}); // dojo/NodeList
	},

	closest: function(/*String*/ query, /*String|DOMNode?*/ root){
		// summary:
		//		Returns closest parent that matches query, including current node in this
		//		dojo/NodeList if it matches the query.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// query:
		//		a CSS selector.
		// root:
		//		If specified, query is relative to "root" rather than document body.
		// returns:
		//		the closest parent that matches the query, including the current
		//		node in this dojo/NodeList if it matches the query.
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		//	|		<div class="red">Red One</div>
		//	|		Some Text
		//	|		<div class="blue">Blue One</div>
		//	|		<div class="red">Red Two</div>
		//	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".red").closest(".container");
		//	|	});
		//		returns the div with class "container".
		return this._getRelatedUniqueNodes(null, function(node, ary){
			do{
				if(dquery._filterResult([node], query, root).length){
					return node;
				}
			}while(node != root && (node = node.parentNode) && node.nodeType == 1);
			return null; //To make rhino strict checking happy.
		}); // dojo/NodeList
	},

	parent: function(/*String?*/ query){
		// summary:
		//		Returns immediate parent elements for nodes in this dojo/NodeList.
		//		Optionally takes a query to filter the parent elements.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// query:
		//		a CSS selector.
		// returns:
		//		immediate parent elements for nodes in this dojo/NodeList.
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		<div class="blue first"><span class="text">Blue One</span></div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue"><span class="text">Blue Two</span></div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".text").parent();
		//	|	});
		//		returns the two divs with class "blue".
		//		Running this code:
		//	|		query(".text").parent(".first");
		//		returns the one div with class "blue" and "first".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			return node.parentNode;
		}); // dojo/NodeList
	},

	parents: function(/*String?*/ query){
		// summary:
		//		Returns all parent elements for nodes in this dojo/NodeList.
		//		Optionally takes a query to filter the child elements.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// query:
		//		a CSS selector.
		// returns:
		//		all parent elements for nodes in this dojo/NodeList.
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		<div class="blue first"><span class="text">Blue One</span></div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue"><span class="text">Blue Two</span></div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".text").parents();
		//	|	});
		//		returns the two divs with class "blue", the div with class "container",
		// 	|	the body element and the html element.
		//		Running this code:
		//	|		query(".text").parents(".container");
		//		returns the one div with class "container".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var pary = [];
			while(node.parentNode){
				node = node.parentNode;
				pary.push(node);
			}
			return pary;
		}); // dojo/NodeList
	},

	siblings: function(/*String?*/ query){
		// summary:
		//		Returns all sibling elements for nodes in this dojo/NodeList.
		//		Optionally takes a query to filter the sibling elements.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// query:
		//		a CSS selector.
		// returns:
		//		all sibling elements for nodes in this dojo/NodeList.
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".first").siblings();
		//	|	});
		//		returns the two divs with class "red" and the other div
		// 	|	with class "blue" that does not have "first".
		//		Running this code:
		//	|		query(".first").siblings(".red");
		//		returns the two div with class "red".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var pary = [];
			var nodes = (node.parentNode && node.parentNode.childNodes);
			for(var i = 0; i < nodes.length; i++){
				if(nodes[i] != node){
					pary.push(nodes[i]);
				}
			}
			return pary;
		}); // dojo/NodeList
	},

	next: function(/*String?*/ query){
		// summary:
		//		Returns the next element for nodes in this dojo/NodeList.
		//		Optionally takes a query to filter the next elements.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// query:
		//		a CSS selector.
		// returns:
		//		the next element for nodes in this dojo/NodeList.
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue last">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".first").next();
		//	|	});
		//		returns the div with class "red" and has innerHTML of "Red Two".
		//		Running this code:
		//	|	dojo.query(".last").next(".red");
		//		does not return any elements.
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var next = node.nextSibling;
			while(next && next.nodeType != 1){
				next = next.nextSibling;
			}
			return next;
		}); // dojo/NodeList
	},

	nextAll: function(/*String?*/ query){
		// summary:
		//		Returns all sibling elements that come after the nodes in this dojo/NodeList.
		//		Optionally takes a query to filter the sibling elements.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// query:
		//		a CSS selector.
		// returns:
		//		all sibling elements that come after the nodes in this dojo/NodeList.
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red next">Red Two</div>
		// 	|		<div class="blue next">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".first").nextAll();
		//	|	});
		//		returns the two divs with class of "next".
		//		Running this code:
		//	|		query(".first").nextAll(".red");
		//		returns the one div with class "red" and innerHTML "Red Two".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var pary = [];
			var next = node;
			while((next = next.nextSibling)){
				if(next.nodeType == 1){
					pary.push(next);
				}
			}
			return pary;
		}); // dojo/NodeList
	},

	prev: function(/*String?*/ query){
		// summary:
		//		Returns the previous element for nodes in this dojo/NodeList.
		//		Optionally takes a query to filter the previous elements.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// query:
		//		a CSS selector.
		// returns:
		//		the previous element for nodes in this dojo/NodeList.
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".first").prev();
		//	|	});
		//		returns the div with class "red" and has innerHTML of "Red One".
		//		Running this code:
		//	|		query(".first").prev(".blue");
		//		does not return any elements.
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var prev = node.previousSibling;
			while(prev && prev.nodeType != 1){
				prev = prev.previousSibling;
			}
			return prev;
		}); // dojo/NodeList
	},

	prevAll: function(/*String?*/ query){
		// summary:
		//		Returns all sibling elements that come before the nodes in this dojo/NodeList.
		//		Optionally takes a query to filter the sibling elements.
		// description:
		//		The returned nodes will be in reverse DOM order -- the first node in the list will
		//		be the node closest to the original node/NodeList.
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// query:
		//		a CSS selector.
		// returns:
		//		all sibling elements that come before the nodes in this dojo/NodeList.
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red prev">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue prev">Blue One</div>
		// 	|		<div class="red second">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".second").prevAll();
		//	|	});
		//		returns the two divs with class of "prev".
		//		Running this code:
		//	|		query(".first").prevAll(".red");
		//		returns the one div with class "red prev" and innerHTML "Red One".
		return this._getRelatedUniqueNodes(query, function(node, ary){
			var pary = [];
			var prev = node;
			while((prev = prev.previousSibling)){
				if(prev.nodeType == 1){
					pary.push(prev);
				}
			}
			return pary;
		}); // dojo/NodeList
	},

	andSelf: function(){
		// summary:
		//		Adds the nodes from the previous dojo/NodeList to the current dojo/NodeList.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red prev">Red One</div>
		// 	|		Some Text
		// 	|		<div class="blue prev">Blue One</div>
		// 	|		<div class="red second">Red Two</div>
		// 	|		<div class="blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".second").prevAll().andSelf();
		//	|	});
		//		returns the two divs with class of "prev", as well as the div with class "second".
		return this.concat(this._parent);	// dojo/NodeList
	},

	//Alternate methods for the :first/:last/:even/:odd pseudos.
	first: function(){
		// summary:
		//		Returns the first node in this dojo/NodeList as a dojo/NodeList.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// returns:
		//		the first node in this dojo/NodeList
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue last">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".blue").first();
		//	|	});
		//		returns the div with class "blue" and "first".
		return this._wrap(((this[0] && [this[0]]) || []), this); // dojo/NodeList
	},

	last: function(){
		// summary:
		//		Returns the last node in this dojo/NodeList as a dojo/NodeList.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// returns:
		//		the last node in this dojo/NodeList
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="red">Red One</div>
		// 	|		<div class="blue first">Blue One</div>
		// 	|		<div class="red">Red Two</div>
		// 	|		<div class="blue last">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|	query(".blue").last();
		//	|	});
		//		returns the last div with class "blue",
		return this._wrap((this.length ? [this[this.length - 1]] : []), this); // dojo/NodeList
	},

	even: function(){
		// summary:
		//		Returns the even nodes in this dojo/NodeList as a dojo/NodeList.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// returns:
		//		the even nodes in this dojo/NodeList
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="interior red">Red One</div>
		// 	|		<div class="interior blue">Blue One</div>
		// 	|		<div class="interior red">Red Two</div>
		// 	|		<div class="interior blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".interior").even();
		//	|	});
		//		returns the two divs with class "blue"
		return this.filter(function(item, i){
			return i % 2 != 0;
		}); // dojo/NodeList
	},

	odd: function(){
		// summary:
		//		Returns the odd nodes in this dojo/NodeList as a dojo/NodeList.
		// description:
		//		.end() can be used on the returned dojo/NodeList to get back to the
		//		original dojo/NodeList.
		// returns:
		//		the odd nodes in this dojo/NodeList
		// example:
		//		assume a DOM created by this markup:
		//	|	<div class="container">
		// 	|		<div class="interior red">Red One</div>
		// 	|		<div class="interior blue">Blue One</div>
		// 	|		<div class="interior red">Red Two</div>
		// 	|		<div class="interior blue">Blue Two</div>
		//	|	</div>
		//		Running this code:
		//	|	require(["dojo/query", "dojo/NodeList-traverse"
		//	|	], function(query){
		//	|		query(".interior").odd();
		//	|	});
		//		returns the two divs with class "red"
		return this.filter(function(item, i){
			return i % 2 == 0;
		}); // dojo/NodeList
	}
});

return NodeList;
});

},
'url:dobolo/templates/Alert.html':"<div class=\"alert\" data-dojo-attach-point=\"containerNode\">\n    <button data-dojo-attach-point=\"closeNode\" class=\"close\">&times;</button>\n    <div data-dojo-attach-point=\"contentNode\"></div>\n</div>",
'url:dobolo/templates/Calendar.html':"<div class=\"calendar dropdown-menu\">\n    <div class=\"calendar-days\">\n        <table class=\"table-condensed\">\n            <thead>\n                <tr>\n                    <th class=\"prev\"><i class=\"glyphicon glyphicon-arrow-left\"></i></th>\n                    <th colspan=\"5\" class=\"switch\"></th>\n                    <th class=\"next\"><i class=\"glyphicon glyphicon-arrow-right\"></i></th>\n                </tr>\n            </thead>\n            <tbody></tbody>\n        </table>\n    </div>\n    <div class=\"calendar-months\">\n        <table class=\"table-condensed\">\n            <thead>\n                <tr>\n                    <th class=\"prev\"><i class=\"glyphicon glyphicon-arrow-left\"></i></th>\n                    <th colspan=\"5\" class=\"switch\"></th>\n                    <th class=\"next\"><i class=\"glyphicon glyphicon-arrow-right\"></i></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td colspan=\"7\"></td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n    <div class=\"calendar-years\">\n        <table class=\"table-condensed\">\n            <thead>\n                <tr>\n                    <th class=\"prev\"><i class=\"glyphicon glyphicon-arrow-left\"></i></th>\n                    <th colspan=\"5\" class=\"switch\"></th>\n                    <th class=\"next\"><i class=\"glyphicon glyphicon-arrow-right\"></i></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td colspan=\"7\"></td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n</div>"}});
define("dojorama/layers/dobolo", [], 1);
