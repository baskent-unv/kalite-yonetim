import { Router } from "express"
import { unitValidator } from "../validators/unitValidators.js";
import { changeUnitStatus, deleteUnit, getUnits, unitCreate, updateUnit } from "../controllers/unit.js";
import { isAuth } from "../middlewares/isAuth.js";
import auditLog from "../middlewares/auditLog.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.post('/create', isAuth, isAdmin, unitValidator(), auditLog, unitCreate);
router.put("/update/:id", isAuth, isAdmin, unitValidator(true), auditLog, updateUnit);
router.patch("/update-status/:id", isAuth, isAdmin, auditLog, changeUnitStatus);
router.delete("/delete/:id", isAuth, isAdmin, auditLog, deleteUnit)
router.get("/", getUnits);
export default router;