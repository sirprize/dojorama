/*jshint strict:false */

define("dojorama/ui/release/widget/ReleaseGridWidget", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojomat/_StateAware",
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dgrid/editor",
    "dojo-form-controls/Checkbox",
    "dojo-form-controls/Button",
    "dojo-form-controls/Textbox",
    "dobolo/DatepickerInput",
    "dojo-data-model/Observable",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/aspect",
    "dojo/topic",
    "dojo/on",
    "dojo/when",
    "dojo/promise/all",
    "dojo/text!./template/ReleaseGridWidget.html",
    "dojo/i18n!./nls/ReleaseGridWidget"
], function (
    declare,
    lang,
    _WidgetBase,
    _TemplatedMixin,
    _StateAware,
    OnDemandGrid,
    Selection,
    editor,
    Checkbox,
    Button,
    Textbox,
    DatepickerInput,
    Observable,
    domConstruct,
    domStyle,
    domAttr,
    aspect,
    topic,
    on,
    when,
    all,
    template,
    nls
) {
    return declare([_WidgetBase, _TemplatedMixin, _StateAware], {

        router: null,
        store: null,
        templateString: template,
        filterInputWidget: null,
        filterSubmitWidget: null,
        gridWidget: null,
        gridSaveButtonWidget: null,
        gridDeleteButtonWidget: null,
        
        constructor: function (params) {
            this.request = params.request;
            this.router = params.router;
            this.store = params.store;
        },
        
        postCreate: function () {
            this.inherited(arguments);
            this.store = Observable(this.store);
            this.buildFilterForm();
            this.gridSaveButtonWidget = this.buildSaveButton();
            this.gridDeleteButtonWidget = this.buildDeleteButton();
            this.gridWidget = this.buildGrid();
            this.gridWidget.setStore(this.store); // set store and run query
        },
        
        startup: function () {
            this.filterInputWidget.startup();
            this.filterSubmitWidget.startup();
            this.gridSaveButtonWidget.startup();
            this.gridDeleteButtonWidget.startup();
        },
        
        buildFilterForm: function () {
            this.filterInputWidget = new Textbox({
                'class': domAttr.get(this.filterInputNode, 'class'), // allow the class to be set in the template
                value: this.request.getQueryParam('find')
            }, this.filterInputNode);
            
            this.filterSubmitWidget = new Button({
                type: 'submit',
                'class': domAttr.get(this.filterSubmitNode, 'class'), // allow the class to be set in the template
                label: nls.filterSubmitLabel
            }, this.filterSubmitNode);
            
            this.own(on(this.filterFormNode, 'submit', lang.hitch(this, function (ev) {
                ev.preventDefault();
                this.push(this.router.getRoute('releaseIndex').assemble(null, { find: this.filterInputWidget.value }));
            })));
        },

        buildGrid: function () {
            var columns = {
                    selector: {
                        label: ' ',
                        sortable: false,
                        renderCell: lang.hitch(this, function (model, value, node, options) {
                            var cbNode = domConstruct.create('input', {
                                type: 'checkbox'
                            }, node, 'last');
                        
                            this.own(on(cbNode, 'change', lang.hitch(this, function (ev) {
                                var row = this.gridWidget.row(model);
                            
                                if (this.gridWidget.isSelected(model.get('id'))) {
                                    this.gridWidget.deselect(row);
                                } else {
                                    this.gridWidget.select(row);
                                }
                            })));
                        })
                    },
                
                    title: {
                        label: nls.gridColumnLabelTitle,
                        field: "title",
                        sortable: true,
                        renderCell: lang.hitch(this, function (model, value, node, options) {
                            var aNode = domConstruct.create('a', {
                                href: this.router.getRoute('releaseUpdate').assemble({ id: model.get('id') }),
                                innerHTML: model.get('title')
                            }, node, 'last');
                        
                            this.own(on(aNode, 'click', lang.hitch(this, function (ev) {
                                ev.preventDefault();
                                this.push(ev.target.href);
                            })));
                        })
                    },
                
                    releaseDate: editor({
                        label: nls.gridColumnLabelReleaseDate,
                        field: "releaseDate",
                        sortable: true,
                        autoSave: false,
                        editorArgs: { required: true, 'class': 'span3', format: 'medium' }
                    }, DatepickerInput),

                    publish: editor({
                        label: nls.gridColumnLabelPublish,
                        field: "publish",
                        sortable: true,
                        autoSave: false,
                        editorArgs: { value: 'on' }
                    }, Checkbox)
                },
                gridWidget = new (declare([OnDemandGrid, Selection]))({
                    getBeforePut: true,
                    columns: columns,
                    selectionMode: 'none', // we'll do programmatic selection with a checkbox
                    //query: { find: 'xx' },
                    queryOptions: { sort: [{ attribute: 'title', descending: false }] },
                    loadingMessage: nls.gridLoadingState,
                    noDataMessage: nls.gridNoDataAvailable
                }, this.gridNode),
                countSelectedItems = function () {
                    var count = 0, i;

                    for (i in gridWidget.selection) {
                        if (gridWidget.selection.hasOwnProperty(i)) {
                            count = count + 1;
                        }
                    }

                    return count;
                }
            ;
            
            if (this.request.getQueryParam('find')) {
                gridWidget.set('query', {
                    title: this.request.getQueryParam('find')
                });
            }
            
            gridWidget.on("dgrid-error", function (evt) {
                topic.publish('ui/release/widget/ReleaseGridWidget/unknown-error', {
                    notification: {
                        message: nls.notificationUnknownError,
                        type: 'error'
                    }
                });
            });
            
            // click on title column header
            gridWidget.on(".dgrid-header .dgrid-column-title:click", lang.hitch(this, function (evt) {
                //console.dir(gridWidget.cell(evt))
            }));
            
            // click on title data cell
            gridWidget.on(".dgrid-row .dgrid-column-title:click", lang.hitch(this, function (evt) {
                //console.dir(gridWidget.row(evt));
            }));
            
            // row selected
            gridWidget.on("dgrid-select", lang.hitch(this, function (evt) {
                domStyle.set(this.gridDeleteButtonWidget.domNode, 'display', 'inline');
                //console.dir(evt.gridWidget.selection);
            }));
            
            // row deselected
            gridWidget.on("dgrid-deselect", lang.hitch(this, function (evt) {
                domStyle.set(this.gridDeleteButtonWidget.domNode, 'display', (countSelectedItems()) ? 'inline' : 'none');
                //console.dir(evt.gridWidget.selection);
            }));
            
            gridWidget.on("dgrid-datachange", lang.hitch(this, function (evt) {
                domStyle.set(this.gridSaveButtonWidget.domNode, 'display', 'inline');
            }));
            
            //var loadHandle = aspect.after(gridWidget, '_trackError', lang.hitch(this, function (promiseOrResult) {
            var loadHandle = aspect.after(this.store, 'query', lang.hitch(this, function (promiseOrResult) {
                when(
                    promiseOrResult,
                    lang.hitch(this, function (data) {
                        if (data.length) {
                            domStyle.set(this.mainNode, 'display', 'block');
                            loadHandle.remove(); // only run once and remove when data has loaded
                        }
                    })
                );
                return promiseOrResult;
            }));
            
            return gridWidget;
        },
        
        buildSaveButton: function () {
            var onUpdateOk = function () {
                    topic.publish('ui/release/widget/ReleaseGridWidget/update-ok', {
                        notification: {
                            message: nls.notificationUpdateOk,
                            type: 'ok'
                        }
                    });
                },
                onUpdateError = function (error) {
                    topic.publish('ui/release/widget/ReleaseGridWidget/update-error', {
                        notification: {
                            message: nls.notificationUpdateError,
                            type: 'error'
                        }
                    });
                },
                onClick = function () {
                    when(this.gridWidget.save(), onUpdateOk, onUpdateError);
                }
            ;
            
            return new Button({
                style: 'display: none',
                'class': domAttr.get(this.gridSaveButtonNode, 'class'), // allow the class to be set in the template
                label: nls.gridSaveButtonLabel,
                onClick: lang.hitch(this, onClick)
            }, this.gridSaveButtonNode);
        },
        
        buildDeleteButton: function () {
            var onDeleteOk = function (data) {
                    topic.publish('ui/release/widget/ReleaseGridWidget/delete-ok', {
                        notification: {
                            message: nls.notificationDeleteOk,
                            type: 'ok'
                        }
                    });
                },
                onDeleteError = function (error) {
                    topic.publish('ui/release/widget/ReleaseGridWidget/delete-error', {
                        notification: {
                            message: nls.notificationDeleteError,
                            type: 'error'
                        }
                    });
                },
                onClick = function () {
                    var d = [], i;
                    
                    for(i in this.gridWidget.selection) {
                        if (this.gridWidget.selection.hasOwnProperty(i)) {
                            d.push(this.store.remove(i));
                        }
                    }
                    
                    when(all(d), onDeleteOk, onDeleteError);
                }
            ;
            
            return new Button({
                style: 'display: none',
                'class': domAttr.get(this.gridDeleteButtonNode, 'class'), // allow the class to be set in the template
                label: nls.gridDeleteButtonLabel,
                onClick: lang.hitch(this, onClick)
            }, this.gridDeleteButtonNode);
        }
    });
});require({cache:{
'url:dojorama/ui/release/widget/template/ReleaseGridWidget.html':"<div>\n    <div class=\"clearfix\">\n        <form class=\"form-search pull-right\" data-dojo-attach-point=\"filterFormNode\">\n            <div class=\"input-append\">\n                <input data-dojo-attach-point=\"filterInputNode\" class=\"search-query\" />\n                <button data-dojo-attach-point=\"filterSubmitNode\" class=\"btn\"></button>\n            </div>\n        </form>\n    </div>\n    \n    <div data-dojo-attach-point=\"mainNode\" style=\"display:none\">\n        <div data-dojo-attach-point=\"gridNode\"></div>\n    \n        <div class=\"btn-toolbar\">\n            <button data-dojo-attach-point=\"gridSaveButtonNode\" class=\"btn\"></button>\n            <button data-dojo-attach-point=\"gridDeleteButtonNode\" class=\"btn btn-danger\"></button>\n        </div>\n    </div>\n</div>"}});
