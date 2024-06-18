import { Router } from "express";
import {
  deleteProfilePic,
  changeProfilePic,
  userLogOut,
  userProfilePage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(userProfilePage); //users/
router.route("/logout").get(userLogOut); //users/logout
router
  .route("/changeProfilePic")
  .post(upload.single("newProfilePic"), changeProfilePic); //users/changeProfilePic

router.route("/deleteProfilePic").post(deleteProfilePic);

export default router;
