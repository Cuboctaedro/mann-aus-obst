const copydir = require('copy-dir')
const fs = require('fs-extra')
const pug = require('pug')
const YAML = require('yamljs');
const generator = require('./generator/generator.js')

const globalOptions = YAML.load('./config.yml')

const public = globalOptions.publicDir
const static = globalOptions.staticDir
const content = globalOptions.contentDir

const templates = {
    'default': pug.compileFile('templates/default.pug'),
    'project': pug.compileFile('templates/project.pug'),
    'member': pug.compileFile('templates/member.pug'),
}

const data = {
    'home': generator.getItem(content + '/index.yml'),
}

fs.ensureDirSync(public)

copydir(static, public, function(err){
    if(err){
        console.log(err)
    } else {
        console.log('static files copied!')
    }
})

generator.render(templates.default, data.home, '/')