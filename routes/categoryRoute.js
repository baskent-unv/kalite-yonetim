import { Router } from "express";
import { categoryValidator } from "../validators/categoryValidators.js";
import { isAuth } from "../middlewares/isAuth.js";
import { createCategory } from "../controllers/category.js";

const router = Router();

router.post('/create', categoryValidator, isAuth, createCategory);

export default router;
