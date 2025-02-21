import { Router } from "express"
import { loginValidator, registerValidator } from "../validators/userValidator.js";
import { login, register } from "../controllers/auth.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post('/login', loginValidator, login);

export default router;