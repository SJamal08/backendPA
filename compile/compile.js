const fs = require('fs')
const { exec } = require('child_process');
const path = require('path');
const exercises = require('../data/Exercise.json');

// Function for execuing python code
const pythonExecute = (data, input, exoId) => {
  const res = {
    err: false,
    msg: ""
  }
  return new Promise((resolve, reject) => {
    console.warn("Exo id ", exoId)
    const exo = exercises[exoId]
    const folderName = "./tests/python/" + exo.folderName
    const fileName = folderName + "/funcFile.py"

    saveFile(fileName, data)
      .then(() => {
        // Create Input file
        fs.writeFile("input.txt", input, function (err) {
          if (err) {
            reject()
          }
        });

        // FILE SAVED SUCCESSFULLY
        // Generate the output file for it
        const filePath = path.join(__dirname, "../tests/python/" + exo.folderName + "/test.py")
        const inputPath = path.join(__dirname, "../input.txt")
        // COMPILE THE C++ CODES
        exec('python3 ' + filePath + " < " + inputPath, (err, stdout, stderr) => {
          if (err) {
            // IF COMPILATION ERROR
            resolve({
              err: true,
              output: err,
              error: stderr
            })
          }
          deleteFile( "./tests/python/" + exo.folderName + "/funcFile.py")
          resolve({
            err: false,
            output: stdout
          })
        })
      })
      .catch(() => {
        const err = {
          err: true,
          output: "Internal Server Error!"
        }
        resolve(err)
      })
    }
  )
}

const deleteFile = (filename) => {
  fs.unlink(filename, function (err) {
      if (err) {
          console.log("SORRY NOT DELETED", err)
      };
      // if no error, file has been deleted successfully
  }); 
}

const saveFile = (name, data) => {
  return new Promise((resolve, reject) => {
    // Saving File
    fs.writeFile(name, data, function (err) {
      if (err) {
        console.log(err);
        reject()
      } else {
        resolve()
      }
    });
  })
}







module.exports = {
  pythonExecute
}



