const express = require("express");
const path = require("path");
const fs = require("fs");
const hound = require('hound');

const app = express();
const server = app.listen(3000);
const io = require("socket.io").listen(server);


let socket = null;
let socketlist = {};

let counter = 0;

io.on("connection", skt => {
  console.log("a user connected", skt.id);

  skt.on('fileName', file => {
    socketlist[file.fileName] = skt;
    // console.log(skt);
    // skt.join(file.fileName);
    // socketlist[file.fileName][counter] = skt;
    counter++;
  });

  // const emitFileContent = function() {
  //   io.to('').emit("file-changed", {
  //     message: "file changed",
  //     fileContent
  //   });
  // };
});


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// const directoryPath = path.join(__dirname, "logs");

app.get("/getDir", function() {});


app.get("/files/:filename", (req, res) => {
  fileName = `./logs/${req.params.filename}`;


  watcher = hound.watch('./logs');
    watcher.on('change', function(file, stats) {
      console.log(file + ' was changed');
      console.log(socketlist[file]);
        socketlist[file].emit("file-changed", {
          messagfileNamee: "file changed",
          fileContent
        });
    });
  // fs.watchFile(fileName, function(data) {
  //   let fileContent = readFile(fileName);
  //   // console.log(skt.id);
  //   // emitFileContent();
  //   console.log("Sockets", socketlist);
  //   io.to(fileName).emit("file-changed", {
  //     message: "file changed",
  //     fileContent
  //   });
  // });
  let fileContent = readFile(fileName);
  res.render("index", { fileContent, fileName });
});


function readFile(fileName) {
  let fileContent = fs.readFileSync(fileName, { encoding: "utf-8" });
  return fileContent;
}
