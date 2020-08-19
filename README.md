# preact-cli-wp-theme [deprecated]

I just wrote a tutorial with simple instructions. here: https://dev.to/edorka/preact-spa-into-a-wordpress-theme-lge

I will only maintain this plugin if some people asks for it.

Old readme below: ======================================

Creates a Wordpress theme from a [Preact-cli](https://github.com/preactjs/preact-cli) generated application.

This tool process the `build` folder with a single command.
 
## Usage
#### Install

Go to your project folder
`cd ~/your/preact/project`

Install this plugin
`npm install --save-dev git+https://github.com/Edorka/preact-cli-wp-theme.git` 



#### Usage

Be sure to generate a build of your App, from your preact project folder run:
`npm run build` or `yarn build`
Run the tool to create a new project after anwser some questions;
`npm run build-theme`

Then you only need to zip the created folder to ship it to your wordpress instalation.

#### Known issues

Code splitting is not supported yet, the quickles way to disable this is to move your `src/routes/` code to an alternative name such as `src/views` to prevent errors during runtime import of the splitted bundles.
