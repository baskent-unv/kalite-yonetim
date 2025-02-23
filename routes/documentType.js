import {Router} from "express"
import { documentTypeValidator } from "../validators/documentTypeValidators.js";
import { isAuth } from "../middlewares/isAuth.js";
import { createDocumentType } from "../controllers/documentType.js";

const router = Router();

router.post('/create', documentTypeValidator, isAuth, createDocumentType);

export default router;