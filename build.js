const copydir = require('copy-dir')
const fs = require('fs-extra')
const pug = require('pug')
const YAML = require('yamljs');
const generator = require('./generator/generator.js')
const _ = require('lodash')

const globalOptions = YAML.load('./config.yml')

const public = globalOptions.publicDir
const static = globalOptions.staticDir
const content = globalOptions.contentDir

const templates = {
    'default': pug.compileFile('templates/default.pug'),
    'project': pug.compileFile('templates/project.pug'),
    'member': pug.compileFile('templates/member.pug'),
}

const pages = {
    'home': generator.getItem(content + '/index.yml'),
    'impressum': generator.getItem(content + '/impressum.yml'),
    'contact': generator.getItem(content + '/kontakt.yml'),
    'links': generator.getItem(content + '/links.yml'),
    'about': generator.getItem(content + '/wiewirarbeiten.yml'),
    'projects': generator.getItem(content + '/projekte.yml'),
    'ensemble': generator.getItem(content + '/ensemble.yml'),
    'audio': generator.getItem(content + '/audio.yml'),
}

const collections = {
    'projects': _.orderBy(generator.getCollection(content + '/projekte'), 'date', 'desc'),
    'members': _.orderBy(generator.getCollection(content + '/ensemble'), 'title', 'asc'),
    'audio': generator.getCollection(content + '/audio'),
}

const writePage = function(page, template, dir = pages[page]['slug']) {
    let options = pages[page]
    options.pages = pages
    options.collections = collections
    options['slug'] = 'index'
    generator.render(template, options, dir)
}

const writeCollection = function(collection, template) {
    collections[collection].forEach(function(item) {
        let options = item
        options.pages = pages
        options.collections = collections
        generator.render(template, options, item['folder'])
    })
}


fs.ensureDirSync(public)

copydir(static, public, function(err){
    if(err){
        console.log(err)
    } else {
        console.log('static files copied!')
    }
})
writePage('home', templates.default, '')
writePage('impressum', templates.default)
writePage('contact', templates.default)
writePage('links', templates.default)
writePage('about', templates.default)
writePage('projects', templates.default)
writePage('ensemble', templates.default)
writePage('audio', templates.default)
writeCollection('projects', templates.project)
writeCollection('members', templates.member)
