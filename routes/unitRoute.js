import {Router} from "express"
import { unitValidator } from "../validators/unitValidators.js";
import { unitCreate } from "../controllers/unit.js";

const router = Router();

router.post('/create', unitValidator, unitCreate);

export default router;