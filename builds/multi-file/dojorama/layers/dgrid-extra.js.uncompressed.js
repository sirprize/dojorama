require({cache:{
'dgrid/OnDemandGrid':function(){
define("dgrid/OnDemandGrid", ["dojo/_base/declare", "./Grid", "./OnDemandList"], function(declare, Grid, OnDemandList){
	return declare([Grid, OnDemandList], {});
});
},
'dgrid/Grid':function(){
define("dgrid/Grid", ["dojo/_base/kernel", "dojo/_base/declare", "dojo/on", "dojo/has", "put-selector/put", "./List", "dojo/_base/sniff"],
function(kernel, declare, listen, has, put, List){
	var contentBoxSizing = has("ie") < 8 && !has("quirks");
	var invalidClassChars = /[^\._a-zA-Z0-9-]/g;	
	function appendIfNode(parent, subNode){
		if(subNode && subNode.nodeType){
			parent.appendChild(subNode);
		}
	}
	
	var Grid = declare(List, {
		columns: null,
		// cellNavigation: Boolean
		//		This indicates that focus is at the cell level. This may be set to false to cause
		//		focus to be at the row level, which is useful if you want only want row-level
		//		navigation.
		cellNavigation: true,
		tabableHeader: true,
		showHeader: true,
		column: function(target){
			// summary:
			//		Get the column object by node, or event, or a columnId
			if(typeof target == "string"){
				return this.columns[target];
			}else{
				return this.cell(target).column;
			}
		},
		listType: "grid",
		cell: function(target, columnId){
			// summary:
			//		Get the cell object by node, or event, id, plus a columnId
			
			if(target.row && target.row instanceof this._Row){ return target; }
			
			if(target.target && target.target.nodeType){
				// event
				target = target.target;
			}
			var element;
			if(target.nodeType){
				var object;
				do{
					if(this._rowIdToObject[target.id]){
						break;
					}
					var colId = target.columnId;
					if(colId){
						columnId = colId;
						element = target;
						break;
					}
					target = target.parentNode;
				}while(target && target != this.domNode);
			}
			if(!element && typeof columnId != "undefined"){
				var row = this.row(target),
					rowElement = row.element;
				if(rowElement){ 
					var elements = rowElement.getElementsByTagName("td");
					for(var i = 0; i < elements.length; i++){
						if(elements[i].columnId == columnId){
							element = elements[i];
							break;
						}
					}
				}
			}
			if(target != null){
				return {
					row: row || this.row(target),
					column: columnId && this.column(columnId),
					element: element
				};
			}
		},
		_columnsCss: function(rule){
			// This is an attempt at integration with xstyle, will probably change
			rule.fullSelector = function(){
				return this.parent.fullSelector() + " .dgrid-cell";
			};
			for(var i = 0;i < rule.children.length;i++){
				var child = rule.children[i];
				child.field = child.className = child.selector.substring(1); 
			}
			return rule.children;
		},
		createRowCells: function(tag, each, subRows){
			// summary:
			//		Generates the grid for each row (used by renderHeader and and renderRow)
			var row = put("table.dgrid-row-table[role=presentation]"),
				cellNavigation = this.cellNavigation,
				// IE < 9 needs an explicit tbody; other browsers do not
				tbody = (has("ie") < 9 || has("quirks")) ? put(row, "tbody") : row,
				tr,
				si, sl, i, l, // iterators
				subRow, column, id, extraClassName, cell, innerCell, colSpan, rowSpan; // used inside loops
			
			// Allow specification of custom/specific subRows, falling back to
			// those defined on the instance.
			subRows = subRows || this.subRows;
			
			for(si = 0, sl = subRows.length; si < sl; si++){
				subRow = subRows[si];
				// for single-subrow cases in modern browsers, TR can be skipped
				// http://jsperf.com/table-without-trs
				tr = (sl == 1 && !has("ie")) ? tbody : put(tbody, "tr");
				if(subRow.className){
					put(tr, "." + subRow.className);
				}
				
				for(i = 0, l = subRow.length; i < l; i++){
					// iterate through the columns
					column = subRow[i];
					id = column.id;
					extraClassName = column.className || (column.field && "field-" + column.field);
					cell = put(tag + (
							".dgrid-cell.dgrid-cell-padding" +
							(id ? ".dgrid-column-" + id : "") +
							(extraClassName ? "." + extraClassName : "")
						).replace(invalidClassChars,"-") +
						"[role=" + (tag === "th" ? "columnheader" : "gridcell") + "]");
					cell.columnId = id;
					if(contentBoxSizing){
						// The browser (IE7-) does not support box-sizing: border-box, so we emulate it with a padding div
						innerCell = put(cell, "!dgrid-cell-padding div.dgrid-cell-padding");// remove the dgrid-cell-padding, and create a child with that class
						cell.contents = innerCell;
					}else{
						innerCell = cell;
					}
					colSpan = column.colSpan;
					if(colSpan){
						cell.colSpan = colSpan;
					}
					rowSpan = column.rowSpan;
					if(rowSpan){
						cell.rowSpan = rowSpan;
					}
					each(innerCell, column);
					// add the td to the tr at the end for better performance
					tr.appendChild(cell);
				}
			}
			return row;
		},
		
		left: function(cell, steps){
			if(!cell.element){ cell = this.cell(cell); }
			return this.cell(this._move(cell, -(steps || 1), "dgrid-cell"));
		},
		right: function(cell, steps){
			if(!cell.element){ cell = this.cell(cell); }
			return this.cell(this._move(cell, steps || 1, "dgrid-cell"));
		},
		
		renderRow: function(object, options){
			var row = this.createRowCells("td", function(td, column){
				var data = object;
				// we support the field, get, and formatter properties like the DataGrid
				if(column.get){
					data = column.get(object);
				}else if("field" in column && column.field != "_item"){
					data = data[column.field];
				}
				if(column.formatter){
					td.innerHTML = column.formatter(data);
				}else if(column.renderCell){
					// A column can provide a renderCell method to do its own DOM manipulation, 
					// event handling, etc.
					appendIfNode(td, column.renderCell(object, data, td, options));
				}else if(data != null){
					td.appendChild(document.createTextNode(data));
				}
			}, options && options.subRows);
			// row gets a wrapper div for a couple reasons:
			//	1. So that one can set a fixed height on rows (heights can't be set on <table>'s AFAICT)
			// 2. So that outline style can be set on a row when it is focused, and Safari's outline style is broken on <table>
			return put("div[role=row]>", row);
		},
		renderHeader: function(){
			// summary:
			//		Setup the headers for the grid
			var
				grid = this,
				columns = this.columns,
				headerNode = this.headerNode,
				i = headerNode.childNodes.length;
			
			headerNode.setAttribute("role", "row");
			
			// clear out existing header in case we're resetting
			while(i--){
				put(headerNode.childNodes[i], "!");
			}
			
			var row = this.createRowCells("th", function(th, column){
				var contentNode = column.headerNode = th;
				if(contentBoxSizing){
					// we're interested in the th, but we're passed the inner div
					th = th.parentNode;
				}
				var field = column.field;
				if(field){
					th.field = field;
				}
				// allow for custom header content manipulation
				if(column.renderHeaderCell){
					appendIfNode(contentNode, column.renderHeaderCell(contentNode));
				}else if(column.label || column.field){
					contentNode.appendChild(document.createTextNode(column.label || column.field));
				}
				if(column.sortable !== false && field && field != "_item"){
					th.sortable = true;
					th.className += " dgrid-sortable";
				}
			}, this.subRows && this.subRows.headerRows);
			this._rowIdToObject[row.id = this.id + "-header"] = this.columns;
			headerNode.appendChild(row);
			// if it columns are sortable, resort on clicks
			listen(row, "click,keydown", function(event){
				// respond to click, space keypress, or enter keypress
				if(event.type == "click" || event.keyCode == 32 /* space bar */ || (!has("opera") && event.keyCode == 13) /* enter */){
					var target = event.target,
						field, descending, parentNode, sort;
					do{
						if(target.sortable){
							// stash node subject to DOM manipulations,
							// to be referenced then removed by sort()
							grid._sortNode = target;
							
							field = target.field || target.columnId;
							
							// if the click is on the same column as the active sort,
							// reverse sort direction
							descending = (sort = grid._sort[0]) && sort.attribute == field &&
								!sort.descending;
							
							return grid.set("sort", field, descending);
						}
					}while((target = target.parentNode) && target != headerNode);
				}
			});
		},
		
		resize: function(){
			// extension of List.resize to allow accounting for
			// column sizes larger than actual grid area
			var
				headerTableNode = this.headerNode.firstChild,
				contentNode = this.contentNode,
				width;
			
			this.inherited(arguments);
			
			if(!has("ie") || (has("ie") > 7 && !has("quirks"))){
				// Force contentNode width to match up with header width.
				// (Old IEs don't have a problem due to how they layout.)
				
				contentNode.style.width = ""; // reset first
				
				if(contentNode && headerTableNode){
					if((width = headerTableNode.offsetWidth) != contentNode.offsetWidth){
						// update size of content node if necessary (to match size of rows)
						// (if headerTableNode can't be found, there isn't much we can do)
						contentNode.style.width = width + "px";
					}
				}
			}
		},
		
		destroy: function(){
			// Run _destroyColumns first to perform any column plugin tear-down logic.
			this._destroyColumns();
			this.inherited(arguments);
		},
		
		_setSort: function(property, descending){
			// summary:
			//		Extension of List.js sort to update sort arrow in UI
			
			this.inherited(arguments); // normalize _sort first
			
			// clean up UI from any previous sort
			if(this._lastSortedArrow){
				// remove the sort classes from parent node
				put(this._lastSortedArrow, "<!dgrid-sort-up!dgrid-sort-down");
				// destroy the lastSortedArrow node
				put(this._lastSortedArrow, "!");
				delete this._lastSortedArrow;
			}
			
			if(!this._sort[0]){ return; } // nothing to do if no sort is specified
			
			var prop = this._sort[0].attribute,
				desc = this._sort[0].descending,
				target = this._sortNode, // stashed if invoked from header click
				columns, column, i;
			
			delete this._sortNode;
			
			if(!target){
				columns = this.columns;
				for(i in columns){
					column = columns[i];
					if(column.field == prop){
						target = column.headerNode;
						break;
					}
				}
			}
			// skip this logic if field being sorted isn't actually displayed
			if(target){
				target = target.contents || target;
				// place sort arrow under clicked node, and add up/down sort class
				this._lastSortedArrow = put(target.firstChild, "-div.dgrid-sort-arrow.ui-icon[role=presentation]");
				this._lastSortedArrow.innerHTML = "&nbsp;";
				put(target, desc ? ".dgrid-sort-down" : ".dgrid-sort-up");
				// call resize in case relocation of sort arrow caused any height changes
				this.resize();
			}
		},
		styleColumn: function(colId, css){
			// summary:
			//		Dynamically creates a stylesheet rule to alter a column's style.
			
			return this.addCssRule("#" + this.domNode.id + " .dgrid-column-" + colId, css);
		},
		
		/*=====
		_configColumn: function(column, columnId, rowColumns, prefix){
			// summary:
			//		Method called when normalizing base configuration of a single
			//		column.  Can be used as an extension point for behavior requiring
			//		access to columns when a new configuration is applied.
		},=====*/
		
		_configColumns: function(prefix, rowColumns){
			// configure the current column
			var subRow = [],
				isArray = rowColumns instanceof Array,
				columnId, column;
			for(columnId in rowColumns){
				column = rowColumns[columnId];
				if(typeof column == "string"){
					rowColumns[columnId] = column = {label:column};
				}
				if(!isArray && !column.field){
					column.field = columnId;
				}
				columnId = column.id = column.id || (isNaN(columnId) ? columnId : (prefix + columnId));
				if(prefix){ this.columns[columnId] = column; }
				
				// allow further base configuration in subclasses
				if(this._configColumn){
					this._configColumn(column, columnId, rowColumns, prefix);
				}
				
				// add grid reference to each column object for potential use by plugins
				column.grid = this;
				if(typeof column.init === "function"){ column.init(); }
				
				subRow.push(column); // make sure it can be iterated on
			}
			return isArray ? rowColumns : subRow;
		},
		
		_destroyColumns: function(){
			// summary:
			//		Iterates existing subRows looking for any column definitions with
			//		destroy methods (defined by plugins) and calls them.  This is called
			//		immediately before configuring a new column structure.
			
			var subRowsLength = this.subRows.length,
				i, j, column, len;
			
			// First remove rows (since they'll be refreshed after we're done),
			// so that anything aspected onto removeRow by plugins can run.
			// (cleanup will end up running again, but with nothing to iterate.)
			this.cleanup();
			
			for(i = 0; i < subRowsLength; i++){
				for(j = 0, len = this.subRows[i].length; j < len; j++){
					column = this.subRows[i][j];
					if(typeof column.destroy === "function"){ column.destroy(); }
				}
			}
		},
		
		configStructure: function(){
			// configure the columns and subRows
			var subRows = this.subRows;
			if(subRows){
				// we have subRows, but no columns yet, need to create the columns
				this.columns = {};
				for(var i = 0; i < subRows.length; i++){
					subRows[i] = this._configColumns(i + "-", subRows[i]);
				}
			}else{
				this.subRows = [this._configColumns("", this.columns)];
			}
		},
		_setColumns: function(columns){
			this._destroyColumns();
			// reset instance variables
			this.subRows = null;
			this.columns = columns;
			// re-run logic
			this._updateColumns();
		},
		_setSubRows: function(subrows){
			this._destroyColumns();
			this.subRows = subrows;
			this._updateColumns();
		},
		setColumns: function(columns){
			kernel.deprecated("setColumns(...)", 'use set("columns", ...) instead', "dgrid 1.0");
			this.set("columns", columns);
		},
		setSubRows: function(subrows){
			kernel.deprecated("setSubRows(...)", 'use set("subRows", ...) instead', "dgrid 1.0");
			this.set("subRows", subrows);
		},
		
		_updateColumns: function(){
			// summary:
			//		Called when columns, subRows, or columnSets are reset
			
			this.configStructure();
			this.renderHeader();
			this.refresh();
			// re-render last collection if present
			this._lastCollection && this.renderArray(this._lastCollection);
			this.resize();
		}
	});
	
	// expose appendIfNode and default implementation of renderCell,
	// e.g. for use by column plugins
	Grid.appendIfNode = appendIfNode;
	Grid.defaultRenderCell = function(object, data, td, options){
		if(data != null){ td.appendChild(document.createTextNode(data)); }
	};
	return Grid;
});

},
'dgrid/Selection':function(){
define("dgrid/Selection", ["dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/Deferred", "dojo/on", "dojo/has", "dojo/aspect", "./List", "dojo/has!touch?./util/touch", "put-selector/put", "dojo/query"],
function(kernel, declare, Deferred, on, has, aspect, List, touchUtil, put){

var ctrlEquiv = has("mac") ? "metaKey" : "ctrlKey";
return declare(null, {
	// summary:
	//		Add selection capabilities to a grid. The grid will have a selection property and
	//		fire "dgrid-select" and "dgrid-deselect" events.
	
	// selectionDelegate: String
	//		Selector to delegate to as target of selection events.
	selectionDelegate: ".dgrid-row",
	
	// selectionEvents: String
	//		Event (or events, comma-delimited) to listen on to trigger select logic.
	//		Note: this is ignored in the case of touch devices.
	selectionEvents: "mousedown,mouseup,dgrid-cellfocusin",
	
	// deselectOnRefresh: Boolean
	//		If true, the selection object will be cleared when refresh is called.
	deselectOnRefresh: true,
	
	//allowSelectAll: Boolean
	//		If true, allow ctrl/cmd+A to select all rows.
	//		Also consulted by the selector plugin for showing select-all checkbox.
	allowSelectAll: false,
	
	create: function(){
		this.selection = {};
		return this.inherited(arguments);
	},
	postCreate: function(){
		this.inherited(arguments);
		this._initSelectionEvents(); // first time; set up event hooks
	},
	
	// selection:
	//		An object where the property names correspond to 
	//		object ids and values are true or false depending on whether an item is selected
	selection: {},
	// selectionMode: String
	//		The selection mode to use, can be "none", "multiple", "single", or "extended".
	selectionMode: "extended",
	
	_setSelectionMode: function(mode){
		// summary:
		//		Updates selectionMode, resetting necessary variables.
		if(mode == this.selectionMode){ return; } // prevent unnecessary spinning
		
		// Start selection fresh when switching mode.
		this.clearSelection();
		
		this.selectionMode = mode;
	},
	setSelectionMode: function(mode){
		kernel.deprecated("setSelectionMode(...)", 'use set("selectionMode", ...) instead', "dgrid 1.0");
		this.set("selectionMode", mode);
	},
	
	_handleSelect: function(event, currentTarget){
		// don't run if selection mode is none,
		// or if coming from a dgrid-cellfocusin from a mousedown
		if(this.selectionMode == "none" ||
				(event.type == "dgrid-cellfocusin" && event.parentType == "mousedown") ||
				(event.type == "mouseup" && currentTarget != this._waitForMouseUp)){
			return;
		}
		this._waitForMouseUp = null;
		this._selectionTriggerEvent = event;
		var ctrlKey = !event.keyCode ? event[ctrlEquiv] : event.ctrlKey;
		if(!event.keyCode || !event.ctrlKey || event.keyCode == 32){
			var mode = this.selectionMode,
				row = currentTarget,
				rowObj = this.row(row),
				lastRow = this._lastSelected;
			
			if(mode == "single"){
				if(lastRow === row){
					// Allow ctrl to toggle selection, even within single select mode.
					this.select(row, null, !ctrlKey || !this.isSelected(row));
				}else{
					this.clearSelection();
					this.select(row);
					this._lastSelected = row;
				}
			}else if(this.selection[rowObj.id] && !event.shiftKey && event.type == "mousedown"){
				// we wait for the mouse up if we are clicking a selected item so that drag n' drop
				// is possible without losing our selection
				this._waitForMouseUp = row;
			}else{
				var value;
				// clear selection first for non-ctrl-clicks in extended mode,
				// as well as for right-clicks on unselected targets
				if((event.button != 2 && mode == "extended" && !ctrlKey) ||
						(event.button == 2 && !(this.selection[rowObj.id]))){
					this.clearSelection(rowObj.id, true);
				}
				if(!event.shiftKey){
					// null == toggle; undefined == true;
					lastRow = value = ctrlKey ? null : undefined;
				}
				this.select(row, lastRow, value);

				if(!lastRow){
					// update lastRow reference for potential subsequent shift+select
					// (current row was already selected by earlier logic)
					this._lastSelected = row;
				}
			}
			if(!event.keyCode && (event.shiftKey || ctrlKey)){
				// prevent selection in firefox
				event.preventDefault();
			}
		}
		this._selectionTriggerEvent = null;
	},

	_initSelectionEvents: function(){
		// summary:
		//		Performs first-time hookup of event handlers containing logic
		//		required for selection to operate.
		
		var grid = this,
			selector = this.selectionDelegate;
		
		// This is to stop IE8+'s web accelerator and selection.
		// It also stops selection in Chrome/Safari.
		on(this.domNode, "selectstart", function(event){
			// In IE, this also bubbles from text selection inside editor fields;
			// we don't want to prevent that!
			var tag = event.target && event.target.tagName;
			if(tag != "INPUT" && tag != "TEXTAREA"){
				event.preventDefault();
			}
		});
		
		function focus(event){
			grid._handleSelect(event, this);
		}
		
		if(has("touch")){
			// listen for touch taps if available
			on(this.contentNode, touchUtil.selector(selector, touchUtil.tap), function(evt){
				grid._handleSelect(evt, this);
			});
		}else{
			// listen for actions that should cause selections
			on(this.contentNode, on.selector(selector, this.selectionEvents), focus);
		}

		// If allowSelectAll is true, allow ctrl/cmd+A to (de)select all rows.
		// (Handler further checks against _allowSelectAll, which may be updated
		// if selectionMode is changed post-init.)
		if(this.allowSelectAll){
			this.on("keydown", function(event) {
				if (event[ctrlEquiv] && event.keyCode == 65) {
					event.preventDefault();
					grid[grid.allSelected ? "clearSelection" : "selectAll"]();
				}
			});
		}
		
		aspect.before(this, "removeRow", function(rowElement, justCleanup){
			var row;
			if(!justCleanup){
				row = this.row(rowElement);
				// if it is a real row removal for a selected item, deselect it
				if(row && (row.id in this.selection)){ this.deselect(rowElement); }
			}
		});
	},
	
	allowSelect: function(row){
		// summary:
		//		A method that can be overriden to determine whether or not a row (or 
		//		cell) can be selected. By default, all rows (or cells) are selectable.
		return true;
	},
	
	_selectionEventQueue: function(value, type){
		var grid = this,
			event = "dgrid-" + (value ? "select" : "deselect"),
			rows = this[event], // current event queue (actually cells for CellSelection)
			trigger = this._selectionTriggerEvent;
		
		if (trigger) {
			// If selection was triggered by another event, we want to know its type
			// to report later.  Grab it ahead of the timeout to avoid
			// "member not found" errors in IE < 9.
			trigger = trigger.type;
		}
		
		if(rows){ return rows; } // return existing queue, allowing to push more
		
		// Create a timeout to fire an event for the accumulated rows once everything is done.
		// We expose the callback in case the event needs to be fired immediately.
		setTimeout(this._fireSelectionEvent = function(){
			if(!rows){ return; } // rows will be set only the first time this is called
			
			var eventObject = {
				bubbles: true,
				grid: grid
			};
			if(trigger){ eventObject.parentType = trigger; }
			eventObject[type] = rows;
			on.emit(grid.contentNode, event, eventObject);
			rows = null;
			// clear the queue, so we create a new one as needed
			delete grid[event];
		}, 0);
		return (rows = this[event] = []);
	},
	select: function(row, toRow, value){
		if(value === undefined){
			// default to true
			value = true;
		} 
		if(!row.element){
			row = this.row(row);
		}
		if(this.allowSelect(row)){
			var selection = this.selection;
			var previousValue = selection[row.id];
			if(value === null){
				// indicates a toggle
				value = !previousValue;
			}
			var element = row.element;
			if(!value && !this.allSelected){
				delete this.selection[row.id];
			}else{
				selection[row.id] = value;
			}
			if(element){
				// add or remove classes as appropriate
				if(value){
					put(element, ".dgrid-selected.ui-state-active");
				}else{
					put(element, "!dgrid-selected!ui-state-active");
				}
			}
			if(value != previousValue && element){
				// add to the queue of row events
				this._selectionEventQueue(value, "rows").push(row);
			}
			
			if(toRow){
				if(!toRow.element){
					toRow = this.row(toRow);
				}
				var toElement = toRow.element;
				var fromElement = row.element;
				// find if it is earlier or later in the DOM
				var traverser = (toElement && (toElement.compareDocumentPosition ? 
					toElement.compareDocumentPosition(fromElement) == 2 :
					toElement.sourceIndex > fromElement.sourceIndex)) ? "down" : "up";
				while(row.element != toElement && (row = this[traverser](row))){
					this.select(row);
				}
			}
		}
	},
	deselect: function(row, toRow){
		this.select(row, toRow, false);
	},
	clearSelection: function(exceptId, dontResetLastSelected){
		// summary:
		//		Deselects any currently-selected items.
		// exceptId: Mixed?
		//		If specified, the given id will not be deselected.
		
		this.allSelected = false;
		for(var id in this.selection){
			if(exceptId !== id){
				this.deselect(id);
			}
		}
		if(!dontResetLastSelected){
			this._lastSelected = null;
		}
	},
	selectAll: function(){
		this.allSelected = true;
		this.selection = {}; // we do this to clear out pages from previous sorts
		for(var i in this._rowIdToObject){
			var row = this.row(this._rowIdToObject[i]);
			this.select(row.id);
		}
	},
	isSelected: function(object){
		if(!object){
			return false;
		}
		if(!object.element){
			object = this.row(object);
		}

		return !!this.selection[object.id];
	},
	
	refresh: function(){
		if(this.deselectOnRefresh){
			this.clearSelection();
			// Need to fire the selection event now because after the refresh,
			// the nodes that we will fire for will be gone.
			this._fireSelectionEvent && this._fireSelectionEvent();
		}
		this._lastSelected = null;
		this.inherited(arguments);
	},
	
	renderArray: function(){
		var grid = this,
			rows = this.inherited(arguments);
		
		Deferred.when(rows, function(rows){
			var selection = grid.selection,
				i, row, selected;
			for(i = 0; i < rows.length; i++){
				row = grid.row(rows[i]);
				selected = row.id in selection ? selection[row.id] : grid.allSelected;
				if(selected){
					grid.select(row, null, selected);
				}
			}
		});
		return rows;
	}
});

});

},
'dgrid/Keyboard':function(){
define("dgrid/Keyboard", [
	"dojo/_base/declare",
	"dojo/aspect",
	"dojo/on",
	"./List",
	"dojo/_base/lang",
	"dojo/has",
	"put-selector/put",
	"dojo/_base/Deferred",
	"dojo/_base/sniff"
], function(declare, aspect, on, List, lang, has, put, Deferred){

var delegatingInputTypes = {
		checkbox: 1,
		radio: 1,
		button: 1
	},
	hasGridCellClass = /\bdgrid-cell\b/,
	hasGridRowClass = /\bdgrid-row\b/;

has.add("dom-contains", function(){
	return !!document.createElement("a").contains;
});

function contains(parent, node){
	// summary:
	//		Checks to see if an element is contained by another element.
	
	if(has("dom-contains")){
		return parent.contains(node);
	}else{
		return parent.compareDocumentPosition(node) & 8 /* DOCUMENT_POSITION_CONTAINS */;
	}
}

return declare(null, {
	// summary:
	//		Add keyboard navigation capability to a grid/list
	pageSkip: 10,
	tabIndex: 0,
	
	postCreate: function(){
		this.inherited(arguments);
		var grid = this;
		
		function handledEvent(event){
			// text boxes and other inputs that can use direction keys should be ignored and not affect cell/row navigation
			var target = event.target;
			return target.type && (!delegatingInputTypes[target.type] || event.keyCode == 32);
		}
		
		function navigateArea(areaNode){
			var isFocusableClass = grid.cellNavigation ? hasGridCellClass : hasGridRowClass,
				cellFocusedElement = areaNode,
				next;
			
			function focusOnCell(element, event, dontFocus){
				var cellOrRowType = grid.cellNavigation ? "cell" : "row",
					cell = grid[cellOrRowType](element);
				
				element = cell && cell.element;
				if(!element){ return; }
				event = lang.mixin({ grid: grid }, event);
				if(event.type){
					event.parentType = event.type;
				}
				if(!event.bubbles){
					// IE doesn't always have a bubbles property already true.
					// Opera throws if you try to set it to true if it is already true.
					event.bubbles = true;
				}
				// clean up previously-focused element
				// remove the class name and the tabIndex attribute
				put(cellFocusedElement, "!dgrid-focus[!tabIndex]");
				if(cellFocusedElement){
					if(has("ie") < 8){
						// clean up after workaround below (for non-input cases)
						cellFocusedElement.style.position = "";
					}
					
					// Expose object representing focused cell or row losing focus, via
					// event.cell or event.row; which is set depends on cellNavigation.
					event[cellOrRowType] = grid[cellOrRowType](cellFocusedElement);
					on.emit(element, "dgrid-cellfocusout", event);
				}
				cellFocusedElement = element;
				
				// Expose object representing focused cell or row gaining focus, via
				// event.cell or event.row; which is set depends on cellNavigation.
				// Note that yes, the same event object is being reused; on.emit
				// performs a shallow copy of properties into a new event object.
				event[cellOrRowType] = cell;
				
				if(!dontFocus){
					if(has("ie") < 8){
						// setting the position to relative magically makes the outline
						// work properly for focusing later on with old IE.
						// (can't be done a priori with CSS or screws up the entire table)
						element.style.position = "relative";
					}
					element.tabIndex = grid.tabIndex;
					element.focus();
				}
				put(element, ".dgrid-focus");
				on.emit(cellFocusedElement, "dgrid-cellfocusin", event);
			}
			
			while((next = cellFocusedElement.firstChild) && !isFocusableClass.test(next.className)){
				cellFocusedElement = next;
			}
			if(next){ cellFocusedElement = next; }
			
			if(areaNode === grid.contentNode){
				aspect.after(grid, "renderArray", function(ret){
					// summary:
					//		Ensures the first element of a grid is always keyboard selectable after data has been
					//		retrieved if there is not already a valid focused element.
					
					return Deferred.when(ret, function(ret){
						// do not update the focused element if we already have a valid one
						if(isFocusableClass.test(cellFocusedElement.className) && contains(areaNode, cellFocusedElement)){
							return ret;
						}
						
						// ensure that the focused element is actually a grid cell, not a
						// dgrid-preload or dgrid-content element, which should not be focusable,
						// even when data is loaded asynchronously
						for(var i = 0, elements = areaNode.getElementsByTagName("*"), element; (element = elements[i]); ++i){
							if(isFocusableClass.test(element.className)){
								cellFocusedElement = element;
								break;
							}
						}
						
						cellFocusedElement.tabIndex = grid.tabIndex;
						
						return ret;
					});
				});
			}else if(isFocusableClass.test(cellFocusedElement.className)){
				cellFocusedElement.tabIndex = grid.tabIndex;
			}
			
			on(areaNode, "mousedown", function(event){
				if(!handledEvent(event)){
					focusOnCell(event.target, event);
				}
			});
			
			on(areaNode, "keydown", function(event){
				// For now, don't squash browser-specific functionalities by letting
				// ALT and META function as they would natively
				if(event.metaKey || event.altKey) {
					return;
				}
				
				var focusedElement = event.target;
				var keyCode = event.keyCode;
				if(handledEvent(event)){
					// text boxes and other inputs that can use direction keys should be ignored and not affect cell/row navigation
					return;
				}
				var move = {
					32: 0, // space bar
					33: -grid.pageSkip, // page up
					34: grid.pageSkip,// page down
					37: -1, // left
					38: -1, // up
					39: 1, // right
					40: 1, // down
					35: 10000, //end
					36: -10000 // home
				}[keyCode];
				if(isNaN(move)){
					return;
				}
				var nextSibling, columnId, cell = grid.cell(cellFocusedElement);
				var orientation;
				if(keyCode == 37 || keyCode == 39){
					// horizontal movement (left and right keys)
					if(!grid.cellNavigation){
						return; // do nothing for row-only navigation
					}
					orientation = "right";
				}else{
					// other keys are vertical
					orientation = "down";
					columnId = cell && cell.column && cell.column.id;
					cell = grid.row(cellFocusedElement);
				}
				if(move){
					cell = cell && grid[orientation](cell, move, true);
				}
				var nextFocus = cell && cell.element;
				if(nextFocus){
					if(columnId){
						nextFocus = grid.cell(nextFocus, columnId).element;
					}
					if(grid.cellNavigation){
						var inputs = nextFocus.getElementsByTagName("input");
						var inputFocused;
						for(var i = 0;i < inputs.length; i++){
							var input = inputs[i];
							if((input.tabIndex != -1 || "lastValue" in input) && !input.disabled){
								// focusing here requires the same workaround for IE<8,
								// though here we can get away with doing it all at once.
								if(has("ie") < 8){ input.style.position = "relative"; }
								input.focus();
								if(has("ie") < 8){ input.style.position = ""; }
								inputFocused = true;
								break;
							}
						}
					}
					focusOnCell(nextFocus, event, inputFocused);
				}
				event.preventDefault();
			});
			
			return function(target){
				target = target || cellFocusedElement;
				focusOnCell(target, { target: target });
			}
		}
		
		if(this.tabableHeader){
			this.focusHeader = navigateArea(this.headerNode);
		}
		
		this.focus = navigateArea(this.contentNode);
	}
});
});

},
'dgrid/editor':function(){
define("dgrid/editor", [
	"dojo/_base/kernel",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/Deferred",
	"dojo/on",
	"dojo/aspect",
	"dojo/has",
	"./Grid",
	"put-selector/put",
	"dojo/_base/sniff"
], function(kernel, lang, arrayUtil, Deferred, on, aspect, has, Grid, put){

// Variables to track info for cell currently being edited (editOn only).
var activeCell, activeValue, activeOptions;

function updateInputValue(input, value){
	// common code for updating value of a standard input
	input.value = value;
	if(input.type == "radio" || input.type == "checkbox"){
		input.checked = !!value;
	}
}

function dataFromValue(value, oldValue){
	// Default logic for translating values from editors;
	// tries to preserve type if possible.
	if(typeof oldValue == "number"){
		value = isNaN(value) ? value : parseFloat(value);
	}else if(typeof oldValue == "boolean"){
		value = value == "true" ? true : value == "false" ? false : value;
	}else if(oldValue instanceof Date){
		var asDate = new Date(value);
		value = isNaN(asDate.getTime()) ? value : asDate;
	}
	return value;
}

// intermediary frontend to dataFromValue for HTML and widget editors
function dataFromEditor(column, cmp){
	if(typeof cmp.get == "function"){ // widget
		return dataFromValue(cmp.get("value"));
	}else{ // HTML input
		return dataFromValue(
			cmp[cmp.type == "checkbox" || cmp.type == "radio"  ? "checked" : "value"]);
	}
}

function setProperty(grid, cellElement, oldValue, value, triggerEvent){
	// Updates dirty hash and fires dgrid-datachange event for a changed value.
	var cell, row, column, eventObject;
	// test whether old and new values are inequal, with coercion (e.g. for Dates)
	if(!(oldValue >= value && oldValue <= value)){
		cell = grid.cell(cellElement);
		row = cell.row;
		column = cell.column;
		if(column.field && row){
			// TODO: remove rowId in lieu of cell (or grid.row/grid.cell)
			// (keeping for the moment for back-compat, but will note in changes)
			eventObject = {
				grid: grid,
				cell: cell,
				rowId: row.id,
				oldValue: oldValue,
				value: value,
				bubbles: true,
				cancelable: true
			};
			if(triggerEvent && triggerEvent.type){
				eventObject.parentType = triggerEvent.type;
			}
			
			if(on.emit(cellElement, "dgrid-datachange", eventObject)){
				if(grid.updateDirty){
					// for OnDemandGrid: update dirty data, and save if autoSave is true
					grid.updateDirty(row.id, column.field, value);
					// perform auto-save (if applicable) in next tick to avoid
					// unintentional mishaps due to order of handler execution
					column.autoSave && setTimeout(function(){ grid._trackError("save"); }, 0);
				}
			}else{
				// Otherwise keep the value the same
				// For the sake of always-on editors, need to manually reset the value
				var cmp;
				if(cmp = cellElement.widget){
					// set _dgridIgnoreChange to prevent an infinite loop in the
					// onChange handler and prevent dgrid-datachange from firing
					// a second time
					cmp._dgridIgnoreChange = true;
					cmp.set("value", oldValue);
					setTimeout(function(){ cmp._dgridIgnoreChange = false; }, 0);
				}else if(cmp = cellElement.input){
					updateInputValue(cmp, oldValue);
				}
				
				return oldValue;
			}
		}
	}
	return value;
}

// intermediary frontend to setProperty for HTML and widget editors
function setPropertyFromEditor(grid, column, cmp, triggerEvent) {
	var value;
	if(!cmp.isValid || cmp.isValid()){
		value = setProperty(grid, (cmp.domNode || cmp).parentNode,
			activeCell ? activeValue : cmp._dgridLastValue,
			dataFromEditor(column, cmp), triggerEvent);
		
		if(activeCell){ // for editors with editOn defined
			activeValue = value;
		}else{ // for always-on editors, update _dgridLastValue immediately
			cmp._dgridLastValue = value;
		}
	}
}

// editor creation/hookup/placement logic

function createEditor(column){
	// Creates an editor instance based on column definition properties,
	// and hooks up events.
	var editor = column.editor,
		editOn = column.editOn,
		grid = column.grid,
		isWidget = typeof editor != "string", // string == standard HTML input
		args, cmp, node, putstr, handleChange;
	
	args = column.editorArgs || {};
	if(typeof args == "function"){ args = args.call(grid, column); }
	
	if(isWidget){
		cmp = new editor(args);
		node = cmp.focusNode || cmp.domNode;
		
		// Add dgrid-input to className to make consistent with HTML inputs.
		node.className += " dgrid-input";
		
		// For editOn editors, connect to onBlur rather than onChange, since
		// the latter is delayed by setTimeouts in Dijit and will fire too late.
		cmp.connect(cmp, editOn ? "onBlur" : "onChange", function(){
			if(!cmp._dgridIgnoreChange){
				setPropertyFromEditor(grid, column, this, {type: "widget"});
			}
		});
	}else{
		handleChange = function(evt){
			var target = evt.target;
			if("_dgridLastValue" in target && target.className.indexOf("dgrid-input") > -1){
				setPropertyFromEditor(grid, column, target, evt);
			}
		};

		// considerations for standard HTML form elements
		if(!column.grid._hasInputListener){
			// register one listener at the top level that receives events delegated
			grid._hasInputListener = true;
			grid.on("change", function(evt){ handleChange(evt); });
			// also register a focus listener
		}
		
		putstr = editor == "textarea" ? "textarea" :
			"input[type=" + editor + "]";
		cmp = node = put(putstr + ".dgrid-input", lang.mixin({
			name: column.field,
			tabIndex: isNaN(column.tabIndex) ? -1 : column.tabIndex
		}, args));
		
		if(has("ie") < 9 || (has("ie") && has("quirks"))){
			// IE<9 / quirks doesn't fire change events for all the right things,
			// and it doesn't bubble.
			if(editor == "radio" || editor == "checkbox"){
				// listen for clicks since IE doesn't fire change events properly for checks/radios
				on(cmp, "click", function(evt){ handleChange(evt); });
			}else{
				on(cmp, "change", function(evt){ handleChange(evt); });
			}
		}
	}
	
	// XXX: stop mousedown propagation to prevent confusing Keyboard mixin logic
	// with certain widgets; perhaps revising KB's `handledEvent` would be better.
	on(node, "mousedown", function(evt){ evt.stopPropagation(); });
	
	return cmp;
}

function createSharedEditor(column, originalRenderCell){
	// Creates an editor instance with additional considerations for
	// shared usage across an entire column (for columns with editOn specified).
	
	var cmp = createEditor(column),
		isWidget = cmp.domNode,
		node = cmp.domNode || cmp,
		focusNode = cmp.focusNode || node,
		reset = isWidget ?
			function(){ cmp.set("value", cmp._dgridLastValue); } :
			function(){
				updateInputValue(cmp, cmp._dgridLastValue);
				// call setProperty again in case we need to revert a previous change
				setPropertyFromEditor(column.grid, column, cmp);
			},
		keyHandle;
	
	function onblur(){
		var parentNode = node.parentNode,
			cell = column.grid.cell(node),
			i = parentNode.children.length - 1,
			options = { alreadyHooked: true },
			renderedNode;
		
		// Remove the editor from the cell, to be reused later.
		parentNode.removeChild(node);
		
		// Clear out the rest of the cell's contents, then re-render with new value.
		while(i--){ put(parentNode.firstChild, "!"); }
		Grid.appendIfNode(parentNode, column.renderCell(
			column.grid.row(parentNode).data, activeValue, parentNode,
			activeOptions ? lang.delegate(options, activeOptions) : options));
		
		// reset state now that editor is deactivated
		activeCell = activeValue = activeOptions = null;
		column._editorBlurHandle.pause();
	}
	
	function dismissOnKey(evt){
		// Contains logic for reacting to enter/escape keypresses to save/cancel edits.
		// Returns boolean specifying whether this key event should dismiss the field.
		var key = evt.keyCode || evt.which;
		
		if(key == 27){ // escape: revert + dismiss
			reset();
			activeValue = cmp._dgridLastValue;
			focusNode.blur();
		}else if(key == 13 && column.dismissOnEnter !== false){ // enter: dismiss
			// FIXME: Opera is "reverting" even in this case
			focusNode.blur();
		}
	}
	
	// hook up enter/esc key handling
	keyHandle = on(focusNode, "keydown", dismissOnKey);
	
	// hook up blur handler, but don't activate until widget is activated
	(column._editorBlurHandle = on.pausable(cmp, "blur", onblur)).pause();
	
	return cmp;
}

function showEditor(cmp, column, cell, value){
	// Places a shared editor into the newly-active cell in the column.
	// Also called when rendering an editor in an "always-on" editor column.
	
	var grid = column.grid,
		editor = column.editor,
		isWidget = cmp.domNode;
	
	// for regular inputs, we can update the value before even showing it
	if(!isWidget){ updateInputValue(cmp, value); }
	
	cell.innerHTML = "";
	put(cell, cmp.domNode || cmp);
	
	if(isWidget){
		// For widgets, ensure startup is called before setting value,
		// to maximize compatibility with flaky widgets like dijit/form/Select.
		if(!cmp._started){ cmp.startup(); }
		
		// Set value, but ensure it isn't processed as a user-generated change.
		// (Clear flag on a timeout to wait for delayed onChange to fire first)
		cmp._dgridIgnoreChange = true;
		cmp.set("value", value);
		setTimeout(function(){ cmp._dgridIgnoreChange = false; }, 0);
	}
	// track previous value for short-circuiting or in case we need to revert
	cmp._dgridLastValue = value;
	// if this is an editor with editOn, also update activeValue
	// (activeOptions will have been updated previously)
	if(activeCell){ activeValue = value; }
}

function edit(cell) {
	// summary:
	//		Method to be mixed into grid instances, which will show/focus the
	//		editor for a given grid cell.  Also used by renderCell.
	// cell: Object
	//		Cell (or something resolvable by grid.cell) to activate editor on.
	// returns:
	//		If the cell is editable, returns a promise resolving to the editor
	//		input/widget when the cell editor is focused.
	//		If the cell is not editable, returns null.
	
	var row, column, cellElement, dirty, field, value, cmp, dfd;
	
	if(!cell.column){ cell = this.cell(cell); }
	column = cell.column;
	field = column.field;
	cellElement = cell.element.contents || cell.element;
	
	if((cmp = column.editorInstance)){ // shared editor (editOn used)
		if(activeCell != cellElement &&
				(!column.canEdit || column.canEdit(cell.row.data, value))){
			activeCell = cellElement;
			row = cell.row;
			dirty = this.dirty && this.dirty[row.id];
			value = (dirty && field in dirty) ? dirty[field] :
				column.get ? column.get(row.data) : row.data[field];
			
			showEditor(column.editorInstance, column, cellElement, value);
			
			// focus / blur-handler-resume logic is surrounded in a setTimeout
			// to play nice with Keyboard's dgrid-cellfocusin as an editOn event
			dfd = new Deferred();
			setTimeout(function(){
				// focus the newly-placed control (supported by form widgets and HTML inputs)
				if(cmp.focus){ cmp.focus(); }
				// resume blur handler once editor is focused
				if(column._editorBlurHandle){ column._editorBlurHandle.resume(); }
				dfd.resolve(cmp);
			}, 0);
			
			return dfd.promise;
		}
	}else if(column.editor){ // editor but not shared; always-on
		cmp = cellElement.widget || cellElement.input;
		if(cmp){
			dfd = new Deferred();
			if(cmp.focus){ cmp.focus(); }
			dfd.resolve(cmp);
			return dfd.promise;
		}
	}
	return null;
}

// editor column plugin function

return function(column, editor, editOn){
	// summary:
	//		Adds editing capability to a column's cells.
	
	var originalRenderCell = column.renderCell || Grid.defaultRenderCell,
		listeners = [],
		isWidget;
	
	if(!column){ column = {}; }
	
	// accept arguments as parameters to editor function, or from column def,
	// but normalize to column def.
	column.editor = editor = editor || column.editor || "text";
	column.editOn = editOn = editOn || column.editOn;
	
	isWidget = typeof editor != "string";
	
	// warn for widgetArgs -> editorArgs; TODO: remove @ 1.0
	if(column.widgetArgs){
		kernel.deprecated("column.widgetArgs", "use column.editorArgs instead",
			"dgrid 1.0");
		column.editorArgs = column.widgetArgs;
	}
	
	aspect.after(column, "init", editOn ? function(){
		var grid = column.grid;
		if(!grid.edit){ grid.edit = edit; }
		
		// Create one shared widget/input to be swapped into the active cell.
		column.editorInstance = createSharedEditor(column, originalRenderCell);
	} : function(){
		var grid = column.grid;
		if(!grid.edit){ grid.edit = edit; }
		
		if(isWidget){
			// add advice for cleaning up widgets in this column
			listeners.push(aspect.before(grid, "removeRow", function(rowElement){
				// destroy our widget during the row removal operation
				var cellElement = grid.cell(rowElement, column.id).element,
					widget = (cellElement.contents || cellElement).widget;
				if(widget){ widget.destroyRecursive(); }
			}));
		}
	});
	
	aspect.after(column, "destroy", function(){
		arrayUtil.forEach(listeners, function(l){ l.remove(); });
		if(column._editorBlurHandle){ column._editorBlurHandle.remove(); }
		
		if(editOn && isWidget){ column.editorInstance.destroyRecursive(); }
	});
	
	column.renderCell = editOn ? function(object, value, cell, options){
		// TODO: Consider using event delegation
		// (Would require using dgrid's focus events for activating on focus,
		// which we already advocate in README for optimal use)
		
		if(!options || !options.alreadyHooked){
			// in IE<8, cell is the child of the td due to the extra padding node
			on(cell.tagName == "TD" ? cell : cell.parentNode, editOn, function(){
				activeOptions = options;
				column.grid.edit(this);
			});
		}
		
		// initially render content in non-edit mode
		return originalRenderCell.call(column, object, value, cell, options);
		
	} : function(object, value, cell, options){
		// always-on: create editor immediately upon rendering each cell
		if(!column.canEdit || column.canEdit(object, value)){
			var cmp = createEditor(column);
			showEditor(cmp, column, cell, value);
			// Maintain reference for later use.
			cell[isWidget ? "widget" : "input"] = cmp;
		}else{
			return originalRenderCell.call(column, object, value, cell, options);
		}
	};
	
	return column;
};
});

}}});
define("dojorama/layers/dgrid-extra", [], 1);
