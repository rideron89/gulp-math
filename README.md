#gulp-math [![NPM version][npm-image]][npm-url]
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