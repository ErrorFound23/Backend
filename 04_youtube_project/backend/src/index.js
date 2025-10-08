import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });
const port = process.env.PORT || 5000;

// DATABASE CONNECTION
connectDB() // Return a promise
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost/${port}`);
    });

    app.on("error", (error) => {
      console.log("Err: ", error);
      throw error;
    });
  })
  .catch((error) => {
    console.log("MONGO db connection faild !!!", error);
  });
// Immediately Invoked Function Expression (IIFE)
/*
(async () => {
  try {
    console.log(process.env.MONGODB_URI);
    console.log(DB_NAME);
    // Note: avoid to use special character in mongodb atlas database user password.
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Err: ", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Error: ", error);
  }
})();
*/
