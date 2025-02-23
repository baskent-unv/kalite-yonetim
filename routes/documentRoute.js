import { Router } from "express";
import { isAuth } from "../middlewares/isAuth.js";
import upload from "../config/multerConfig.js";
import { documentValidator } from "../validators/documentValidators.js";
import { uploadDocument } from "../controllers/document.js";

const router = Router();

router.post(
  "/upload",
  isAuth,
  upload.single("document"),
  documentValidator,
  uploadDocument
);

export default router;
