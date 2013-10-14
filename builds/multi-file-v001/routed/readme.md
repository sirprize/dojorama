# Routed

AMD compliant library for request routing in Javascript apps

## Usage

Routed maps urls to callback functions and provides the infrastructure to assemble urls based on your url schema. This library does NOT implement behaviour to change state by means of the History API or hashes. See [Dojomat](https://github.com/sirprize/dojomat) for a solution based on Routed, the dojo widget architecture and History API.

## Request

The request object decomposes an url into it's parts and makes them available to your application

    var request = new Request('/releases?sort=release-date&order=desc');
    var path = request.getPathname(); // returns '/releases'
    var params = request.getQueryParams() // returns { sort: 'release-date', order: 'desc' }

## Routes

Start by defining the routes for your application. A route consists of a schema to match against an url and a callback defining the action to be taken if matched. The schema can contain variable parts. Path variables start with ":"
    
    // a simple route
    var releases = new Route('/releases', function(){
        // make releases page
    });

    // a route with variables - this will match urls such as /releases/ay-ay-ay
    var release = new Route('/release/:release', function(){
        // make release page
    });

## Router

Now add the routes to the router. The router is responsible for finding a route on a given request. Path variables are injected into the request object

    var router = new Router();
    router.addRoute('releases', releases);
    router.addRoute('release', release);
    
    // try to match the current request to a route
    var route = router.route(request);
    
    if(route) {
        // execute the route's callback function
        route.run(request);
    }

## Url Assembling
    
Routes provide the infrastructure to assemble urls within your application

    var targetRoute = router.getRoute('release');
    var url = targetRoute.assemble({ release: 'ay-ay-ay' }); // return '/release/ay-ay-ay'

## Running Tests In The Browser

+ Point your browser to `<routed-dir>/tests/runner.html`

## License

See LICENSE.