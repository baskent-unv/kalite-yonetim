import { Router } from "express"
import { unitValidator } from "../validators/unitValidators.js";
import { changeUnitStatus, getUnits, unitCreate, updateUnit } from "../controllers/unit.js";
import { isAuth } from "../middlewares/isAuth.js";
import auditLog from "../middlewares/auditLog.js";

const router = Router();

router.post('/create', isAuth, unitValidator(), auditLog, unitCreate);
router.put("/update/:id", isAuth, unitValidator(true), auditLog, updateUnit);
router.patch("/update-status/:id", isAuth, auditLog, changeUnitStatus);
router.get("/", isAuth, getUnits);
export default router;