How to use in your project

define prefixes inside you gulpfile.js 

example
```
let prefixes = ['lol']
```

define the paths to watch 
```
const paths = {
    watch: {
        src: './site-sections/**/src/images/',
        dir: './site-sections/'
    }
}
```

require inside your gulpfile.js
let gulpRose = require('gulp-rose');

```
invoke
let watcher = new gulpRose(paths.watch.src)'
