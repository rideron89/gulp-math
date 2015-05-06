'use strict';

var through = require('through2');
var gutil = require('gulp-util'),
    PluginError = gutil.PluginError;
var math = require('mathjs');
var path = require('path');

/**
 * Checks if a number is an int.
 */
function isInt(n) {
    return (Number(n) == n && n % 1 === 0);
}

/**
 * Checks if a number is a float.
 */
function isFloat(n) {
    return (Number(n) == n && n % 1 !== 0);
}

exports = module.exports = function(vars) {
    var parser = math.parser();

    // if the plugin receives an array of variables, evaluate them
    if (vars !== undefined) {
        for (var index in vars) {
            if (vars.hasOwnProperty(index)) {
                parser.eval(index + ' = ' + vars[index]);
            }
        }
    }

    return through.obj(function(file, enc, cb) {
        var _this = this;

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            _this.emit('error', new PluginError('gulp-math', 'Streaming is not supported'));
            return cb();
        }

        if (file.isBuffer()) {
            var matched_result = String(file.contents).replace(/gulpmath\((([^;]|\\;)+)\);/g, function(match, p1, offset, string) {
                try {
                    p1 = p1.replace(/\\;/g, ';'); // allows escaped semi-colons
                    var evaluated_result = parser.eval(String(p1));

                    if (isInt(evaluated_result) || isFloat(evaluated_result)) {
                        return math.round(parser.eval(p1), 3);
                    }

                    return evaluated_result;
                } catch(err) {
                    err = new PluginError('gulp-math', err, {showStack: true});

                    err.fileName = '<Buffer>';
                    err.lineNumber = 0;

                    if (file.path !== undefined) {
                        err.fileName = file.path.substr(file.path.lastIndexOf(path.sep) + 1);
                    }

                    if (string.slice(0, offset).match(/\n/g)) {
                        err.lineNumber = string.slice(0, offset).match(/\n/g).length + 1;
                    }

                    err.message += ' (' + err.fileName + ':' + err.lineNumber + ')';
                    _this.emit('error', err);
                }
            });

            file.contents = new Buffer(String(matched_result));
        }

        this.push(file);

        cb();
    });
};