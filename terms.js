const inquirer = require('inquirer');
const path = require('path');

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

const relativeToCWD = ({source, target}) => ({
    source:  path.join(process.cwd(), source),
    target:  path.join(process.cwd(), target),
})

const retrieveTerms = async () => {
    const {source, target} = await askExecutionParams().then(relativeToCWD);
    const information = await fulfillQuestions(getPackageInfo());
    return {source, target, information};
}

module.exports = retrieveTerms;
