import { Router } from "express"
import { isAuth } from "../middlewares/isAuth.js";
import { changeUserApproval, changeUserStatus, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.js";
import auditLog from "../middlewares/auditLog.js";
import { registerValidator } from "../validators/userValidator.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.put("/update/:id", isAuth, isAdmin, registerValidator(true), auditLog, updateUser);
router.put("/approval/:id", isAuth, isAdmin, auditLog, changeUserApproval)
router.patch("/update-status/:id", isAuth, isAdmin, auditLog, changeUserStatus);
router.delete("/delete/:id", isAuth, isAdmin, auditLog, deleteUser)
router.get('/:id', isAuth, getUser);
router.get('/', isAuth, getUsers);

export default router;