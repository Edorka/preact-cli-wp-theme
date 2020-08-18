const render = ({name='Preact SPA', version='', author='Unknown', license='MIT'}={}) =>
`/*
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

module.exports = render;
