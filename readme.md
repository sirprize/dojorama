## Dojorama

Single page demo application based on Dojo, Twitter Bootstrap and history API

## Documentation

Check out the [live demo](http://dojorama.org) and the series of blog posts explaining the concepts behind this application - [Building a Dojo single page application](http://sirprize.me/scribble/dojorama-introduction-building-a-dojo-single-page-application/)

## Quick Start

+ `git clone git://github.com/sirprize/dojorama.git`
+ `cd dojorama`
+ `git submodule init`
+ `git submodule update`
+ Create a virtual host with root pointing to `dojorama` (project root == www root)
+ Point your browser to `/` or `/tests`

## Ingredients

Dojorama is built on top of these fine libraries:

+ [dojo/dojo](http://github.com/dojo/dojo) - The Dojo Toolkit
+ [dojo/utils](http://github.com/dojo/util) - Dojo build tool and unit testing (DOH)
+ [SitePen/dgrid](http://github.com/SitePen/dgrid) - Dojo grid widget
+ [kriszyp/put-selector](http://github.com/kriszyp/put-selector) - DOM manipulation (dependency of dgrid)
+ [kriszyp/xstyle](http://github.com/kriszyp/xstyle) - CSS loader (dependency of dgrid)
+ [twbs/bootstrap](http://github.com/twbs/bootstrap) - Frontend framework (CSS only)
+ [scottschiller/SoundManager2](http://github.com/scottschiller/SoundManager2) - JavaScript sound API
+ [sirprize/mijit](http://github.com/sirprize/mijit) - Essential Dijit stuff (`_WidgetBase`, `_TemplatedMixin` and `registry`)
+ [sirprize/dojomat](http://github.com/sirprize/dojomat) - Application controller
+ [sirprize/routed](http://github.com/sirprize/routed) - Routing
+ [sirprize/dobolo](http://github.com/sirprize/dobolo) - Dojo port of some Twitter Bootstrap JavaScript components
+ [sirprize/dojo-data-model](http://github.com/sirprize/dojo-data-model) - Data model for Dojo Applications
+ [sirprize/dojo-form-controls](http://github.com/sirprize/dojo-form-controls) - Dojo widgets for native form controls
+ [sirprize/dojo-local-storage](http://github.com/sirprize/dojo-local-storage) - LocalStorage wrapper providing dojo/store interface
+ [sirprize/dojo-sm2-playlist](http://github.com/sirprize/dojo-sm2-playlist) - Dojo/SoundManager2 playlist

## License

See LICENSE.