[originalCode]: https://gist.github.com/880822
[dmachiGithub]: https://github.com/dmachi
[dojoStoreTutorial]: http://dojotoolkit.org/documentation/tutorials/1.8/intro_dojo_store/
[creatingStoreTutorial]: http://dojotoolkit.org/documentation/tutorials/1.8/creating_stores/

# Dojo-local-storage

This store provides a dojo/store interface when working with LocalStorage. Check out the [Dojo Object Store Tutorial][dojoStoreTutorial] or the [Creating Dojo Stores Tutorial][creatingStoreTutorial]

## Introduction

LocalStorage only works with key/value pairs where value is a string. Dojo-local-storage in contrast works with objects. A JSON serialization of an object is stored in LocalStorage, storing strings directly is not supported.

## Usage

<!-- scribble-language-hint: language-javascript -->

    require(["dojo-local-storage/LocalStorage"], function (LocalStorage) {
        var store = new LocalStorage({
            idProperty: 'id'
        });
        
        // storing an object
        var id = store.add({
            title: 'Elementarteilchen',
            year: 2006
        });
        
        // querying the store
        var result = store.query({
            year: 2006
        },{
            sort: [{ attribute:"year", descending: false }]
        });
        
        // updating an object
        var id = store.put({
            id: 'abc',
            title: 'Elementarteilchen',
            year: 2006
        });
        
        // getting an object
        var object = store.put('abc');
        
        // deleting an object
        store.remove('abc');
        
        // clear everything from LocalStorage
        store.clear();
    });

## Working With A Data Subset By Configuration

Sometimes it can be desirable to configure a store such that it only operates on a subset of data. This feature can be helpful to use LocalStorage as a read/writeable replacement for a remote API during development. Transparently to a client, Dojo-local-storage adds a property to each object it stores and removes it upon retrieval. Name and value of this property can be passed to the constructor upon instantiation

    var store = new LocalStorage({
        subsetProperty: 'mySubsetProperty',
        subsetName: "movies"
    });


## Thanks

Original [Gist][originalCode] by [dmachi][dmachiGithub]