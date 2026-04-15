import express from "express";
import fs from "fs";
import status from "express-status-monitor";
import zlib from "zlib";
import streams from "./streams.js";

const app = express();
const port = 5000;
streams();

app.use(status());

//   400MB File => 400MB(Zip) => 400MB Write = 800MB (Store in memory)
//   Stream Read => 400MB(Zip) => Zipper = fs Write stream

fs.createReadStream("./src/sample.txt").pipe(
  zlib.createGzip().pipe(fs.createWriteStream("./src/sample.zip")),
);

app.get("/", (req, res) => {
  // Without stream, all the data of a file load once in buffer(as Binary) and then after store in variable memory(as String if you mention encoding like "utf-8") in node.js, which make ineffiecient use of memory.

  //   fs.readFile("./src/sample.txt", "utf-8", (err, data) => {
  //     if (err) {
  //     //   console.error("Error reading file:", err);
  //       return res.status(500).send("Error reading file:");
  //     }
  //     // console.log(data);
  //     res.end(data);
  //   });

  const stream = fs.createReadStream("./src/sample.txt", "utf-8");
  stream.on("data", (chunck) => {
    res.write(chunck);
  });
  stream.on("end", () => {
    res.end();
  });
});

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
  console.log(`Monitor dashboard available at http://localhost:${port}/status`);
});
