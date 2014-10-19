// index.js
var omit = require('lodash.omit'),
    glob = require('multimatch');

function ignore(path, patterns) {
    return !!glob([path], patterns).length;
}

function createHash(file) {
    'use strict';
    var hash = require('crypto').createHash('md5'),
        str  = file.contents;

    str += (file.date) ? file.date.toString() : '';
    str += (file.title) ? file.title : '';

    hash.update(str, 'uft8');

    return hash.digest('hex');
}

function createFile(data, opts) {
    var path = opts.path,
        ignores = ['mode', 'stats'].concat(opts.ignoreKeys || []),
        fileObj;
    
    fileObj = omit(data, function(_, key) {
        return ignores.indexOf(key) !== -1;
    });

    fileObj.contents = fileObj.contents.toString();

    fileObj.contents = JSON.stringify(fileObj);

    if (fileObj.collection && fileObj.collection.length === 1) {
        path += fileObj.collection[0] + '/';
    }

    path += fileObj._uid + '.json';

    fileObj._apiURL = path;
    
    return {
        path: path,
        obj: fileObj
    };
}


module.exports = function(opts) {
    'use strict';
    opts = opts || {};

    return function(files, metalsmith, done) {
        for (var f in files) {
            var file = files[f],
                apiFile;

            if (opts.pattern) {
                if (ignore(f, opts.pattern)) {
                    continue;
                }
            }

            file._uid = createHash(file);

            opts.path = (opts.path) ? opts.path : 'api/';
            
            apiFile = createFile(file, opts);

            files[apiFile.path] = apiFile.obj;
        }
        done();
    };
};
