#gulp-math
> Evaluate math expressions with gulp

`gulp-math` makes use of the `Math.js` library for Javascript and Node.js. Their [documentation](http://mathjs.org/) can be used to form the math expressions used by `gulp-math`.

## Usage

First, install `gulp-math` as a development dependency:

```shell
npm install --save-dev gulp-math
```

Then, add it to your `gulpfile.js`:

```javascript
gulp.task('generate', function() {
    return gulp.src('pre.html')
        .pipe(rename('post.html'))
        .pipe(math())
        .pipe(gulp.dest(''));
});
```

Now, use `gulpmath();` in your code:

```html
gulpmath(10 * 2 - 5 / 3);
```

## Options

gulp-math accepts a list of variables to be used in the calculations.

### math([vars])

#### vars
Type: `Array Object`

An associative array of variables to be used in the math expressions. The keys will be used as variable names.

```javascript
.pipe(math({columns: 12, column_padding: 20, max_content_width: 660}))
```

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