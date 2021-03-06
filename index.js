// through2 is a thin wrapper around node transform streams
const gulp = require('gulp');
const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const globby = require('globby');
const fs = require('fs');
const imagemin = require('gulp-imagemin');
const imageminJpegoptim = require('imagemin-jpegoptim');
const colors = require('colors');
let extend = require('./lib/extend')
let prefixImageFromList = require('./lib/prefixImageFromList');
let junk = require('junk');
//define path as const in your gulpfile

const paths = {
    watch: {
        src: './site-sections/**/src/images/',
        dir: './site-sections/'
    }
}
        
// Global Filename Variable
let changedFile = '';
let prefixes = ['lll'];

// Consts
const PLUGIN_NAME = 'gulp-rose';

class gulpRose {
    constructor(path, options) {
        this.path = path;
        this.defaults = {
            path: '/public/static/images',
            prefix:false
        };
        this.settings = extend({}, this.defaults, options);
        this.init(path);
    }

    init(path){
        let hasPath = (path) ? this.gatherImages(path) :  console.log(PLUGIN_NAME + ' Caused an error. Missing a path. Please pass a path to the plugin');
    }

    optimizeImage(file, fileName) {
        if(this.prefix){
            let updateImage = new autoPrefixer(file, fileName, prefixes);
            updateImage.sendFileName();
            updateImage.sendFileName().then( value => {
                gulp.src(value)
                .pipe(imagemin([
                    imagemin.gifsicle(),
                    imageminJpegoptim({
                        stripAll: false,
                        stripIcc: false
                    }),
                    imagemin.optipng(),
                    imagemin.svgo()
                ], {
                    verbose: true
                }));
            }, reason => {
                console.log(reason); // Error!
            });
        } else{
            gulp.src(file)
            .pipe(imagemin([
                imagemin.gifsicle(),
                imageminJpegoptim({
                    stripAll: false,
                    stripIcc: false
                }),
                imagemin.optipng({ optimizationLevel: 7 }),
                imagemin.svgo()
            ], {
                verbose: true
            }));
        }
    }

    gatherImages(path){
        globby([path]).then(paths => {
            for(let i = 0; i < paths.length; i++) {
                let currentPath = paths[i];
                fs.watch(paths[i], (eventType, filename) => {
                    console.log(`event type is: ${eventType}`);
                    if (filename) {
                      console.log(`filename provided: ${filename}`);
                    } else {
                      console.log('filename not provided');
                    }
                    changedFile = currentPath + filename;
                    this.optimizeImage(changedFile, filename);
                });
            }
        });
    }
}

module.exports = new gulpRose();








