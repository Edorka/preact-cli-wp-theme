#!/usr/bin/env node
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const inquirer = require('inquirer');

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

const buildStyle = ({name='Preact SPA', version='', author='Unknown', license='MIT'}={}) => {
    const result = `
/*
Theme Name: ${name}
Author: ${author}
Author URI: https://github.com/your-github
Description: Create React WP Themes with no build configuration
Version: ${version}
License: ${license}
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Tags: generated
Text Domain: your-domain

This theme, like WordPress, is licensed under the GPL.
*/`
    return result;
}

const getPackageInfo = async () => {
    const info = require(path.join(process.cwd(), 'package.json'));
    return info;
}

const _INFO_DEFAULTS = {
    name: 'PreactSPA',
    author: 'Your Name <email> (web.page)',
    version: '0.0.1',
    license: 'GPL'
}

const askExecutionParams = async () => {
    return inquirer
      .prompt([
        {
          name: 'source',
          message: 'Where is the build output of the App?',
          default: 'build',
        },
        {
          name: 'target',
          message: 'Where to store the theme?',
          default: 'wp-theme',
        },
      ]);
} 

const relativeToCWD = ({source, target}) => ({
    source:  path.join(process.cwd(), source),
    target:  path.join(process.cwd(), target),
})

const fulfillQuestions = async ({name, author, license, version}=_INFO_DEFAULTS) => {
    return inquirer
      .prompt([
        {
          name: 'name',
          message: 'Name of the WP-Theme?',
          default: name,
        },
        {
          name: 'author',
          message: 'Author?',
          default: author,
        },
        {
          name: 'version',
          message: 'Version?',
          default: version,
        },
        {
          name: 'license',
          message: 'License?',
          default: license,
        },
      ]);
}

const buildIndexFrom = async (source) => {
    const content = await loadIndex(source);
    const { occurrences, result } = fixResources(content);
    const header = '<?php $TEMPLATE_PATH = parse_url(get_template_directory_uri(), PHP_URL_PATH);?>';
    return { occurrences, result: header + result };
}

const perform = async () => {
    const {source, target} = await askExecutionParams().then(relativeToCWD);
    const information = await fulfillQuestions(getPackageInfo());
    const {occurrences, result} = await buildIndexFrom(source);
    await save(result, path.join(target, 'index.php'))
    console.log('generated index.php.');
    await save(buildStyle(information), path.join(target, 'style.css'))
    console.log('style.css completed.');
    await copyResources(source, occurrences, target);
}
perform();
