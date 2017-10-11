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
let autoPrefixer = require('./lib/autoprefixer');
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
            prefix:false
        };
        this.init(path);
        this.settings = extend({}, this.defaults, options);
    }

    init(path){
        if(path){
            this.gatherImages(path);
        }
        else{
            console.log(colors.rainbow(PLUGIN_NAME) + ' Threw an error' + colors.red(' MISSING IMAGE PATH'));
        }
    }

    optimizeImage(file, fileName) {
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
                imagemin.optipng({ optimizationLevel: 7 }),
                imagemin.svgo()
            ], {
                verbose: true
            }));
        }, reason => {
            console.log(reason); // Error!
        });
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

module.exports = gulpRose;


let work = new gulpRose(paths.watch.src);





