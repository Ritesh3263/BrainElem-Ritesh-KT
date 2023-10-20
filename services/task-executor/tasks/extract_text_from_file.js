const ContentFile = require('../models/content_file.model')
var textract = require('textract');
const { exec, execSync } = require("child_process");
const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');

var axios = require('axios');

function removeFiles(name) {
  name = name.substr(0, name.lastIndexOf("."))
  if (name.length < 5) return; // To make sure it will not remove all files
  exec(`rm ${name}*`, (error, stdout, stderr) => {
    if (error || stderr) console.log("Could not remove", name, error, stderr);
    else console.log("Removed", name)
  })
}

function extractText(file, fileMimeType, fileName, callback) {
  // Run textract to extract text
  textract.fromFileWithMimeAndPath(fileMimeType, fileName, { pdftotextOptions: { layout: "dont use" } }, async (error, text) => {
    if (error) {
      await removeFiles(file.fileName);
      return callback({ message: `Error when extracting text from ${file.fileOriginalName} ${error}`, ack: 1 })
    }
    console.log(`Extracted text from file ${file.fileName}: ${text.slice(0, 100)}...`)
    file.fileTextExtracted = text;
    await removeFiles(file.fileName);
    file.save()
    callback();
  })
}


async function extractTextFromFile(fileId, callback) {
  let file = await ContentFile.findById(fileId)
  var fileName = file.fileName
  var fileMimeType = file.mimeType
  let fileType = file.mimeType.substr(0, file.mimeType.indexOf('/'));
  var fileUrl = `${process.env.BACKEND_URL}/contents/files/download/${fileId}`;

  const fileCopy = fs.createWriteStream(`${file.fileName}`);



  console.log("Downloading file:", file.fileOriginalName, fileMimeType)

  const request = http.get(fileUrl, function (response) {
    response.pipe(fileCopy);
    fileCopy.on('finish', function () {// When downloaded
      fileCopy.close(async () => {
        try {


          if (fileType == 'audio') {
            return callback();
          }
          if (fileType == 'video') {
            return callback();
          }
          // If the file is an image, change it into `pdf`
          if (fileType == 'image') {
            console.log("Transforming image into PDF", file.fileOriginalName)
            let command = `convert "${fileName}" -quality 100 ${fileName}.pdf`
            execSync(command)
            fileName = `${file.fileName}.pdf`// Update name 
            fileMimeType = "application/pdf" // Update MimeType
          }
          // If the file is a document, change it into `pdf`
          if (['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text'].includes(fileMimeType)) {
            console.log("Transforming document into PDF", file.fileOriginalName)
            let command = `lowriter --convert-to pdf ${fileName}`
            execSync(command)
            fileName = fileName.substr(0, fileName.lastIndexOf(".")) + ".pdf";// Update name
            fileMimeType = "application/pdf" // Update MimeType
          }

          if (fileMimeType === "application/pdf") { // OCR PDF
            console.log("Running OCR for ", file.fileOriginalName)
            command = `ocrmypdf --redo-ocr -l fra -l eng -l pol ${fileName} ${fileName}_ocr.pdf`

            exec(command, async (err) => {
              if (err && !err.message.includes("Output file is okay")) {
                await removeFiles(file.fileName);
                callback({ message: `Error when extracting text from ${file.fileOriginalName} ${err}`, ack: 1 })
              }
              else {
                fileName = `${fileName}_ocr.pdf`
                extractText(file, fileMimeType, fileName, callback)
              }

            })
          }
          else (extractText(file, fileMimeType, fileName, callback))

        } catch (err) {
          await removeFiles(file.fileName);
          callback({ message: `Error when extracting text from ${file.fileOriginalName} ${err}`, ack: 1 })
        }
      });  // close() is async, call cb after close completes.
    });


  });


}

module.exports = extractTextFromFile;
