import { Router } from "express";
import { createTitle } from "../controllers/title.js";
import { titleValidator } from "../validators/titleValidators.js";

const router = Router();

router.post('/create', titleValidator,createTitle);

export default router;