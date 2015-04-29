var assert = require('assert'),
    File = require('vinyl'),
    fs = require('fs'),
    math = require('../');

describe('gulp-math', function() {
    describe('buffer mode', function() {
        it ('should perform expression with no calculations and no variables set', function(done) {
            var file = new File({
                contents: new Buffer('gulpmath(5);')
            });

            var myMath = math();
            myMath.write(file);

            myMath.once('data', function(newFile) {
                assert(newFile.isBuffer());
                assert.equal(newFile.contents.toString('utf8'), '5');
            });

            done();
        });

        it('should perform expression with no calculations but with one unused variable set', function(done) {
            var file = new File({
                contents: new Buffer('gulpmath(5);')
            });

            var myMath = math({unused_var: 1000});
            myMath.write(file);

            myMath.once('data', function(newFile) {
                assert(newFile.isBuffer());
                assert.equal(newFile.contents.toString('utf8'), '5');
            });

            done();
        });

        it('should perform expression with a simple calculation and no variables set', function(done) {
            var file = new File({
                contents: new Buffer('gulpmath(5 + 5);')
            });

            var myMath = math();
            myMath.write(file);

            myMath.once('data', function(newFile) {
                assert(newFile.isBuffer());
                assert.equal(newFile.contents.toString('utf8'), '10');
            });

            done();
        });

        it('should perform expression with a simple calculation and two variables set', function(done) {
            var file = new File({
                contents: new Buffer('gulpmath(a + b);')
            });

            var myMath = math({a: 5, b: 5});
            myMath.write(file);

            myMath.once('data', function(newFile) {
                assert(newFile.isBuffer());
                assert.equal(newFile.contents.toString('utf8'), '10');
            });

            done();
        });

        it('should perform expression with a complex calculation and one variable set', function(done) {
            var file = new File({
                contents: new Buffer('gulpmath(5 + (a * 5) / 5);')
            });

            var myMath = math({a: 5});
            myMath.write(file);

            myMath.once('data', function(newFile) {
                assert(newFile.isBuffer());
                assert.equal(newFile.contents.toString('utf8'), '10');
            });

            done();
        });

        it('should perform two expressions on a single line with two variables set', function(done) {
            var file = new File({
                contents: new Buffer('gulpmath(a + 5); and gulpmath(b + 5);')
            });

            var myMath = math({a: 5, b: 10});
            myMath.write(file);

            myMath.once('data', function(newFile) {
                assert(newFile.isBuffer());
                assert.equal(newFile.contents.toString('utf8'), '10 and 15');
            });

            done();
        });

        it('should perform two expressions on separate lines with two variables set', function(done) {
            var file = new File({
                contents: fs.readFileSync('test/fixtures/testmath.txt')
            });

            var myMath = math({a: 5, b: 10});
            myMath.write(file);

            myMath.once('data', function(newFile) {
                assert(newFile.isBuffer());
                assert.equal(newFile.contents.toString('utf8'), fs.readFileSync('test/expected/testmath.txt', 'utf8'));
            });

            done();
        });
    });
});