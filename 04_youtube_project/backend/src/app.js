// app.use mostly used for setup a middlewares and configure settings
// cors allows us to cross origin resource sharing.
// cookie-parser allows us to access client cookies which was stored by server on client machine.
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
// origin: it is allows all define origin.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // find notes on internet
    credentials: true,
  })
);

// Before we use body-parser for archive same things(means get json data from a client machine)as follows but now we don't need to install body-parser package because express make it build-in.
app.use(express.json({limit: "16kb"})) // use for form data // limit allows us to receive define limited json data.
app.use(express.urlencoded({extended: true, limit: "16kb"})) // use for URL data // extended allows us to receive nested object data.
app.use(express.static("public")) // use for store file, vidoe, image, audio or public assets etc.
app.use(cookieParser())


export { app };
