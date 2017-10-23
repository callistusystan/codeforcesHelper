#!/usr/bin/env node
const cfget = require('../lib/index');

const [program, programDirectory, directory, URL] =  process.argv;

cfget.extract(directory, URL);
