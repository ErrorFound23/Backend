import { log } from "console";
import { createReadStream, createWriteStream } from "fs";
import path from "path";

const inputFilePath = path.join(import.meta.dirname, "input.txt");
const outputFilePath = path.join(import.meta.dirname, "output.txt");

const streams = () => {
  const readableStream = createReadStream(inputFilePath, {
    encoding: "utf-8",
    highWaterMark: 16,
  });

  const writableStream = createWriteStream(outputFilePath);

  // readableStream.pipe(writableStream);

  readableStream.on("data", (chunk) => {
    console.log("Buffer (chunk): ", Buffer.from(chunk)); // convert the chunk to a buffer
    console.log("Receive chunk: ", chunk); //Logs each 16-byte chunk
    writableStream.write(chunk); // Write each chunk to output file
  });

  // Handle stream end
  readableStream.on("end", () => {
    console.log("File read compled.");
    writableStream.end();
  });

  readableStream.on("error", (err) => {
    console.error("Error: ", err);
  });
  writableStream.on("error", (err) => {
    console.error("Error: ", err);
  });
};

export default streams;
