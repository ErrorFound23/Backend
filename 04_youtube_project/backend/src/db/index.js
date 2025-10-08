import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance}`);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection FAILD: ", error);
    process.exit(1); // find notes on internet
  }
};

export default connectDB;
