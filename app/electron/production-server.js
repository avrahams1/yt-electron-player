const { app } = require("electron");
const os = require("os");
const path = require("path");
const express = require("express");

let listener = null;
const initialPort = 0;
const appdistFolder = "appdist";

function startProductionServer() {
  return new Promise(resolve => {
    const expressApp = express()

    expressApp.use(express.static(determineStaticFilesPath()));

    listener = expressApp.listen(initialPort, () => {
      const port = listener.address().port;
      console.log('Listening on port ' + port);
      resolve(`http://localhost:${port}/index-prod.html`);
    });
  });
}

function closeProductionServer() {
  listener && listener.close();
}

function determineStaticFilesPath() {
  switch (os.type()) {
    case "Darwin": 
      return path.resolve(app.getPath("exe"), "..", "..", appdistFolder);
    case "Windows_NT":
    default:
      return appdistFolder;
  }
}

module.exports = {
  startProductionServer,
  closeProductionServer
};