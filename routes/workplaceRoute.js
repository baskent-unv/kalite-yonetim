import { Router } from "express";
import { workplaceValidator } from "../validators/workplaceValidator.js";
import { isAuth } from "../middlewares/isAuth.js";
import { changeWorkplaceStatus, createWorkplace, deleteWorkplace, getWorkplaces, updateWorkplace } from "../controllers/workplace.js";
import auditLog from "../middlewares/auditLog.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const router = Router();

router.get("/", getWorkplaces);
router.put(
  "/update/:id",
  isAuth,
  isAdmin,
  workplaceValidator(true),
  auditLog,
  updateWorkplace
);
router.patch("/update-status/:id", isAuth, isAdmin, auditLog, changeWorkplaceStatus);
router.post("/create", isAuth, isAdmin, workplaceValidator(), auditLog, createWorkplace);
router.delete("/delete/:id", isAuth, isAdmin, auditLog, deleteWorkplace);
export default router;
