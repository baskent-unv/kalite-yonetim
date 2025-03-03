import { Router } from "express";
import { isAuth } from "../middlewares/isAuth.js";
import upload from "../config/multerConfig.js";
import { documentValidator } from "../validators/documentValidators.js";
import { deleteDocument, getDocuments, sendPdf, updateDocument, uploadDocument } from "../controllers/document.js";
import auditLog from "../middlewares/auditLog.js";

const router = Router();

router.post(
  "/upload",
  isAuth,
  upload.single("document"),
  documentValidator,
  uploadDocument
);
router.put('/update/:id', isAuth, upload.single("document"), auditLog, updateDocument);
router.delete('/delete/:id', isAuth, auditLog, deleteDocument);
router.get("/", isAuth, getDocuments);
router.get("/pdf/:filename", sendPdf);

export default router;
