#gulp-math
> Evaluate math expressions with gulp

## Usage

First, install `gulp-math` as a development dependency:

```shell
npm install --save-dev gulp-replace
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

Now, use `gulpcalc()` in your code:

```html
gulpcalc(10 * 2 - 5 / 3)
```

## Example

An HTML file with the following markup:

```html
<div>
    <p>There are gulpcalc(10 * 2 - 5) meese in the lodge.</p>
</div>
```

Will output the following markup:

```html
<div>
    <p>There are 15 meese in the lodge.</p>
</div>
```