const fs = require('fs');

function doesFileExist(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

function compareFiles(fileA, fileB) {
  const fileAContent = fs.readFileSync(fileA).toString();
  const fileBContent = fs.readFileSync(fileB).toString();

  return fileAContent === fileBContent;
}

module.exports = {
  doesFileExist,
  compareFiles
}
