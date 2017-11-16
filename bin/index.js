#!/usr/bin/env node
const cfget = require('../lib/index');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const main = () => {
  if (argv.h || argv.help) {
    cfget.usage();
  } else if (argv.set) {
    // set template
    const src =  argv.set;
    if (!src) {
      console.log("Path location of template file must be provided");
      console.log("Usage: cfget --set <path>");
      return;
    }
    if (!fs.existsSync(src)) {
      console.log("Path location of template file must be valid");
      console.log("Usage: cfget --set <path>");
      return;
    }
    cfget.setTemplate(src);
  } else if (argv.reset) {
    // reset template
    cfget.resetTemplate();
  } else if (argv.notest) {
    cfget.setTestScript(false);
  } else if (argv.test) {
    cfget.setTestScript(true);
  } else {
    // extract data
    if (argv._.length > 2) {
      console.log("Too many arguments!");
      console.log("Usage: cfget <directory> <URL>");
      return;
    }

    // parse args
    const [directory, URL] =  argv._;
    if (!directory || !URL) {
      console.log("Directory and URL must both be specified!");
      console.log("Usage: cfget <directory> <URL>");
      return;
    }
    cfget.extract(directory, URL);
  }
}

main();
