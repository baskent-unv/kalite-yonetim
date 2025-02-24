import { Router } from "express";
import { roleValidator } from "../validators/roleValidators.js";
import { changeRoleStatus, createRole, getRoles, updateRole } from "../controllers/role.js";
import { isAuth } from "../middlewares/isAuth.js";
import auditLog from "../middlewares/auditLog.js"

const router = Router();

router.post("/create", roleValidator(), isAuth, auditLog, createRole);
router.put("/update/:id", roleValidator(true), isAuth, auditLog, updateRole);
router.patch("/update-status/:id", isAuth, auditLog, changeRoleStatus);
router.get("/", isAuth, getRoles);

export default router;