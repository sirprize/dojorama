[historyApi]: https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history/
[dojoWidget]: http://dojotoolkit.org/documentation/tutorials/1.8/templated/
[routedRepo]: https://github.com/sirprize/routed

# Dojomat

Dojomat is an Application controller for single page applications based on the [Dojo widget][dojoWidget] architecture and [History API][historyApi]. It launches and manages the lifecycle of your application and assists in the dispatching of state changes to callback functions registered in [Routed][routedRepo] routes.

## Sequence Of Operations

+ Load routes into Router
+ Register `window.popstate` handler
+ Handle current state
    + Find a route based on the current URL
    + Call the callback function registered with the current route
        + Instantiate top-level page widget and place it into the DOM
+ On `window.popstate` events
    + Destroy existing top-level page widget and start over by handling the new state

## Usage

Here's how to build your own custom app:

    define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojomat/Application",
        "dojomat/populateRouter",
        "dojo/domReady!"
    ], function(
        declare,
        lang,
        Application,
        populateRouter
    ) {
        return declare([Application], {
            constructor: function () {
                populateRouter(this, {
                    home: {
                        schema: '/',
                        widget: 'my/HomePage'
                    },
                    productIndex: {
                        schema: '/products',
                        widget: 'my/ProductIndexPage'
                    },
                    productDetail: {
                        schema: '/product/:id',
                        widget: 'my/ProductDetailPage'
                    }
                });
                this.run();
            }
        });
    });

Note the call to `populateRouter` in the constructor - `populateRouter` is a utility function to populate the router from a simple routing map object. Instead of manually creating callback functions for all our routes, we pass it a map object and `populateRouter` dojomatically creates the callbacks for us, instantiates the route objects and registers them with the router. The resulting callback functions will instantiate top-level widgets based on the `widget` property in the routing map object. An object with the following properties is passed to the page-level constructor upon instantiation:

    {
        router: router, // instance of Routed/Router
        request: request, // instance of Routed/Request
        notification: { message: 'Well done!', type: 'ok' } // only if available - more info below
    }

## _AppAware Mixin

The `_AppAware` mixin has a small set of methods to facilitate page-level error handling and assists in the manipulation of top level things such as dynamically setting stylesheets. Here's a typical top-level page widget:

    define([
        "dojo/_base/declare",
        "mijit/_WidgetBase", // github.com/sirprize/mijit
        "mijit/_TemplatedMixin", // github.com/sirprize/mijit
        "dojomat/_AppAware",
        "dojo/text!./templates/HomePage.html",
        "dojo/text!./css/HomePage.css"
    ], function (
        declare,
        WidgetBase,
        TemplatedMixin,
        AppAware,
        template,
        css
    ) {
        return declare([WidgetBase, TemplatedMixin, AppAware], {
            templateString: template,
            
            postCreate: function () {
                var somethingWentWrong = false;
                
                if(somethingWentWrong) {
                    this.makeErrorPage({ message: 'Ouch' });
                }
                
                this.inherited(arguments);
                this.setCss(css);
                this.setTitle('Home');
            }
        });
    });

## _StateAware Mixin

The `_StateAware` mixin simplifies the task of pushing to a new state. When clicked and if supported by the browser, the following widget will trigger `history.pushState()` by calling `this.push(url)`. If the history API is not supported, the requested URL is set to `window.location` which causes the browser to request the URL from the server.

    define([
        "dojo/_base/declare",
        "mijit/_WidgetBase", // github.com/sirprize/mijit
        "mijit/_TemplatedMixin", // github.com/sirprize/mijit
        "dojomat/_StateAware",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/text!./templates/SomeWidget.html"
    ], function (
        declare,
        WidgetBase,
        TemplatedMixin,
        StateAware,
        lang,
        on,
        template
    ) {
        return declare([WidgetBase, TemplatedMixin, StateAware], {
            router: null,
            templateString: template,
            
            postCreate: function () {
                this.own(on(this, 'click', lang.hitch(this, function (ev) {
                    var url = this.router.getRoute('productDetail').assemble({ id: '123' });
                    this.push(url);
                })));
            }
        });
    });

Note how we ask the router for the desired target route which assembles the URL based on the registered schema. This makes the application quite maintainable since the URL schema can be changed quickly without much risk of creating dead links throughout our application.

## Passing Notifications Across Pages

There might be situations where you want to pass notifications from one page to the next to inform the user that something interesting has happened. For example if you have a form page that lets users create a new product and upon successful creation, you would redirect (push) to an update-form with the new product loaded.

Register a notification message on the creation page:

    this.setNotification('Product successfully created, 'ok');

... and on the update page you could do something like this:

    var notificationWidget = new NotificationWidget();
    
    if (this.notification) {
        notificationWidget.set('message', this.notification.message);
        notificationWidget.set('type', this.notification.type);
        notificationWidget.show();
    }

If you register a notification, it will be passed as an argument to the constructor of the following page. Notifications are stored in `LocalStorage`. If `LocalStorage` is not supported by the browser, the notification is stored in a cookie which let's you use this mechanism even on browsers without support for the history API.

## Feature Detection

Dojomat tests for the availability of the history API and `LocalStorage` and registers those tests with `dojo/has`: The following feature names are available to your code:

+ `native-history-state`
+ `native-localstorage`

## License

See LICENSE.