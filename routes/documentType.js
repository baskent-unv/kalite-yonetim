import {Router} from "express"
import { documentTypeValidator } from "../validators/documentTypeValidators.js";
import { isAuth } from "../middlewares/isAuth.js";
import { changeDocumentTypeStatus, createDocumentType, getDocumentTypes, updateDocumentType } from "../controllers/documentType.js";
import auditLog from "../middlewares/auditLog.js";

const router = Router();

router.post('/create', documentTypeValidator(), isAuth, auditLog, createDocumentType);
router.put("/update/:id", documentTypeValidator(true), isAuth, auditLog, updateDocumentType);
router.patch("/update-status/:id", isAuth, auditLog, changeDocumentTypeStatus);
router.get("/", isAuth, getDocumentTypes);

export default router;