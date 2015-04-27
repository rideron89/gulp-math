'use strict';

var through = require('through2');
var gutil = require('gulp-util'),
    PluginError = gutil.PluginError;
var math = require('mathjs');

var mathPlugin = function(vars) {
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
        if (file.isNull()) {
            cb(null, file);
        }

        if (file.isStream()) {
            return cb(new PluginError('gulp-math', 'Streaming is not supported (I guess)'));
        }

        var matched_result = String(file.contents).replace(/gulpcalc\((.+)\);/g, function(match, p1, offset, string) {
            try {
                return math.round(parser.eval(p1), 3);
            } catch(err) {
                // this isn't the most accurate way of getting the line number...
                err.lineNumber = string.slice(0, offset).match(/\n/g).length + 1;
                err.message = err.message + ' at line ' + err.lineNumber + '\n       ' + p1;
                throw new PluginError('gulp-math', err.message);
            }
        });

        file.contents = new Buffer(String(matched_result));

        this.push(file);

        cb();
    });
};

module.exports = mathPlugin;