import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// upload.single() => to upload only one file
// upload.array() => to upload multiples files within single field(or single source)
// upload.fields() => to upload multiples files from multiples field (or multiples sources)

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export default router;
