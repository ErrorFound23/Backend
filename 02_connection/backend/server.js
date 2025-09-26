// https://www.npmjs.com/package/dotenv?adobe_mc=MCMID%3D62000214905405683995335849378418609464%7CMCORGID%3DA8833BC75245AF9E0A490D4D%2540AdobeOrg%7CTS%3D1756339200
// https://jsonformatter.org/
// https://www.npmjs.com/package/cors

// const express = require('express') // commanjs import syntax(synchronise) ES5
import express from "express"; // module import syntax(asynchronise) ES6
const app = express();
const port = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });

// Bad practice
// can't modify static file from the frontend, or we need to add new updated dist folder in backend to reflect new change on webpage
// app.use(express.static('dist'));

// get a list of 5 jokes
app.get("/api/v1/jokes", (req, res) => {
  
  const jokes = [
    { id: 1, title: "A joke", content: "This is a joke" },
    { id: 2, title: "Another joke", content: "This is another joke" },
    { id: 3, title: "A third joke", content: "This is third joke" },
    { id: 4, title: "A fourth joke", content: "This is fourth joke" },
    { id: 5, title: "A fiveth joke", content: "This is fiveth joke" },
    { id: 6, title: "A sixth joke", content: "This is sixth joke" },
  ];

  res.json(jokes);
});

app.listen(
  (port,
  () => {
    console.log(`Server listening on port http://localhost:${port}`);
  })
);
