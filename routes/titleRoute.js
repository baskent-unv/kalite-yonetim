import { Router } from "express";
import { changeTitleStatus, createTitle, getTitles, updateTitle } from "../controllers/title.js";
import { titleValidator } from "../validators/titleValidators.js";
import { isAuth } from "../middlewares/isAuth.js";
import auditLog from "../middlewares/auditLog.js";

const router = Router();

router.post('/create', titleValidator(), isAuth, auditLog, createTitle);
router.patch('/update/:id', titleValidator(true), isAuth, auditLog, updateTitle);
router.patch('/update-status/:id', isAuth, auditLog, changeTitleStatus);
router.get('/', isAuth, getTitles);

export default router;