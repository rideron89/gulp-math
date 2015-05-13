# gulp-math
> Evaluate math expressions with gulp

`gulp-math` makes use of the `Math.js` library for Javascript and Node.js. Their [documentation](http://mathjs.org/docs) can be used to form the math expressions used by `gulp-math`.

## Usage

First, install `gulp-math` as a development dependency:

```shell
npm install gulp-math
```

Then, add it to your `gulpfile.js`:

```javascript
var math = require('gulp-math');

gulp.task('generate', function() {
    return gulp.src('pre.html')
        .pipe(math({columns: 12, column_padding: 20, max_content_width: 660}).on('error', function(err) {
            console.log(err.toString());
            this.emit('end');
        }))
        .pipe(gulp.dest(''));
});
```

Now, use `gulpmath();` in your code:

```html
gulpmath(10 * 2 - 5 / 3);
```

## Options

`gulp-math` accepts a list of variables to be used in the calculations.

### math(vars[, options])

#### vars
Type: `Array Object`

An associative array of variables to be used in the math expressions. The keys will be used as variable names.

```javascript
.pipe(math({columns: 12, column_padding: 20, max_content_width: 660}))
```

#### options
Type: `Array Object`

An associative array of option used by the plugin. All `Math.js` configuration options are available. Documentation for `Math.js` options are taken directly from [their site](http://mathjs.org/docs/configuration.html). Please note, `gulp-math` uses the `eval` function for evaluating expressions.

###### options.epsilon
Type: `Number` Default: `1e-14`

The minimum relative difference used to test equality between two compared values. This value is used by all relational functions.

###### options.eval_precision
Type: `Integer` Default: `3` Available values: `0-15`

The number of decimal places used when evaluating expressions. This option will only be used if `options.number` is set to `number`.

###### options.matrix
Type: `String` Default: `matrix` Available values: `matrix` or `array`

The default type of matrix output for functions. Available values are: `matrix` (default) or `array`. Where possible, the type of matrix output from functions is determined from the function input: An array as input will return an Array, a Matrix as input will return a Matrix. In case of no matrix as input, the type of output is determined by the option matrix. In case of mixed matrix inputs, a matrix will be returned always.

###### options.number
Type: `String` Default: `number` Available values: `number` or `bignumber`

The default type of numbers. This setting is used by functions like `eval` which cannot determine the correct type of output from the functions input. For most functions though, the type of output is determined from the the input: a number as input will return a number as output, a BigNumber as input returns a BigNumber as output. Available values are: `number` (default) or `bignumber`. BigNumbers have higher precision than the default numbers of JavaScript.

###### options.precision
Type: `Integer` Default: `64`

The maximum number of significant digits for bigNumbers. This setting only applies to BigNumbers, not to numbers. Default value is 64.

## Example

An HTML file with the following markup:

```html
<div>
    gulpmath(abc = 5);
    <p>There are gulpmath(10 * 2 - abc); meese in the lodge.</p>
</div>
```

Will output the following:

```html
<div>
    <p>There are 15 meese in the lodge.</p>
</div>
```

You can escape semi-colons in your expressions if you need to use them:

```javascript
gulpmath(5\;20); // returns [20]
```

## Known Issues

Unit conversions work, but the results may produce unusual results:

```javascript
gulpmath(5.08 cm to inch); // on Windows, this produces 2.0000000000000004 inch
```