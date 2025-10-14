import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // store refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // to avoid validation(or avoid various fields validation kickin, it because save method want whole document)

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

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

const loginUser = asyncHandler(async (req, res) => {
  // get req.body data
  // check email and password values are not empty(including null and undefined)
  // check email is exists or not, if exists then check password,  if not exists then throw a error "email does't exists"
  // if email exists then compare password with database stored hash-password using bcrypt.compare method
  // generate access token and refresh token for user and send using "secure cookie".
  // if password and hash-password are not match then throw a error "wrong email and password"
  // if email and password both are match then successfully login user.

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  if (!password) {
    throw new ApiError(400, "password is required");
  }

  // User.findOne => available through mongoose
  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User does't exists");
  }

  // own created user.model method
  // available in your user
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Stored cookies in client machine
  // Bydefault cookies are modified by everyone from client-side to avoid it we defined some options to stop cookies modification form client-side but same cookies are accessible to mondify by server-side.
  const options = {
    httpOnly: true,
    secure: true,
  };

  // we can user cookie method because we already set cookie middleware globally.
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // remove refreshToken from database when user logout
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, // return new updated document
    }
  );

  // remvoe refreshToken and accessToken from client browser when logout
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// when accessToken expired, server refresh accessToken(or start new session)by hitting any "END POINT" after that server match client(req) refreshToken to database stored refreshToken. if both client and database token are match then server generate new accessToken and refreshToken or start new session by generating both tokens.
const refreshAccessToken = asyncHandler(async (req, res) => {
  // req.body.refreshToken used for mobile app
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
