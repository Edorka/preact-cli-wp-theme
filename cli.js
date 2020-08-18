#!/usr/bin/env node
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const retrieveTerms = require('./terms');
const buildStyle = require('./style-css.template');

const loadIndex = (folder) => {
    const target = path.join(folder, 'index.html')
    return fs.readFileSync(target, 'utf8');
}

const resources = /(?<attr>href|src)="(?<resource>[^\"]+)"/g;
const resourceName = (occurrence) => occurrence.groups.resource;

const fixResources = (content) => { 
    const prefix = '<?=$TEMPLATE_PATH?>';
    const occurrences = [... content.matchAll(resources)].map(resourceName);
    const result = content.replace(resources, `$<attr>="${prefix}$<resource>"`)
    return { occurrences, result };
}
const save = async (content, target) => {
    await fse.outputFile(target, content);
} 

const copyResources = async (source, files, target) => {
    files = [... new Set(files)].filter( file => file !== '.' );
    files.forEach( async (filename) => {
        const sourcePath = path.join(source, filename);
        const data = await fse.readFileSync(sourcePath, 'utf8');
        const targetPath = path.join(target, filename);
        await fse.outputFileSync(targetPath, data);
    });
    console.log(`completed copy of ${files.length} files`);
}


const buildIndexFrom = async (source) => {
    const content = await loadIndex(source);
    const { occurrences, result } = fixResources(content);
    const header = '<?php $TEMPLATE_PATH = parse_url(get_template_directory_uri(), PHP_URL_PATH);?>';
    return { occurrences, result: header + result };
}

const perform = async () => {
    const {source, target, information} = await retrieveTerms();
    const {occurrences, result} = await buildIndexFrom(source);
    await save(result, path.join(target, 'index.php'))
    console.log('generated index.php.');
    await save(buildStyle(information), path.join(target, 'style.css'))
    console.log('style.css completed.');
    await copyResources(source, occurrences, target);
}

perform();
