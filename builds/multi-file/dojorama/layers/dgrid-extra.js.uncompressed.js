require({cache:{
'dgrid/OnDemandGrid':function(){
define("dgrid/OnDemandGrid", ["dojo/_base/declare", "./Grid", "./OnDemandList"], function(declare, Grid, OnDemandList){
	return declare([Grid, OnDemandList], {});
});
},
'dgrid/Grid':function(){
define("dgrid/Grid", ["dojo/_base/kernel", "dojo/_base/declare", "dojo/on", "dojo/has", "put-selector/put", "./List", "./util/misc", "dojo/_base/sniff"],
function(kernel, declare, listen, has, put, List, miscUtil){
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
			
			if(target.column && target.element){ return target; }
			
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
				tr = put(tbody, "tr");
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
			var self = this;
			var row = this.createRowCells("td", function(td, column){
				var data = object;
				// Support get function or field property (similar to DataGrid)
				if(column.get){
					data = column.get(object);
				}else if("field" in column && column.field != "_item"){
					data = data[column.field];
				}
				
				if(column.renderCell){
					// A column can provide a renderCell method to do its own DOM manipulation,
					// event handling, etc.
					appendIfNode(td, column.renderCell(object, data, td, options));
				}else{
					defaultRenderCell.call(column, object, data, td, options);
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
			
			// If the columns are sortable, re-sort on clicks.
			// Use a separate listener property to be managed by renderHeader in case
			// of subsequent calls.
			if(this._sortListener){
				this._sortListener.remove();
			}
			this._sortListener = listen(row, "click,keydown", function(event){
				// respond to click, space keypress, or enter keypress
				if(event.type == "click" || event.keyCode == 32 /* space bar */ || (!has("opera") && event.keyCode == 13) /* enter */){
					var target = event.target,
						field, sort, newSort, eventObj;
					do{
						if(target.sortable){
							// If the click is on the same column as the active sort,
							// reverse sort direction
							newSort = [{
								attribute: (field = target.field || target.columnId),
								descending: (sort = grid._sort[0]) && sort.attribute == field &&
									!sort.descending
							}];
							
							// Emit an event with the new sort
							eventObj = {
								bubbles: true,
								cancelable: true,
								grid: grid,
								parentType: event.type,
								sort: newSort
							};
							
							if (listen.emit(target, "dgrid-sort", eventObj)){
								// Stash node subject to DOM manipulations,
								// to be referenced then removed by sort()
								grid._sortNode = target;
								grid.set("sort", newSort);
							}
							
							break;
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
			if(this._sortListener){
				this._sortListener.remove();
			}
			
			this.inherited(arguments);
		},
		
		_setSort: function(property, descending){
			// summary:
			//		Extension of List.js sort to update sort arrow in UI
			
			// Normalize _sort first via inherited logic, then update the sort arrow
			this.inherited(arguments);
			this.updateSortArrow(this._sort);
		},
		
		updateSortArrow: function(sort, updateSort){
			// summary:
			//		Method responsible for updating the placement of the arrow in the
			//		appropriate header cell.  Typically this should not be called (call
			//		set("sort", ...) when actually updating sort programmatically), but
			//		this method may be used by code which is customizing sort (e.g.
			//		by reacting to the dgrid-sort event, canceling it, then
			//		performing logic and calling this manually).
			// sort: Array
			//		Standard sort parameter - array of object(s) containing attribute
			//		and optionally descending property
			// updateSort: Boolean?
			//		If true, will update this._sort based on the passed sort array
			//		(i.e. to keep it in sync when custom logic is otherwise preventing
			//		it from being updated); defaults to false
			
			// Clean up UI from any previous sort
			if(this._lastSortedArrow){
				// Remove the sort classes from the parent node
				put(this._lastSortedArrow, "<!dgrid-sort-up!dgrid-sort-down");
				// Destroy the lastSortedArrow node
				put(this._lastSortedArrow, "!");
				delete this._lastSortedArrow;
			}
			
			if(updateSort){ this._sort = sort; }
			if(!sort[0]){ return; } // nothing to do if no sort is specified
			
			var prop = sort[0].attribute,
				desc = sort[0].descending,
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
			
			return this.addCssRule("#" + miscUtil.escapeCssIdentifier(this.domNode.id) +
				" .dgrid-column-" + colId, css);
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
				if(isArray){ this.columns[columnId] = column; }
				
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
			
			var subRows = this.subRows,
				// if we have column sets, then we don't need to do anything with the missing subRows, ColumnSet will handle it
				subRowsLength = subRows && subRows.length,
				i, j, column, len;
			
			// First remove rows (since they'll be refreshed after we're done),
			// so that anything aspected onto removeRow by plugins can run.
			// (cleanup will end up running again, but with nothing to iterate.)
			this.cleanup();
			
			for(i = 0; i < subRowsLength; i++){
				for(j = 0, len = subRows[i].length; j < len; j++){
					column = subRows[i][j];
					if(typeof column.destroy === "function"){ column.destroy(); }
				}
			}
		},
		
		configStructure: function(){
			// configure the columns and subRows
			var subRows = this.subRows,
				columns = this._columns = this.columns;
			
			// Reset this.columns unless it was already passed in as an object
			this.columns = !columns || columns instanceof Array ? {} : columns;
			
			if(subRows){
				// Process subrows, which will in turn populate the this.columns object
				for(var i = 0; i < subRows.length; i++){
					subRows[i] = this._configColumns(i + "-", subRows[i]);
				}
			}else{
				this.subRows = [this._configColumns("", columns)];
			}
		},
		
		_getColumns: function(){
			// _columns preserves what was passed to set("columns"), but if subRows
			// was set instead, columns contains the "object-ified" version, which
			// was always accessible in the past, so maintain that accessibility going
			// forward.
			return this._columns || this.columns;
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
			
			// After re-rendering the header, re-apply the sort arrow if needed.
			if(this._started){
				if(this._sort && this._sort.length){
					this.updateSortArrow(this._sort);
				} else {
					// Only call resize directly if we didn't call updateSortArrow,
					// since that calls resize itself when it updates.
					this.resize();
				}
			}
		}
	});
	
	function defaultRenderCell(object, data, td, options){
		if(this.formatter){
			// Support formatter, with or without formatterScope
			var formatter = this.formatter,
				formatterScope = this.grid.formatterScope;
			td.innerHTML = typeof formatter === "string" && formatterScope ?
				formatterScope[formatter](data, object) : formatter(data, object);
		}else if(data != null){
			td.appendChild(document.createTextNode(data)); 
		}
	}
	
	// expose appendIfNode and default implementation of renderCell,
	// e.g. for use by column plugins
	Grid.appendIfNode = appendIfNode;
	Grid.defaultRenderCell = defaultRenderCell;
	
	return Grid;
});

},
'dgrid/Selection':function(){
define("dgrid/Selection", ["dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/Deferred", "dojo/on", "dojo/has", "dojo/aspect", "./List", "dojo/has!touch?./util/touch", "put-selector/put", "dojo/query", "dojo/_base/sniff"],
function(kernel, declare, Deferred, on, has, aspect, List, touchUtil, put){

// Add feature test for user-select CSS property for optionally disabling
// text selection.
// (Can't use dom.setSelectable prior to 1.8.2 because of bad sniffs, see #15990)
has.add("css-user-select", function(global, doc, element){
	var style = element.style,
		prefixes = ["Khtml", "O", "ms", "Moz", "Webkit"],
		i = prefixes.length,
		name = "userSelect";

	// Iterate prefixes from most to least likely
	do{
		if(typeof style[name] !== "undefined"){
			// Supported; return property name
			return name;
		}
	}while(i-- && (name = prefixes[i] + "UserSelect"));

	// Not supported if we didn't return before now
	return false;
});

// Also add a feature test for the onselectstart event, which offers a more
// graceful fallback solution than node.unselectable.
has.add("dom-selectstart", typeof document.onselectstart !== "undefined");

var ctrlEquiv = has("mac") ? "metaKey" : "ctrlKey",
	hasUserSelect = has("css-user-select");

function makeUnselectable(node, unselectable){
	// Utility function used in fallback path for recursively setting unselectable
	var value = node.unselectable = unselectable ? "on" : "",
		elements = node.getElementsByTagName("*"),
		i = elements.length;
	
	while(--i){
		if(elements[i].tagName === "INPUT" || elements[i].tagName === "TEXTAREA"){
			continue; // Don't prevent text selection in text input fields.
		}
		elements[i].unselectable = value;
	}
}

function setSelectable(grid, selectable){
	// Alternative version of dojo/dom.setSelectable based on feature detection.
	
	// For FF < 21, use -moz-none, which will respect -moz-user-select: text on
	// child elements (e.g. form inputs).  In FF 21, none behaves the same.
	// See https://developer.mozilla.org/en-US/docs/CSS/user-select
	var node = grid.bodyNode,
		value = selectable ? "text" : has("ff") < 21 ? "-moz-none" : "none";
	
	if(hasUserSelect){
		node.style[hasUserSelect] = value;
	}else if(has("dom-selectstart")){
		// For browsers that don't support user-select but support selectstart (IE<10),
		// we can hook up an event handler as necessary.  Since selectstart bubbles,
		// it will handle any child elements as well.
		// Note, however, that both this and the unselectable fallback below are
		// incapable of preventing text selection from outside the targeted node.
		if(!selectable && !grid._selectstartHandle){
			grid._selectstartHandle = on(node, "selectstart", function(evt){
				var tag = evt.target && evt.target.tagName;
				
				// Prevent selection except where a text input field is involved.
				if(tag !== "INPUT" && tag !== "TEXTAREA"){
					evt.preventDefault();
				}
			});
		}else if(selectable && grid._selectstartHandle){
			grid._selectstartHandle.remove();
			delete grid._selectstartHandle;
		}
	}else{
		// For browsers that don't support either user-select or selectstart (Opera),
		// we need to resort to setting the unselectable attribute on all nodes
		// involved.  Since this doesn't automatically apply to child nodes, we also
		// need to re-apply it whenever rows are rendered.
		makeUnselectable(node, !selectable);
		if(!selectable && !grid._unselectableHandle){
			grid._unselectableHandle = aspect.after(grid, "renderRow", function(row){
				makeUnselectable(row, true);
				return row;
			});
		}else if(selectable && grid._unselectableHandle){
			grid._unselectableHandle.remove();
			delete grid._unselectableHandle;
		}
	}
}

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
	
	// allowSelectAll: Boolean
	//		If true, allow ctrl/cmd+A to select all rows.
	//		Also consulted by the selector plugin for showing select-all checkbox.
	allowSelectAll: false,
	
	// selection:
	//		An object where the property names correspond to 
	//		object ids and values are true or false depending on whether an item is selected
	selection: {},
	
	// selectionMode: String
	//		The selection mode to use, can be "none", "multiple", "single", or "extended".
	selectionMode: "extended",
	
	// allowTextSelection: Boolean
	//		Whether to still allow text within cells to be selected.  The default
	//		behavior is to allow text selection only when selectionMode is none;
	//		setting this property to either true or false will explicitly set the
	//		behavior regardless of selectionMode.
	allowTextSelection: undefined,
	
	create: function(){
		this.selection = {};
		return this.inherited(arguments);
	},
	postCreate: function(){
		this.inherited(arguments);
		
		// Force selectionMode setter to run.
		var selectionMode = this.selectionMode;
		this.selectionMode = "";
		this._setSelectionMode(selectionMode);
		
		this._initSelectionEvents(); // first time; set up event hooks
	},
	
	destroy: function(){
		this.inherited(arguments);
		
		// Remove any handles added for cross-browser text selection prevention.
		if(this._selectstartHandle){ this._selectstartHandle.remove(); }
		if(this._unselectableHandle){ this._unselectableHandle.remove(); }
	},
	
	_setSelectionMode: function(mode){
		// summary:
		//		Updates selectionMode, resetting necessary variables.
		if(mode == this.selectionMode){ return; } // prevent unnecessary spinning
		
		// Start selection fresh when switching mode.
		this.clearSelection();
		
		this.selectionMode = mode;
		
		// Compute name of selection handler for this mode once
		// (in the form of _fooSelectionHandler)
		this._selectionHandlerName = "_" + mode + "SelectionHandler";
		
		// Also re-run allowTextSelection setter in case it is in automatic mode.
		this._setAllowTextSelection(this.allowTextSelection);
	},
	setSelectionMode: function(mode){
		kernel.deprecated("setSelectionMode(...)", 'use set("selectionMode", ...) instead', "dgrid 1.0");
		this.set("selectionMode", mode);
	},
	
	_setAllowTextSelection: function(allow){
		if(typeof allow !== "undefined"){
			setSelectable(this, allow);
		}else{
			setSelectable(this, this.selectionMode === "none");
		}
		this.allowTextSelection = allow;
	},
	
	_handleSelect: function(event, target){
		// Don't run if selection mode doesn't have a handler (incl. "none"),
		// or if coming from a dgrid-cellfocusin from a mousedown
		if(!this[this._selectionHandlerName] ||
				(event.type == "dgrid-cellfocusin" && event.parentType == "mousedown") ||
				(event.type == "mouseup" && target != this._waitForMouseUp)){
			return;
		}
		this._waitForMouseUp = null;
		this._selectionTriggerEvent = event;
		
		// Don't call select handler for ctrl+navigation
		if(!event.keyCode || !event.ctrlKey || event.keyCode == 32){
			// If clicking a selected item, wait for mouseup so that drag n' drop
			// is possible without losing our selection
			if(!event.shiftKey && event.type == "mousedown" && this.isSelected(target)){
				this._waitForMouseUp = target;
			}else{
				this[this._selectionHandlerName](event, target);
			}
		}
		this._selectionTriggerEvent = null;
	},
	
	_singleSelectionHandler: function(event, target){
		// summary:
		//		Selection handler for "single" mode, where only one target may be
		//		selected at a time.
		
		var ctrlKey = event.keyCode ? event.ctrlKey : event[ctrlEquiv];
		if(this._lastSelected === target){
			// Allow ctrl to toggle selection, even within single select mode.
			this.select(target, null, !ctrlKey || !this.isSelected(target));
		}else{
			this.clearSelection();
			this.select(target);
			this._lastSelected = target;
		}
	},
	
	_multipleSelectionHandler: function(event, target){
		// summary:
		//		Selection handler for "multiple" mode, where shift can be held to
		//		select ranges, ctrl/cmd can be held to toggle, and clicks/keystrokes
		//		without modifier keys will add to the current selection.
		
		var lastRow = this._lastSelected,
			ctrlKey = event.keyCode ? event.ctrlKey : event[ctrlEquiv],
			value;
		
		if(!event.shiftKey){
			// Toggle if ctrl is held; otherwise select
			value = ctrlKey ? null : true;
			lastRow = null;
		}
		this.select(target, lastRow, value);

		if(!lastRow){
			// Update reference for potential subsequent shift+select
			// (current row was already selected above)
			this._lastSelected = target;
		}
	},
	
	_extendedSelectionHandler: function(event, target){
		// summary:
		//		Selection handler for "extended" mode, which is like multiple mode
		//		except that clicks/keystrokes without modifier keys will clear
		//		the previous selection.
		
		// Clear selection first for right-clicks outside selection and non-ctrl-clicks;
		// otherwise, extended mode logic is identical to multiple mode
		if(event.button === 2 ? !this.isSelected(target) :
				!(event.keyCode ? event.ctrlKey : event[ctrlEquiv])){
			this.clearSelection(null, true);
		}
		this._multipleSelectionHandler(event, target);
	},
	
	_toggleSelectionHandler: function(event, target){
		// summary:
		//		Selection handler for "toggle" mode which simply toggles the selection
		//		of the given target.  Primarily useful for touch input.
		
		this.select(target, null, null);
	},

	_initSelectionEvents: function(){
		// summary:
		//		Performs first-time hookup of event handlers containing logic
		//		required for selection to operate.
		
		var grid = this,
			selector = this.selectionDelegate;
		
		if(has("touch")){
			// listen for touch taps if available
			on(this.contentNode, touchUtil.selector(selector, touchUtil.tap), function(evt){
				grid._handleSelect(evt, this);
			});
		}else{
			// listen for actions that should cause selections
			on(this.contentNode, on.selector(selector, this.selectionEvents), function(event){
				grid._handleSelect(event, this);
			});
		}
		
		// Also hook up spacebar (for ctrl+space)
		if(this.addKeyHandler){
			this.addKeyHandler(32, function(event){
				grid._handleSelect(event, event.target);
			});
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
		if(!value || this.allowSelect(row)){
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
					this.select(row, null, value);
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
		// summary:
		//		Returns true if the indicated row is selected.
		
		if(typeof object === "undefined" || object === null){
			return false;
		}
		if(!object.element){
			object = this.row(object);
		}
		
		// First check whether the given row is indicated in the selection hash;
		// failing that, check if allSelected is true (testing against the
		// allowSelect method if possible)
		return (object.id in this.selection) ? !!this.selection[object.id] :
			this.allSelected && (!object.data || this.allowSelect(object));
	},
	
	refresh: function(){
		if(this.deselectOnRefresh){
			this.clearSelection();
			// Need to fire the selection event now because after the refresh,
			// the nodes that we will fire for will be gone.
			this._fireSelectionEvent && this._fireSelectionEvent();
		}
		this._lastSelected = null;
		return this.inherited(arguments);
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
	"dojo/_base/lang",
	"dojo/has",
	"put-selector/put",
	"dojo/_base/Deferred",
	"dojo/_base/sniff"
], function(declare, aspect, on, lang, has, put, Deferred){

var delegatingInputTypes = {
		checkbox: 1,
		radio: 1,
		button: 1
	},
	hasGridCellClass = /\bdgrid-cell\b/,
	hasGridRowClass = /\bdgrid-row\b/;

has.add("dom-contains", function(global, doc, element){
	return !!element.contains; // not supported by FF < 9
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

var Keyboard = declare(null, {
	// summary:
	//		Adds keyboard navigation capability to a list or grid.
	
	// pageSkip: Number
	//		Number of rows to jump by when page up or page down is pressed.
	pageSkip: 10,
	
	tabIndex: 0,
	
	// keyMap: Object
	//		Hash which maps key codes to functions to be executed (in the context
	//		of the instance) for key events within the grid's body.
	keyMap: null,
	
	// headerKeyMap: Object
	//		Hash which maps key codes to functions to be executed (in the context
	//		of the instance) for key events within the grid's header row.
	headerKeyMap: null,
	
	postMixInProperties: function(){
		this.inherited(arguments);
		
		if(!this.keyMap){
			this.keyMap = lang.mixin({}, Keyboard.defaultKeyMap);
		}
		if(!this.headerKeyMap){
			this.headerKeyMap = lang.mixin({}, Keyboard.defaultHeaderKeyMap);
		}
	},
	
	postCreate: function(){
		this.inherited(arguments);
		var grid = this;
		
		function handledEvent(event){
			// text boxes and other inputs that can use direction keys should be ignored and not affect cell/row navigation
			var target = event.target;
			return target.type && (!delegatingInputTypes[target.type] || event.keyCode == 32);
		}
		
		function enableNavigation(areaNode){
			var cellNavigation = grid.cellNavigation,
				isFocusableClass = cellNavigation ? hasGridCellClass : hasGridRowClass,
				isHeader = areaNode === grid.headerNode,
				initialNode = areaNode;
			
			function initHeader(){
				grid._focusedHeaderNode = initialNode =
					cellNavigation ? grid.headerNode.getElementsByTagName("th")[0] : grid.headerNode;
				if(initialNode){ initialNode.tabIndex = grid.tabIndex; }
			}
			
			if(isHeader){
				// Initialize header now (since it's already been rendered),
				// and aspect after future renderHeader calls to reset focus.
				initHeader();
				aspect.after(grid, "renderHeader", initHeader, true);
			}else{
				aspect.after(grid, "renderArray", function(ret){
					// summary:
					//		Ensures the first element of a grid is always keyboard selectable after data has been
					//		retrieved if there is not already a valid focused element.
					
					return Deferred.when(ret, function(ret){
						var focusedNode = grid._focusedNode || initialNode;
						
						// do not update the focused element if we already have a valid one
						if(isFocusableClass.test(focusedNode.className) && contains(areaNode, focusedNode)){
							return ret;
						}
						
						// ensure that the focused element is actually a grid cell, not a
						// dgrid-preload or dgrid-content element, which should not be focusable,
						// even when data is loaded asynchronously
						for(var i = 0, elements = areaNode.getElementsByTagName("*"), element; (element = elements[i]); ++i){
							if(isFocusableClass.test(element.className)){
								focusedNode = grid._focusedNode = element;
								break;
							}
						}
						
						focusedNode.tabIndex = grid.tabIndex;
						return ret;
					});
				});
			}
			
			grid._listeners.push(on(areaNode, "mousedown", function(event){
				if(!handledEvent(event)){
					grid._focusOnNode(event.target, isHeader, event);
				}
			}));
			
			grid._listeners.push(on(areaNode, "keydown", function(event){
				// For now, don't squash browser-specific functionalities by letting
				// ALT and META function as they would natively
				if(event.metaKey || event.altKey) {
					return;
				}
				
				var handler = grid[isHeader ? "headerKeyMap" : "keyMap"][event.keyCode];
				
				// Text boxes and other inputs that can use direction keys should be ignored and not affect cell/row navigation
				if(handler && !handledEvent(event)){
					handler.call(grid, event);
				}
			}));
		}
		
		if(this.tabableHeader){
			enableNavigation(this.headerNode);
			on(this.headerNode, "dgrid-cellfocusin", function(){
				grid.scrollTo({ x: this.scrollLeft });
			});
		}
		enableNavigation(this.contentNode);
	},
	
	addKeyHandler: function(key, callback, isHeader){
		// summary:
		//		Adds a handler to the keyMap on the instance.
		//		Supports binding additional handlers to already-mapped keys.
		// key: Number
		//		Key code representing the key to be handled.
		// callback: Function
		//		Callback to be executed (in instance context) when the key is pressed.
		// isHeader: Boolean
		//		Whether the handler is to be added for the grid body (false, default)
		//		or the header (true).
		
		// Aspects may be about 10% slower than using an array-based appraoch,
		// but there is significantly less code involved (here and above).
		return aspect.after( // Handle
			this[isHeader ? "headerKeyMap" : "keyMap"], key, callback, true);
	},
	
	_focusOnNode: function(element, isHeader, event){
		var focusedNodeProperty = "_focused" + (isHeader ? "Header" : "") + "Node",
			focusedNode = this[focusedNodeProperty],
			cellOrRowType = this.cellNavigation ? "cell" : "row",
			cell = this[cellOrRowType](element),
			inputs,
			input,
			numInputs,
			inputFocused,
			i;
		
		element = cell && cell.element;
		if(!element){ return; }
		
		if(this.cellNavigation){
			inputs = element.getElementsByTagName("input");
			for(i = 0, numInputs = inputs.length; i < numInputs; i++){
				input = inputs[i];
				if((input.tabIndex != -1 || "lastValue" in input) && !input.disabled){
					// Employ workaround for focus rectangle in IE < 8
					if(has("ie") < 8){ input.style.position = "relative"; }
					input.focus();
					if(has("ie") < 8){ input.style.position = ""; }
					inputFocused = true;
					break;
				}
			}
		}
		
		event = lang.mixin({ grid: this }, event);
		if(event.type){
			event.parentType = event.type;
		}
		if(!event.bubbles){
			// IE doesn't always have a bubbles property already true.
			// Opera throws if you try to set it to true if it is already true.
			event.bubbles = true;
		}
		if(focusedNode){
			// Clean up previously-focused element
			// Remove the class name and the tabIndex attribute
			put(focusedNode, "!dgrid-focus[!tabIndex]");
			if(has("ie") < 8){
				// Clean up after workaround below (for non-input cases)
				focusedNode.style.position = "";
			}
			
			// Expose object representing focused cell or row losing focus, via
			// event.cell or event.row; which is set depends on cellNavigation.
			event[cellOrRowType] = this[cellOrRowType](focusedNode);
			on.emit(element, "dgrid-cellfocusout", event);
		}
		focusedNode = this[focusedNodeProperty] = element;
		
		// Expose object representing focused cell or row gaining focus, via
		// event.cell or event.row; which is set depends on cellNavigation.
		// Note that yes, the same event object is being reused; on.emit
		// performs a shallow copy of properties into a new event object.
		event[cellOrRowType] = cell;
		
		if(!inputFocused){
			if(has("ie") < 8){
				// setting the position to relative magically makes the outline
				// work properly for focusing later on with old IE.
				// (can't be done a priori with CSS or screws up the entire table)
				element.style.position = "relative";
			}
			element.tabIndex = this.tabIndex;
			element.focus();
		}
		put(element, ".dgrid-focus");
		on.emit(focusedNode, "dgrid-cellfocusin", event);
	},
	
	focusHeader: function(element){
		this._focusOnNode(element || this._focusedHeaderNode, true);
	},
	
	focus: function(element){
		this._focusOnNode(element || this._focusedNode, false);
	}
});

// Common functions used in default keyMap (called in instance context)

var moveFocusVertical = Keyboard.moveFocusVertical = function(event, steps){
	var cellNavigation = this.cellNavigation,
		target = this[cellNavigation ? "cell" : "row"](event),
		columnId = cellNavigation && target.column.id,
		next = this.down(this._focusedNode, steps, true);
	
	// Navigate within same column if cell navigation is enabled
	if(cellNavigation){ next = this.cell(next, columnId); }
	this._focusOnNode(next, false, event);
	
	event.preventDefault();
};

var moveFocusUp = Keyboard.moveFocusUp = function(event){
	moveFocusVertical.call(this, event, -1);
};

var moveFocusDown = Keyboard.moveFocusDown = function(event){
	moveFocusVertical.call(this, event, 1);
};

var moveFocusPageUp = Keyboard.moveFocusPageUp = function(event){
	moveFocusVertical.call(this, event, -this.pageSkip);
};

var moveFocusPageDown = Keyboard.moveFocusPageDown = function(event){
	moveFocusVertical.call(this, event, this.pageSkip);
};

var moveFocusHorizontal = Keyboard.moveFocusHorizontal = function(event, steps){
	if(!this.cellNavigation){ return; }
	var isHeader = !this.row(event), // header reports row as undefined
		currentNode = this["_focused" + (isHeader ? "Header" : "") + "Node"];
	
	this._focusOnNode(this.right(currentNode, steps), isHeader, event);
	event.preventDefault();
};

var moveFocusLeft = Keyboard.moveFocusLeft = function(event){
	moveFocusHorizontal.call(this, event, -1);
};

var moveFocusRight = Keyboard.moveFocusRight = function(event){
	moveFocusHorizontal.call(this, event, 1);
};

var moveHeaderFocusEnd = Keyboard.moveHeaderFocusEnd = function(event, scrollToBeginning){
	// Header case is always simple, since all rows/cells are present
	var nodes;
	if(this.cellNavigation){
		nodes = this.headerNode.getElementsByTagName("th");
		this._focusOnNode(nodes[scrollToBeginning ? 0 : nodes.length - 1], true, event);
	}
	// In row-navigation mode, there's nothing to do - only one row in header
	
	// Prevent browser from scrolling entire page
	event.preventDefault();
};

var moveHeaderFocusHome = Keyboard.moveHeaderFocusHome = function(event){
	moveHeaderFocusEnd.call(this, event, true);
};

var moveFocusEnd = Keyboard.moveFocusEnd = function(event, scrollToTop){
	// summary:
	//		Handles requests to scroll to the beginning or end of the grid.
	
	// Assume scrolling to top unless event is specifically for End key
	var self = this,
		cellNavigation = this.cellNavigation,
		contentNode = this.contentNode,
		contentPos = scrollToTop ? 0 : contentNode.scrollHeight,
		scrollPos = contentNode.scrollTop + contentPos,
		endChild = contentNode[scrollToTop ? "firstChild" : "lastChild"],
		hasPreload = endChild.className.indexOf("dgrid-preload") > -1,
		endTarget = hasPreload ? endChild[(scrollToTop ? "next" : "previous") + "Sibling"] : endChild,
		endPos = endTarget.offsetTop + (scrollToTop ? 0 : endTarget.offsetHeight),
		handle;
	
	if(hasPreload){
		// Find the nearest dgrid-row to the relevant end of the grid
		while(endTarget && endTarget.className.indexOf("dgrid-row") < 0){
			endTarget = endTarget[(scrollToTop ? "next" : "previous") + "Sibling"];
		}
		// If none is found, there are no rows, and nothing to navigate
		if(!endTarget){ return; }
	}
	
	// Grid content may be lazy-loaded, so check if content needs to be
	// loaded first
	if(!hasPreload || endChild.offsetHeight < 1){
		// End row is loaded; focus the first/last row/cell now
		if(cellNavigation){
			// Preserve column that was currently focused
			endTarget = this.cell(endTarget, this.cell(event).column.id);
		}
		this._focusOnNode(endTarget, false, event);
	}else{
		// In IE < 9, the event member references will become invalid by the time
		// _focusOnNode is called, so make a (shallow) copy up-front
		if(!has("dom-addeventlistener")){
			event = lang.mixin({}, event);
		}
		
		// If the topmost/bottommost row rendered doesn't reach the top/bottom of
		// the contentNode, we are using OnDemandList and need to wait for more
		// data to render, then focus the first/last row in the new content.
		handle = aspect.after(this, "renderArray", function(rows){
			handle.remove();
			return Deferred.when(rows, function(rows){
				var target = rows[scrollToTop ? 0 : rows.length - 1];
				if(cellNavigation){
					// Preserve column that was currently focused
					target = self.cell(target, self.cell(event).column.id);
				}
				self._focusOnNode(target, false, event);
			});
		});
	}
	
	if(scrollPos === endPos){
		// Grid body is already scrolled to end; prevent browser from scrolling
		// entire page instead
		event.preventDefault();
	}
};

var moveFocusHome = Keyboard.moveFocusHome = function(event){
	moveFocusEnd.call(this, event, true);
};

function preventDefault(event){
	event.preventDefault();
}

Keyboard.defaultKeyMap = {
	32: preventDefault, // space
	33: moveFocusPageUp, // page up
	34: moveFocusPageDown, // page down
	35: moveFocusEnd, // end
	36: moveFocusHome, // home
	37: moveFocusLeft, // left
	38: moveFocusUp, // up
	39: moveFocusRight, // right
	40: moveFocusDown // down
};

// Header needs fewer default bindings (no vertical), so bind it separately
Keyboard.defaultHeaderKeyMap = {
	32: preventDefault, // space
	35: moveHeaderFocusEnd, // end
	36: moveHeaderFocusHome, // home
	37: moveFocusLeft, // left
	39: moveFocusRight // right
};

return Keyboard;
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
		input.checked = input.defaultChecked = !!value;
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
	if((oldValue && oldValue.valueOf()) != (value && value.valueOf())){
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
		grid = column.grid,
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
			i = parentNode.children.length - 1,
			options = { alreadyHooked: true },
			cell = grid.cell(node);
		
		// emit an event immediately prior to removing an editOn editor
		on.emit(cell.element, "dgrid-editor-hide", {
			grid: grid,
			cell: cell,
			column: column,
			editor: cmp,
			bubbles: true,
			cancelable: false
		});
		// Remove the editor from the cell, to be reused later.
		parentNode.removeChild(node);
		
		put(cell.element, "!dgrid-cell-editing");
		
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
		// Calls `focusNode.blur()` in cases where field should be dismissed.
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

function showEditor(cmp, column, cellElement, value){
	// Places a shared editor into the newly-active cell in the column.
	// Also called when rendering an editor in an "always-on" editor column.
	
	var isWidget = cmp.domNode,
		grid = column.grid;
	
	// for regular inputs, we can update the value before even showing it
	if(!isWidget){ updateInputValue(cmp, value); }
	
	cellElement.innerHTML = "";
	put(cellElement, ".dgrid-cell-editing");
	put(cellElement, cmp.domNode || cmp);
	
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
	if(activeCell){ 
		activeValue = value; 
		// emit an event immediately prior to placing a shared editor
		on.emit(cellElement, "dgrid-editor-show", {
			grid: grid,
			cell: grid.cell(cellElement),
			column: column,
			editor: cmp,
			bubbles: true,
			cancelable: false
		});
	}
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
	if(!cell || !cell.element){ return null; }
	
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
