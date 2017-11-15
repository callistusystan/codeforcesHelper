const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio')
const fs = require('fs-extra');
const path = require('path');
let config = require('./config.json');

const { template } = config;
const EXTENSION = path.extname(template);
const TEMPLATE_FILE = template;
const TEST_FILE = 'test.sh';

copyFile = (src, dest) => {
  return fs.copy(src, dest);
  // try {
  //   let readStream = fs.createReadStream(src);
  //   readStream.on('error', (err) => {
  //     console.log("SHIT");
  //   })
  //   readStream.pipe(fs.createWriteStream(dest));
  // } catch (e) {
  //   console.log("SHIT");
  // }
}

const resetTemplate = () => {
  config.template = 'default_template.cpp';
  fs.writeFile(path.join(__dirname, `config.json`), JSON.stringify(config, null, 2), err => {
    if (err) {
      console.log("Error: You might need to run the command as an administrator...");
      console.log("Try sudo su?");
    }
  });
}

const setTemplate = (src) => {
  const NEW_EXTENSION = path.extname(src);
  config.template = `template${NEW_EXTENSION}`;
  copyFile(src, path.join(__dirname, `template${NEW_EXTENSION}`))
    .then(() => {
      fs.writeFile(path.join(__dirname, `config.json`), JSON.stringify(config, null, 2))
    })
    .catch(e => {
      console.log("Error: You might need to run the command as an administrator...");
      console.log("Try sudo su?");
    });
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

      copyFile(path.join(__dirname, TEMPLATE_FILE), path.join(destDir, `${ID}${EXTENSION}`));
      copyFile(path.join(__dirname, 'test.sh'), path.join(destDir, `test.sh`));
    })
    .catch(e => {
      console.log("Unable to fetch problem data: Oh no! It seems that Codeforces is down...");
    });
}

const usage = () => {
  fs.readFile(path.join(__dirname, 'help'), { encoding: 'utf8' }, (err, data) => console.log(data));
}

exports.extract = extract;
exports.setTemplate = setTemplate;
exports.resetTemplate = resetTemplate;
exports.usage = usage;
