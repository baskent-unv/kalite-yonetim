import { Router } from "express";
import { roleValidator } from "../validators/roleValidators.js";
import { createRole } from "../controllers/role.js";
import { isAuth } from "../middlewares/isAuth.js";
import auditLog from "../middlewares/auditLog.js"

const router = Router();

router.post("/create", roleValidator, isAuth, auditLog, createRole);

export default router;