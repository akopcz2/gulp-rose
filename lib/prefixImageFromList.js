let fs = require("fs");
let siteSections = './site-sections/';
let colors = require('colors');
let Promise = require('bluebird');

class prefixImage{
    constructor(file, fileName, prefixes) {
        this.file = file,
        this.fileName = fileName,
        this.prefixes = prefixes,
        this.options = {
            indication: '',
            prefix: '',
            newFileName:''
        };
        this.init(file);
    }

    init(file){
        this.getToJson(file);
        this.getPrefix();
        this.setPrefix(file);
    }

    rename(oldName, newName){
        fs.rename(oldName, newName, (err) => {
        });
    }
    
    cleanFileName(orgFile){
        let cleanName = orgFile
        cleanName = cleanName.replace(/" "/g,"-");
        cleanName = cleanName.replace(/_/g,"-");
        cleanName.toLowerCase();
        fs.rename(orgFile, cleanName, (err) => {
        });
    }

    getToJson(file){
        let indication = file.split('/').splice(0,3).pop();
        this.options.indication = indication;
    }

    sendFileName() {
        return new Promise((resolve, reject) => {
            resolve(this.options.newFileName);
        });
    }

    getPrefix(){
        let indication = this.options.indication;
        let siteSections = './site-sections/' + indication;
        let newDir = siteSections + '/model/views/index.json';
        let siteconfig = JSON.parse(fs.readFileSync(newDir, 'utf8'));
        let prefix = JSON.stringify(siteconfig.prefix).replace(/\"/g, "") + '-';
        this.prefix = prefix;
    }

    setPrefix(file){
        let youCanRename = true;
        if(file.includes(this.prefix)) {
            console.log(colors.red('Image is already prefixed'));
        }
        //find matching prefixes
        if(!file.includes(this.prefix)){
            youCanRename = false;
            for(let i = 0; i < this.prefixes.length; i ++){
                if(file.includes(this.prefixes[i])){
                    let matchingPrefix = this.prefixes[i];

                    console.log('FOUND PREFIX ' + colors.green(matchingPrefix) + ' in '+ colors.green(file) + ' but doesnt match requirements');

                    matchingPrefix = matchingPrefix +'-';
                    let stripPrefix = file.replace(matchingPrefix,'');
                    let splitPrefix = stripPrefix.split('/');
                    let dataArray = Object.keys(splitPrefix).map(function(k){return splitPrefix[k]});
                    let assetName = dataArray.pop();

                    //Remove prefix
                    fs.rename(file, stripPrefix, function(err){
                        fireSecondRename(stripPrefix);
                    });
                    
                    let secondPass = imgSourceDir + prefix + assetName;

                    function fireSecondRename(stripPrefix){
                        this.rename(stripPrefix, secondPass);
                    }

                }
                if(!file.includes(this.prefixes[i])){
                    let stripFilename = file.split('/');
                    let filePath = stripFilename.splice(0, stripFilename.length - 1).join('/');
                    let newFileName = filePath + '/' + this.prefix + this.fileName;
                    this.rename(file, newFileName);
                    this.cleanFileName(this.options.newFileName);
                    this.options.newFileName = newFileName;

                }
                
                else{
                    if(youCanRename){
                        rename(orgFile, newFileName);
                    }
                }
            }
        }
        // cleanFileName(orgFile);
    }
}

module.exports = prefixImage;
