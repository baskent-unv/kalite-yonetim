import { Router } from "express";
import { workplaceValidator } from "../validators/workplaceValidator.js";
import { isAuth } from "../middlewares/isAuth.js";
import { changeWorkplaceStatus, createWorkplace, getWorkplaces, updateWorkplace } from "../controllers/workplace.js";
import auditLog from "../middlewares/auditLog.js";
const router = Router();

router.get("/", isAuth, getWorkplaces);
router.put(
  "/update/:id",
  isAuth,
  workplaceValidator(true),
  auditLog,
  updateWorkplace
);
router.patch("/update-status/:id", isAuth, auditLog, changeWorkplaceStatus);
router.post("/create", isAuth, workplaceValidator(), auditLog, createWorkplace);
export default router;
