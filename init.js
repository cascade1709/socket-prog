const express = require("express");
const path = require("path");
const hound = require("hound");

const app = express();
const server = app.listen(3000);
const io = require("socket.io").listen(server);

let counter = 0;

io.on("connection", skt => {
  console.log("a user connected", skt.id);
  skt.on("fileName", file => {
    skt.join(file.fileName);
  });
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/files/:filename", (req, res) => {
  fileName = `./logs/${req.params.filename}`;
  watcher = hound.watch("./logs");
  watcher.on("change", function(file, stats) {
    let fileContent = readFile(file);
    io.sockets.in(file).emit("file-changed", {
      messagfileNamee: "file changed",
      fileContent
    });
  });
  let fileContent = readFile(fileName);
  res.render("index", { fileContent, fileName });
});

function readFile(fileName) {
  let fileContent = fs.readFileSync(fileName, { encoding: "utf-8" });
  return fileContent;
}
