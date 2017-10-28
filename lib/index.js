const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio')
const fs = require('fs');
const path = require('path');

const DEFAULT_TEMPLATE_FILE = 'default_template.cpp';
const TEMPLATE_FILE = 'template.cpp';
const TEST_FILE = 'test.sh';

copyFile = (src, dest) => {
  let readStream = fs.createReadStream(src);

  readStream.pipe(fs.createWriteStream(dest));
}

const resetTemplate = () => {
  fs.unlinkSync(path.join(__dirname, `${TEMPLATE_FILE}`));

  copyFile(path.join(__dirname, `${DEFAULT_TEMPLATE_FILE}`), path.join(__dirname, `${TEMPLATE_FILE}`));
}

const setTemplate = (src) => {
  if (!src) {
    console.log("path location of template file must be provided");
    console.log("Usage: cfget -t <path>");
    return;
  }

  copyFile(src, path.join(__dirname, `${TEMPLATE_FILE}`));
}

const createFiles = (ID, arr, directory, prefix) => {
  _.forEach(arr, (data, i) => {
    let content = "";
    data.children.forEach((node) => {
      if (node.type == 'text') {
        content += node.data;
      } else {
        content += '\n';
      }
    });
    if (content.charAt(content.length-1) != '\n') {
      content += '\n';
    }

    fs.writeFile(`${directory}/${prefix}${i+1}`, content, (err) => {
        if (err) {
            return console.log(err);
        }
    });
  });
};

const extract = (directory, URL) => {
  if (!directory || !URL) {
    console.log("directory and URL must both be specified!");
    console.log("Usage: cfget <directory> <URL>");
    return;
  }

  axios.get(URL)
    .then(({ data }) => {
      const $ = cheerio.load(data);
      const inputs = $('.input pre');
      const outputs = $('.output pre');

      if (inputs.length == 0 || outputs.length == 0) {
        console.log("Invalid URL: You must provide a URL to a valid Codeforces problem");
        return;
      }

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

      copyFile(path.join(__dirname, 'template.cpp'), path.join(destDir, `${ID}.cpp`));
      copyFile(path.join(__dirname, 'test.sh'), path.join(destDir, `test.sh`));
    });
}

exports.extract = extract;
exports.setTemplate = setTemplate;
exports.resetTemplate = resetTemplate;
