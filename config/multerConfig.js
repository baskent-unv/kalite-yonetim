import multer from "multer";
import path from "path";
import CustomError from "../utils/CustomError.js";
import { formatFileName } from "../utils/formalPdfName.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/documents");
  },
  filename: function (req, file, cb) {
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now();
    const formattedName = formatFileName(originalName, uniqueSuffix, extension)
    cb(
      null,
      formattedName
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(
      new CustomError(
        "Sadece pdf türünde ki dosyaları yükleyebilirsiniz.",
        400,
        "validation"
      )
    );
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, //100 MB
});

export default upload;
