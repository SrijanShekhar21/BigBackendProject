import { Router } from "express";
import {
  homePage,
  loginPage,
  registerPage,
  userRegister,
} from "../controllers/home.controller.js";

import { passport } from "../middlewares/passport.middleware.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js";

const router = Router();

//GET Routes
router.route("/").get(homePage);
router.route("/login").get(loginPage);
router.route("/register").get(registerPage);

router.use(sessionMiddleware);

router.use(passport.initialize());
router.use(passport.session());

//POST Routes
router.route("/login").post(
  passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login",
  })
);

router.route("/register").post(userRegister);

export default router;
