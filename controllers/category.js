import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import DocumentTypes from "../models/document_types.js";
import Categories from "../models/categories.js";
import wordFormatter from "../utils/wordFormatter.js";

export const createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 401, "validation"));
  }
  const { name, documentTypeId, description } = req.body;
  try {
    const existingDocumentType = await DocumentTypes.findByPk(documentTypeId);
    if (!existingDocumentType) {
      throw new CustomError(
        "Böyle bir döküman tipi bulunmamakta.",
        401,
        "validation"
      );
    }
    const newCategory = await Categories.create({
      name: wordFormatter(name),
      documentTypeId,
      description,
    });
    res.status(201).json({
      message: "Kategori başarıyla oluşturuldu.",
      category: newCategory,
    });
  } catch (err) {
    next(err);
  }
};
