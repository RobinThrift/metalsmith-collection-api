# Metalsmith JSON API

## Usage
Use this plugin like any other Metalsmith plugin:
```js
var Metalsmith = require('metalsmith'),
    api        = require('metalsmith-json-api'),
    ...;

Metalsmith(__dirname)
    .use(...)
    ...
    .use(api())
    .build();
```

This will create unique ids based on the files content and create a JSON file with the name of the unique id. 
The unique ids are saved in `_uid` and a link to the api file is saved at `_apiURL` on every file (so they can be accessed in templates).

## Options
- `path`: The path where the json files will be saved (default to `api/`)
- `pattern`: glob pattern (array) to specify the files that should be handled by this plugin (defaults to all)


### Tests
Run `npm test` or `mocha -u tdd` to run the test suite.
