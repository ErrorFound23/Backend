import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Authorization: Bearer <token> set in header
    // usually req.header used for get cookies from mobile app.
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // decodedToken?._id received from user.model => generateAccessToken 
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    // TODO: discuss about frontend
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // create new object called user inside request which store user info.
    req.user = user;
    next(); // send controll to next middleware
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
