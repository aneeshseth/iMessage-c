import { loginUser, logout, registerUser } from "../Controllers/userController";
import { verify } from "../Middleware/verify";
import express, { Router } from "express";
const router: Router = express.Router();
router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify").get(verify);
router.route("/logout").get(logout);

export { router };
