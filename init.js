const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const server = app.listen(3000);
const io = require("socket.io").listen(server);

let socket = null;
let socketlist = {};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// const directoryPath = path.join(__dirname, "logs");

app.get("/getDir", function() {});

app.get("/files/:filename", (req, res) => {
  fileName = `./logs/${req.params.filename}`;
  fs.watchFile(fileName, function(data) {
    let fileContent = readFile(fileName);
    console.log(socketlist[fileName].id);
    socketlist[fileName].emit("file-changed", {
      message: "file changed",
      fileContent
    });
  });
  let fileContent = readFile(fileName);
  res.render("index", { fileContent });
});

function readFile(fileName) {
  let fileContent = fs.readFileSync(fileName, { encoding: "utf-8" });
  return fileContent;
}

io.on("connection", skt => {
  socket = skt;
  socketlist[fileName] = skt;
  console.log("a user connected", socket.id);
});
