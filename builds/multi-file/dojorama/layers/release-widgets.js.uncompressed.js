require({cache:{
'dojorama/ui/release/mixin/_ReleaseActionsMixin':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "../../_global/widget/ActionsWidget",
    "dojo/i18n!./nls/_ReleaseActionsMixin"
], function (
    declare,
    ActionsWidget,
    nls
) {
    return declare([], {
        
        // summary:
        //      Adds a ActionsWidget to a page-widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="actionsNode" in the template
        
        actionsWidget: null,

        postCreate: function () {
            this.inherited(arguments);
            
            this.actionsWidget = new ActionsWidget({
                actions: [
                    {
                        label: nls.indexLabel,
                        url: this.router.getRoute('releaseIndex').assemble(),
                        active: (this.router.getCurrentRouteName() === 'releaseIndex')
                    },
                    {
                        label: nls.createLabel,
                        url: this.router.getRoute('releaseCreate').assemble(),
                        active: (this.router.getCurrentRouteName() === 'releaseCreate')
                    }
                ]
            }, this.actionsNode);
        },

        startup: function () {
            this.inherited(arguments);
            this.actionsWidget.startup();
        },
        
        showReleaseActions: function () {
            this.actionsWidget.show();
        }
    });
});
},
'dojorama/ui/release/mixin/_ReleaseBreadcrumbsMixin':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "../../_global/widget/BreadcrumbsWidget",
    "dojo/i18n!./nls/_ReleaseBreadcrumbsMixin"
], function (
    declare,
    BreadcrumbsWidget,
    nls
) {
    return declare([], {
        
        // summary:
        //      Adds a BreadcrumbsWidget to a page-widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="breadcrumbsNode" in the template
        
        breadcrumbsWidget: null,
        breadcrumbsItems: {},

        postCreate: function () {
            this.inherited(arguments);
            this.breadcrumbsWidget = new BreadcrumbsWidget({}, this.breadcrumbsNode);
            
            this.breadcrumbsItems.home = {
                label: nls.homeLabel,
                url: this.router.getRoute('home').assemble()
            };
            
            this.breadcrumbsItems.releaseIndex = {
                label: nls.releaseIndexLabel,
                url: this.router.getRoute('releaseIndex').assemble()
            };
            
            this.breadcrumbsItems.releaseCreate = {
                label: nls.releaseCreateLabel,
                url: this.router.getRoute('releaseCreate').assemble()
            };
        },

        startup: function () {
            this.inherited(arguments);
            this.breadcrumbsWidget.startup();
        },
        
        setReleaseIndexBreadcrumbsItems: function () {
            var items = [
                this.breadcrumbsItems.home,
                this.breadcrumbsItems.releaseIndex
            ];
            
            this.breadcrumbsWidget.set('items', items);
        },
        
        setReleaseCreateBreadcrumbsItems: function () {
            var items = [
                this.breadcrumbsItems.home,
                this.breadcrumbsItems.releaseIndex,
                this.breadcrumbsItems.releaseCreate
            ];
            
            this.breadcrumbsWidget.set('items', items);
        },
        
        setReleaseUpdateBreadcrumbsItems: function (label) {
            var items = [
                this.breadcrumbsItems.home,
                this.breadcrumbsItems.releaseIndex,
                { label: label }
            ];
            
            this.breadcrumbsWidget.set('items', items);
        },
        
        showReleaseBreadcrumbs: function () {
            this.breadcrumbsWidget.show();
        }
    });
});
},
'dojorama/ui/release/mixin/_ReleaseComponentTitleMixin':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "dojo/i18n!./nls/_ReleaseComponentTitleMixin"
], function (
    declare,
    nls
) {
    return declare([], {
        
        // summary:
        //      Adds the title to a page-widget
        // description:
        //      This mixin can be used with any mijit/_TemplatedMixin-based widget which has
        //      a data-dojo-attach-point="sectionTitleNode" in the template

        postCreate: function () {
            this.inherited(arguments);
            this.sectionTitleNode.innerHTML = nls.sectionTitle;
        }
    });
});
},
'dojorama/ui/release/widget/ReleaseCreateFormWidget':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "../../_global/mixin/_ToggleMixin",
    "./snippet/ReleaseFormSnippet",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/text!./template/ReleaseCreateFormWidget.html",
    "dojo/i18n!./nls/ReleaseCreateFormWidget"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _ToggleMixin,
    ReleaseFormSnippet,
    lang,
    aspect,
    topic,
    domStyle,
    template,
    nls
) {
    return declare([_WidgetBase, _TemplatedMixin, _ToggleMixin], {

        store: null,
        templateString: template,
        formSnippet: null,
        
        constructor: function (params) {
            this.inherited(arguments);
            this.store = params.store;
        },

        postCreate: function () {
            this.titleNode.innerHTML = nls.title;
            var releaseModel = this.store.getModelInstance();
            
            this.inherited(arguments);
            this.hide();
            this.formSnippet = new ReleaseFormSnippet({ releaseModel: releaseModel }, this.formNode);
            
            this.own(aspect.after(releaseModel, 'save', lang.hitch(this, function (promise) {
                promise.then(
                    lang.hitch(this, function () {
                        topic.publish('ui/release/widget/ReleaseCreateFormWidget/create-ok', {
                            model: releaseModel,
                            notification: {
                                message: nls.notificationCreateOk,
                                type: 'ok'
                            }
                        });
                    }
                ));
                return promise;
            })));
        },

        startup: function () {
            this.inherited(arguments);
            this.formSnippet.startup();
            this.formSnippet.show();
        }
    });
});
},
'dojorama/ui/release/widget/snippet/ReleaseFormSnippet':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "../../../_global/mixin/_ToggleMixin",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom-style",
    "dojo/keys",
    "../../../_global/widget/ControlGroupWidget",
    "dobolo/Button",
    "dobolo/DatepickerInput",
    "dojo-form-controls/Textbox",
    "dojo-form-controls/Textarea",
    "dojo-form-controls/Checkbox",
    "dojo-form-controls/Select",
    "dojo-data-model/sync",
    "dojo/text!./template/ReleaseFormSnippet.html",
    "dojo/i18n!./nls/ReleaseFormSnippet"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _ToggleMixin,
    array,
    lang,
    domStyle,
    keys,
    ControlGroupWidget,
    Button,
    DatepickerInput,
    Textbox,
    Textarea,
    Checkbox,
    Select,
    sync,
    template,
    nls
) {
    return declare([_WidgetBase, _TemplatedMixin, _ToggleMixin], {

        releaseModel: null,
        templateString: template,
        controlGroupWidgets: {},
        submitButton: null,
        submitButtonTimeoutId: null,
        errorModel: null,
        /*
        constructor: function (params) {
            this.releaseModel = params.releaseModel;
            this.errorModel = this.releaseModel.getErrorModel();
        },
        */
        postCreate: function () {
            this.inherited(arguments);
            this.errorModel = this.releaseModel.getErrorModel();
            this.hide();
            this.build();
        },

        startup: function () {
            var prop = null;
            
            this.inherited(arguments);
            this.submitButton.startup();
            
            for (prop in this.releaseModel.getProps()) {
                if (this.releaseModel.getProps().hasOwnProperty(prop)) {
                    if (this.controlGroupWidgets[prop]) {
                        this.own(sync(this.releaseModel, prop, this.controlGroupWidgets[prop], 'value'));
                        this.own(sync(this.errorModel, prop, this.controlGroupWidgets[prop], 'error'));
                        this.controlGroupWidgets[prop].startup();
                    }
                }
            }
        },

        destroy: function () {
            this.inherited(arguments);
            this.releaseModel.destroy();
            clearTimeout(this.submitButtonTimeoutId);
        },

        _onSubmit: function (ev) {
            ev.preventDefault();
            this.submitButton.loading();
            this.onSubmit();
        },

        onSubmit: function () {
            this.releaseModel.save().then(
                lang.hitch(this, this.cancelSubmitButton),
                lang.hitch(this, this.cancelSubmitButton)
            );
        },

        build: function () {
            // change the default behaviour which only updates the value once the focus is taken off the field
            /*
            var onKeyPress = function (ev) {
                if (ev.keyCode === keys.ENTER) {
                    this.set('value', this.get('displayedValue'));
                }
            }
            */
            this.controlGroupWidgets.title = new ControlGroupWidget({
                label: nls.fieldTitleLabel,
                inputWidget: new Textbox({ 'class': 'form-control' })
            }, this.titleNode);

            this.controlGroupWidgets.format = new ControlGroupWidget({
                label: nls.fieldFormatLabel,
                inputWidget: new Select({
                     'class': 'form-control',
                    options: [
                        { value: "", label: nls.fieldFormatOptionLabel },
                        { value: "cd", label: "Cd" },
                        { value: "vinyl", label: "Vinyl" },
                        { value: "digital", label: "Digital", disabled: true }
                    ]
                })
            }, this.formatNode);

            this.controlGroupWidgets.releaseDate = new ControlGroupWidget({
                label: nls.fieldReleaseDateLabel,
                inputWidget: new DatepickerInput({ 'class': 'form-control' })
            }, this.releaseDateNode);
            
            this.controlGroupWidgets.price = new ControlGroupWidget({
                label: nls.fieldPriceLabel,
                inputWidget: new Textbox({ 'class': 'form-control' })
            }, this.priceNode);

            this.controlGroupWidgets.publish = new ControlGroupWidget({
                label: nls.fieldPublishLabel,
                inputWidget: new Checkbox({}),
                widgetProperty: 'checked'
            }, this.publishNode);

            this.controlGroupWidgets.info = new ControlGroupWidget({
                label: nls.fieldInfoLabel,
                inputWidget: new Textarea({ 'class': 'form-control' })
            }, this.infoNode);

            this.submitButton = new Button({
                type: 'submit',
                label: nls.submitLabel,
                loadingText: nls.submitBusyLabel,
                resetText: nls.submitLabel,
                'class': 'btn btn-primary'
            }, this.submitNode);
        },

        cancelSubmitButton: function () {
            this.submitButton.reset();
            /*
            // hack to make submitButton.cancel() work
            this.submitButtonTimeoutId = setTimeout(lang.hitch(this, function () {
                this.submitButton.reset();
            }), 0);
            */
        }
    });
});
},
'dojorama/ui/release/widget/ReleaseGridWidget':function(){
/*jshint strict:false */

define([
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
                        editorArgs: { required: true, 'class': 'form-control', format: 'medium' }
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
});
},
'dojorama/ui/release/widget/ReleaseUpdateFormWidget':function(){
/*jshint strict:false */

define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "../../_global/mixin/_ToggleMixin",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/topic",
    "dojo/when",
    "dojo/dom-style",
    "../../_global/widget/ProgressWidget",
    "./snippet/ReleaseFormSnippet",
    "dojo/text!./template/ReleaseUpdateFormWidget.html",
    "dojo/i18n!./nls/ReleaseUpdateFormWidget"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _ToggleMixin,
    lang,
    aspect,
    topic,
    when,
    domStyle,
    ProgressWidget,
    ReleaseFormSnippet,
    template,
    nls
) {
    return declare([_WidgetBase, _TemplatedMixin, _ToggleMixin], {
        
        store: null,
        releaseId: null,
        templateString: template,
        formSnippet: null,
        progressWidget: null,
        
        constructor: function (params) {
            this.releaseId = params.releaseId;
        },

        postscript: function (params) {
            this.inherited(arguments);
            this.store = params.store;
        },

        postCreate: function () {
            this.inherited(arguments);
            this.hide();
            this.progressWidget = new ProgressWidget({}, this.progressNode);
        },

        startup: function () {
            this.inherited(arguments);
            this.progressWidget.startup();
            this.progressWidget.show();
            var promise = this.store.get(this.releaseId);
            
            when(
                promise,
                lang.hitch(this, function (model) {
                    if (!model) { // usage with synchronous store
                        topic.publish('ui/release/widget/ReleaseUpdateFormWidget/load-not-found', {});
                    } else {
                        this.progressWidget.hide();
                        domStyle.set(this.mainNode, 'display', 'block');
                        this.formSnippet = new ReleaseFormSnippet({ releaseModel: model }, this.formNode);
                        
                        this.own(aspect.before(this.formSnippet, 'onSubmit', lang.hitch(this, function () {
                            topic.publish('ui/release/widget/ReleaseUpdateFormWidget/submit', {});
                        })));

                        this.own(aspect.after(model, 'save', lang.hitch(this, function (promise) {
                            promise.then(
                                lang.hitch(this, function () {
                                    this.titleNode.innerHTML = model.get('title');
                                    topic.publish('ui/release/widget/ReleaseUpdateFormWidget/update-ok', {
                                        model: model,
                                        notification: {
                                            message: nls.notificationUpdateOk,
                                            type: 'ok'
                                        }
                                    });
                                }
                            ));
                            return promise;
                        })));
                        
                        this.titleNode.innerHTML = model.get('title');
                        this.formSnippet.startup();
                        this.formSnippet.show();
                        topic.publish('ui/release/widget/ReleaseUpdateFormWidget/load-ok', model);
                    }
                }),
                lang.hitch(this, function (error) {
                    if (error.response.status === 404) {
                        topic.publish('ui/release/widget/ReleaseUpdateFormWidget/load-not-found', {});
                    } else {
                        topic.publish('ui/release/widget/ReleaseUpdateFormWidget/load-error', {});
                    }
                })
            );
        }
    });
});
},
'url:dojorama/ui/release/widget/snippet/template/ReleaseFormSnippet.html':"<form data-dojo-attach-event=\"onsubmit:_onSubmit\">\n    <div data-dojo-attach-point=\"titleNode\"></div>\n    <div data-dojo-attach-point=\"formatNode\"></div>\n    <div data-dojo-attach-point=\"releaseDateNode\"></div>\n    <div data-dojo-attach-point=\"priceNode\"></div>\n    <div data-dojo-attach-point=\"infoNode\"></div>\n    <div data-dojo-attach-point=\"publishNode\"></div>\n\n    <div class=\"form-group\">\n        <button data-dojo-attach-point=\"submitNode\">Save</button>\n    </div>\n</form>",
'url:dojorama/ui/release/widget/template/ReleaseCreateFormWidget.html':"<div>\n    <h2 data-dojo-attach-point=\"titleNode\"></h2><hr>\n    <div data-dojo-attach-point=\"formNode\"></div>\n</div>",
'url:dojorama/ui/release/widget/template/ReleaseGridWidget.html':"<div>\n    <div class=\"clearfix\">\n        <form class=\"form-inline pull-right\" data-dojo-attach-point=\"filterFormNode\">\n            <div class=\"form-group\">\n                <input data-dojo-attach-point=\"filterInputNode\" class=\"form-control\">\n            </div>\n            <button data-dojo-attach-point=\"filterSubmitNode\" class=\"btn\"></button>\n        </form>\n    </div>\n\n    <br>\n    \n    <div data-dojo-attach-point=\"mainNode\" style=\"display:none\">\n        <div data-dojo-attach-point=\"gridNode\"></div>\n    \n        <div class=\"btn-toolbar\">\n            <button data-dojo-attach-point=\"gridSaveButtonNode\" class=\"btn\"></button>\n            <button data-dojo-attach-point=\"gridDeleteButtonNode\" class=\"btn btn-danger\"></button>\n        </div>\n    </div>\n</div>",
'url:dojorama/ui/release/widget/template/ReleaseUpdateFormWidget.html':"<div>\n    <div data-dojo-attach-point=\"progressNode\"></div>\n    \n    <div data-dojo-attach-point=\"mainNode\" style=\"display:none\">\n        <h2 data-dojo-attach-point=\"titleNode\"></h2><hr>\n        <div data-dojo-attach-point=\"formNode\"></div>\n    </div>\n</div>",
'*now':function(r){r(['dojo/i18n!*preload*dojorama/layers/nls/release-widgets*["ar","ca","cs","da","de","el","en-gb","en-us","es-es","fi-fi","fr-fr","he-il","hu","it-it","ja-jp","ko-kr","nl-nl","nb","pl","pt-br","pt-pt","ru","sk","sl","sv","th","tr","zh-tw","zh-cn","ROOT"]']);}
}});
define("dojorama/layers/release-widgets", [], 1);
