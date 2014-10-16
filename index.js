// index.js
var omit = require('lodash.omit');

function createHash(file) {
    'use strict';
    var hash = require('crypto').createHash('md5'),
        str  = file.contents;

    str += (file.date) ? file.date.toString() : '';
    str += (file.title) ? file.title : '';

    hash.update(str, 'uft8');

    return hash.digest('hex');
}

function createFile(data) {
    var path = 'api/',
        fileObj;
    
    fileObj = omit(data, function(_, key) {
        return key === 'mode' || key === 'stats';
    });

    fileObj.contents = fileObj.contents.toString();

    fileObj.contents = JSON.stringify(fileObj);

    if (fileObj.collection && fileObj.collection.length === 1) {
        path += fileObj.collection[0] + '/';
    }

    path += fileObj._uid + '.json';
    
    return {
        path: path,
        obj: fileObj
    };
}


module.exports = function() {
    'use strict';
    return function(files, metalsmith, done) {
        for (var f in files) {
            var file = files[f],
                apiFile;
            file._uid = createHash(file);
            
            apiFile = createFile(file);

            files[apiFile.path] = apiFile.obj;
        }
        done();
    };
};
