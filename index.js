let express = require("express");
let fileUpload = require("express-fileupload");
let pdfParse = require("pdf-parse");
let app = express();

app.use("/", express.static("public"));

app.use(fileUpload());

app.post("/extract-pdf-text", async (req, res) => {
  if (!req.files) {
    res.status(400);
    res.end();
  }

  pdfParse(req.files.pdfFile).then((result) => {
    res.send(result.text);
  });
});

let port = 3000;

app.listen(port, () => {
  console.log("Listening On Port " + port);
});
