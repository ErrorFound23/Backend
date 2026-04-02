import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { extractPublicId } from "cloudinary-build-url";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload the file on cloudinary
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded successfull
    // console.log("file is uploaded on cloudinary", res.url);
    fs.unlinkSync(localFilePath);
    return res;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const removeFromcloudinary = async (publicUrl) => {
  try {
    if (!publicUrl) return null;
    const publicId = extractPublicId(publicUrl);
    const res = await cloudinary.uploader.destroy(publicId);
    // console.log("Remove Image Successfully: ", res);

    return res;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, removeFromcloudinary };
