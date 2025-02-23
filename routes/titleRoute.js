import { Router } from "express";
import { createTitle } from "../controllers/title.js";
import { titleValidator } from "../validators/titleValidators.js";
import { isAuth } from "../middlewares/isAuth.js";
import auditLog from "../middlewares/auditLog.js";

const router = Router();

router.post('/create', titleValidator, isAuth, auditLog, createTitle);

export default router;