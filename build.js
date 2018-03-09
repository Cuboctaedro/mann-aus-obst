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
    'home': pug.compileFile('templates/home.pug'),
    'project': pug.compileFile('templates/project.pug'),
    'projects': pug.compileFile('templates/projects.pug'),
    'member': pug.compileFile('templates/member.pug'),
    'members': pug.compileFile('templates/members.pug'),
    'page': pug.compileFile('templates/page.pug'),
    'links': pug.compileFile('templates/links.pug'),
    'audiolist': pug.compileFile('templates/audiolist.pug'),
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
    // options['slug'] = 'index'
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
writePage('home', templates.home, '')
writePage('impressum', templates.page)
writePage('contact', templates.page)
writePage('links', templates.links)
writePage('about', templates.page)
writePage('projects', templates.projects)
writePage('ensemble', templates.members)
writePage('audio', templates.audiolist)
writeCollection('projects', templates.project)
writeCollection('members', templates.member)
