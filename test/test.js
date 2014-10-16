
require('should');
require('mocha');

var dirEqual    = require('assert-dir-equal'),
    Metalsmith  = require('metalsmith'),
    api         = require('../');
    collections = require('metalsmith-collections');


suite('metalsmith-collection-api', function() {
    var testDir = __dirname;
    test('create unique hashes from file content', function(done) {
        var uids = {
                     'content/posts/test.md': 'cfad634706a07745f26a72c65c92bedf'
                    },
            pattern = /^api\//;

        Metalsmith(testDir + '/fixtures/input')
            .use(collections({
                posts: {
                    pattern: 'content/po*/*.md',
                    sortBy: 'date',
                    reverse: true
                }
            }))
            .use(api())
            .destination(testDir + '/tmp')
            .build(function(err, files) {
                if (err) { throw err; }
                for(var f in files) {
                    if (!pattern.test(f)) {
                        files[f]._uid.should.be.equal(uids[f]);
                    }
                }  
                done();
            });
    });

    test('create json files for files', function(done) {
        Metalsmith(testDir + '/fixtures/input')
            .use(collections({
                posts: {
                    pattern: 'content/po*/*.md',
                    sortBy: 'date',
                    reverse: true
                }
            }))
            .use(api())
            .destination(testDir + '/tmp')
            .build(function(err, files) {
                dirEqual(testDir + '/tmp', testDir + '/fixtures/output/jsonFiles');
                done();
            });
    });

    test('ignore files from glob pattern array', function(done) {
        Metalsmith(testDir + '/fixtures/input')
            .use(collections({
                posts: {
                    pattern: 'content/po*/*.md',
                    sortBy: 'date',
                    reverse: true
                }
            }))
            .use(api({
                ignore: ['posts/*']
            }))
            .destination(testDir + '/tmp')
            .build(function(err, files) {
                dirEqual(testDir + '/tmp', testDir + '/fixtures/output/ignore');
                done();
            });
    });
});
