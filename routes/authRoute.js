import { Router } from "express";
import {
  changePasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  verifyTokenValidator,
} from "../validators/userValidator.js";
import { getChangePassword, getResetPassword, login, logout, register, verifyResetToken } from "../controllers/auth.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = Router();

router.post("/reset-password", getResetPassword);
router.post("/verify-reset-token", verifyTokenValidator, verifyResetToken);
router.patch("/change-password", changePasswordValidator, getChangePassword);
router.post("/register", registerValidator(), register);
router.post("/login", loginValidator, login);
router.post("/logout", isAuth, logout);

export default router;
