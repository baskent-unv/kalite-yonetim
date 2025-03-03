import { Router } from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/userValidator.js";
import { login, logout, register } from "../controllers/auth.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = Router();

router.post("/register", registerValidator(), register);
router.post("/login", loginValidator, login);
router.post("/logout", isAuth, logout);

export default router;
