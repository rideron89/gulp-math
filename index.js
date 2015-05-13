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

function setupOptions(opts, defaults) {
    opts = opts || {};

    // set up default options
    for (var index in defaults) {
        if (defaults.hasOwnProperty(index) && opts.hasOwnProperty(index) === false) {
            opts[index] = defaults[index];
        }
    }

    if (isInt(opts.eval_precision) === false) {
        opts.eval_precision = defaults.eval_precision;
    }

    if (opts.number.toLowerCase() === 'number') {
        opts.precision = opts.eval_precision;
    }

    opts.eval_precision = parseInt(opts.eval_precision);

    return opts;
}

exports = module.exports = function(vars, opts) {
    var defaults = {
        epsilon: 1e-14,
        eval_precision: 3,
        matrix: 'matrix',
        number: 'number',
        precision: 64
    };
    var parser = null;

    opts = setupOptions(opts, defaults);

    parser = math.create(opts).parser();

    // if the plugin receives an array of variables, evaluate them
    if (vars !== undefined) {
        for (var index in vars) {
            if (vars.hasOwnProperty(index)) {
                parser.set(index, vars[index]);
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

                    // we have to manually round to precision with 'number' results
                    if (opts.number === 'number' && (isInt(evaluated_result) || isFloat(evaluated_result))) {
                        return math.round(evaluated_result, opts.eval_precision);
                    }

                    return evaluated_result;
                } catch(err) {
                    err = new PluginError('gulp-math', err, {showStack: true});

                    err.fileName = '<Buffer>';
                    err.lineNumber = 0;

                    if (file.path !== undefined) {
                        err.fileName = file.path.substr(file.path.lastIndexOf(path.sep) + 1);
                    }

                    if (string && string.slice(0, offset).match(/\n/g)) {
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