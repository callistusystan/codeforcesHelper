const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio')
const fs = require('fs-extra');
const path = require('path');
let config = require('./config.json');

// GlOBAL VARIABLES
const { template } = config;
const EXTENSION = path.extname(template);
const TEMPLATE_FILE = template;
const TEST_FILE = 'test.sh';

// ERROR MESSAGES
const PERMISSIONS_ERROR = "Error: You might need to run the command as an administrator...\nTry sudo su?";

/*
 * A function to display the help file
 */
const usage = () => {
  fs.readFile(path.join(__dirname, 'help'), { encoding: 'utf8' }, (err, data) => console.log(data));
}

/*
 * A function to copy a file from a source path to a destination path
 */
const copyFile = (src, dest) => {
  return fs.copy(src, dest);
}

/*
 * A function to reset the template file, by manipulating the config.json file
 */
const resetTemplate = () => {
  config.template = 'default_template.cpp';
  config.testScript = true;
  fs.writeFile(path.join(__dirname, `config.json`), JSON.stringify(config, null, 2), err => {
    if (err) {
      console.log(PERMISSIONS_ERROR);
    }
  });
}

/*
 * A function to set the template file, by
 *  1. making a copy of the file and
 *  2. manipulating the config.json file
 */
const setTemplate = (src) => {
  const NEW_EXTENSION = path.extname(src);
  config.template = `template${NEW_EXTENSION}`;
  copyFile(src, path.join(__dirname, `template${NEW_EXTENSION}`))
    .then(() => {
      fs.writeFile(path.join(__dirname, `config.json`), JSON.stringify(config, null, 2))
    })
    .catch(e => {
      console.log(PERMISSIONS_ERROR);
    });
}

/*
 * A function to set whether to create test script
 */
const setTestScript = (shouldSet) => {
  config.testScript = shouldSet;
  fs.writeFile(path.join(__dirname, `config.json`), JSON.stringify(config, null, 2), err => {
    if (err) {
      console.log(PERMISSIONS_ERROR);
    }
  });
}

/*
 * A function to create files based on the array,
 *    naming them as '<prefix><ID>'
 */
const createFiles = (ID, arr, directory, prefix) => {
  // iterate each element
  _.forEach(arr, (data, i) => {
    let content = "";
    data.children.forEach((node) => {
      if (node.type == 'text') {
        content += node.data;
      } else {
        content += '\n';
      }
    });

    // Add a newline at the end of input if not already there
    if (content.charAt(content.length-1) != '\n') {
      content += '\n';
    }

    // write file to directory
    fs.writeFile(`${directory}/${prefix}${i+1}`, content, (err) => {
        if (err) {
            return console.log(err);
        }
    });
  });
};

/*
 * A function to parse a problem, after data has been extracted
 *    1. Creates the problem directory
 *    2. Creates the input and output files
 *    3. Copies the template and test script to the problem directory
 */
const setupProblem = (directory, URL, inputs, outputs) => {
  const numberPattern = /\d+/g;
  const probNum = URL.match(numberPattern).join([])

  const N = URL.length;
  const ID = probNum+URL.charAt(N-1);

  const destDir = path.join(directory, ID);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  } else {
    console.log("Error: There already is a folder for this problem!");
    return;
  }

  createFiles(ID, inputs, destDir, 'in');
  createFiles(ID, outputs, destDir, 'out');

  copyFile(path.join(__dirname, TEMPLATE_FILE), path.join(destDir, `${ID}${EXTENSION}`));
  if (config.testScript)
    copyFile(path.join(__dirname, 'test.sh'), path.join(destDir, `test.sh`));
}

/*
 * A function to setup the problems in a contest
 *    Loops through each problem, and extracts them asynchronously
 */
const setupContest = (directory, problems) => {
  const requests = _.map(problems, ({ attribs: { href } }) => {
    return extract(directory, `http://codeforces.com${href}`);
  });

  // perform all requests asynchronously
  Promise.all(requests);
}

/*
 * Function that loads the web page, and extracts data
 *    After data has been extracted, calls the appropriate setup functions
 */
const extract = (directory, URL) => {
  return axios.get(URL)
    .then(({ data }) => {
      const $ = cheerio.load(data);
      const inputs = $('.input pre');
      const outputs = $('.output pre');
      const problems = $('.problems tbody tr td div div a');

      if (inputs.length == 0 && outputs.length == 0 && problems.length == 0) {
        console.log("Invalid URL: You must provide a URL to a valid Codeforces problem or contest");
        return;
      }

      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }

      // calls the appropriate setup functions
      if (inputs.length)
        setupProblem(directory, URL, inputs, outputs);
      else if (problems.length)
        setupContest(directory, problems);
      else {
        console.log("Unknown command... Sorry about that!");
      }
    })
    .catch(e => {
      console.log("Unable to fetch problem data: Oh no! It seems that Codeforces is down...");
    });
}

exports.extract = extract;
exports.setTemplate = setTemplate;
exports.resetTemplate = resetTemplate;
exports.setTestScript = setTestScript;
exports.usage = usage;
