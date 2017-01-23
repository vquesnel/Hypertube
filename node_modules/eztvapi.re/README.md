# eztvapi.re API wrapper
[![Build pass](https://travis-ci.org/stylesuxx/eztvapi.re.svg?branch=master)](https://travis-ci.org/stylesuxx/eztvapi.re.to?branch=master)  [![Dependencies](https://david-dm.org/stylesuxx/eztvapi.re.svg)](https://david-dm.org/stylesuxx/eztvapi.re)

This is a *JavaScript* wrapper for [eztvapi.re](http://eztvapi.re) that returns promises.

Calls to the classes methods return promises.

The parameters for the methods are the mandatory fields. Where optional fields may be passed this may be done via options object. For optional parameters please refer to the [eztvapi.re API](https://github.com/popcorn-official/popcorn-api/blob/master/README.md). JSON is returned directly as the API returns it.

## Installation
    npm install eztvapi.re --save

## Usage example
``` JavaScript
var EZTV = require('eztvapi.re');
var eztv = new EZTV();

eztv.getShows('1', {keywords: 'Breaking Bad'}).then( function(shows) {
  console.log(shows);
});
```

## Available methods
The *EZTV* class provides the following methods:

### Default API Methods
* getPages()
* getShows(page, options = {})
* getDetails(id)

### Custom API Methods
These methods are in place to have some more comfort working with the API.
* search(keywords, page = 1, options = {})

## Testing
An extensive test suite is provided and may be invoked by running:

    npm run test
