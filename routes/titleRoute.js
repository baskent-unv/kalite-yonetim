import { Router } from "express";
import { changeTitleStatus, createTitle, deleteTitle, getTitles, updateTitle } from "../controllers/title.js";
import { titleValidator } from "../validators/titleValidators.js";
import { isAuth } from "../middlewares/isAuth.js";
import auditLog from "../middlewares/auditLog.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.post('/create', titleValidator(), isAuth, isAdmin, auditLog, createTitle);
router.put('/update/:id', titleValidator(true), isAuth, isAdmin, auditLog, updateTitle);
router.patch('/update-status/:id', isAuth, isAdmin, auditLog, changeTitleStatus);
router.delete('/delete/:id', isAuth, isAdmin, deleteTitle);
router.get('/', getTitles);

export default router;