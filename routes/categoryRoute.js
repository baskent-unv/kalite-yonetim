import { Router } from "express";
import { categoryValidator } from "../validators/categoryValidators.js";
import { isAuth } from "../middlewares/isAuth.js";
import { changeCategoryStatus, createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.js";
import auditLog from "../middlewares/auditLog.js";

const router = Router();

router.post('/create', categoryValidator(), isAuth, createCategory);
router.put("/update/:id", isAuth, categoryValidator(true), auditLog, updateCategory);
router.patch("/update-status/:id", isAuth, auditLog, changeCategoryStatus);
router.delete("/delete/:id", isAuth, auditLog, deleteCategory)
router.get('/', isAuth, getCategories);

export default router;
