import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation  - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object = create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  // Only handle json data, which means we can't handle file data like image, vidoe, audio etc. using req.body.
  // to handle file we use middleware(using multer) which allow to handle and store file on server.
  const { username, email, fullName, password } = req.body;

  // if (!username && username === "") {
  //   throw new ApiError(400, "username is required")
  // }

  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  // If user already exists
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // middleware(using multer) allow us to handle file using res.files
  // console.log("files : ", req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path; //  uploaded file local server path
  // const coverImagePath = req.files?.coverImage[0]?.path; // to avoid undefine error

  let coverImagePath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagePath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is requird");
  }

  // upload file from server to cloudinary storage service
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is requird");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    avatar: avatar.url, // store cloudinary uploaded file URL
    coverImage: coverImage?.url || "",
    password,
  });

  // check user created or not and if user created then remove password and refreshToken fields from object
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the User");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export { registerUser };
