import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Documents from "../models/documents.js";
import fs from "fs";
import wordFormatter from "../utils/wordFormatter.js";
import Categories from "../models/categories.js";
export const uploadDocument = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 401, "validation"));
  }
  if (!req.file) {
    throw new CustomError(
      "PDF dosyası yüklenemedi veya yanlış formatta.",
      401,
      "validation"
    );
  }
  const { name, categoryId, workplaceId, unitId } = req.body;
  try {
    const filePath = req.file.path;
    const fileSize = req.file.size;
    const existingDocument = await Documents.findOne({
      where: {
        name: wordFormatter(name),
        categoryId: categoryId,
        workplaceId: workplaceId,
        unitId: unitId ? unitId : null,
        fileSize: fileSize,
      },
    });
    if (existingDocument) {
      const filePathToDelete = req.file.path;
      if (fs.existsSync(filePathToDelete)) {
        fs.unlinkSync(filePathToDelete); // Yeni dosya siliniyor
      }
      throw new CustomError(
        "Eklemek istediğiniz döküman zaten mevcut!",
        409,
        "conflict"
      );
    }
    const selectedCategory = await Categories.findByPk(categoryId);
    if (unitId && selectedCategory.documentTypeId === 1) {
      throw new CustomError(
        "Seçtiğiniz kategori bir birimin altında yer alamaz.",
        401,
        "validation"
      );
    } else if (!unitId && selectedCategory.documentTypeId === 2) {
      throw new CustomError(
        "Bu kategoriyi seçebilmek için bir birim seçmelisiniz.",
        401,
        "validation"
      );
    }
    const docType = unitId ? 2 : 1;
    const newDocument = Documents.create({
      name: wordFormatter(name),
      categoryId,
      unitId,
      documentTypeId: docType,
      workplaceId,
      filePath,
      fileSize,
    });
    return res.status(201).json({
      message: "Döküman başarıyla yüklendi.",
      document: newDocument,
    });
  } catch (err) {
    return next(err);
  }
};
