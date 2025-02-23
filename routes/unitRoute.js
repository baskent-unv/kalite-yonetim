import {Router} from "express"
import { unitValidator } from "../validators/unitValidators.js";
import { unitCreate } from "../controllers/unit.js";
import { isAuth } from "../middlewares/isAuth.js";
import auditLog from "../middlewares/auditLog.js";

const router = Router();

router.post('/create', unitValidator, isAuth, auditLog, unitCreate);

export default router;