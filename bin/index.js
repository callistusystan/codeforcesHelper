#!/usr/bin/env node
const cfget = require('../lib/index');
const argv = require('minimist')(process.argv.slice(2));

if (argv.t) {
  const path =  argv.t;
  cfget.setTemplate(path);
} else if (argv.r) {
  cfget.resetTemplate();
} else {
  const [directory, URL] =  argv._;
  cfget.extract(directory, URL);
}
