import { Router } from "express"
import { workplaceValidator } from "../validators/workplaceValidator.js";
import { isAuth } from "../middlewares/isAuth.js";
import { createWorkplace } from "../controllers/workplace.js";
const router = Router();

router.post("/create", workplaceValidator(), createWorkplace);


export default router;