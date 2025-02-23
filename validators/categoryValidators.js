import { body } from "express-validator";
import CustomError from "../utils/CustomError.js";
import wordFormatter from "../utils/wordFormatter.js";
import Categories from "../models/categories.js";
import DocumentTypes from "../models/document_types.js";

export const categoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Kategori ismi boş olamaz.")
    .trim()
    .custom(async (name) => {
      const formattedName = wordFormatter(name);
      const existingCategory = await Categories.findOne({
        where: {
          name: formattedName,
        },
      });
      if (existingCategory) {
        throw new CustomError(
          "Bu kategori ismi zaten kullanılıyor",
          400,
          "validation"
        );
      }
    }),
  body("documentTypeId")
    .notEmpty()
    .withMessage("Döküman tipi boş bırakılamaz.")
    .isInt({ gt: 0 })
    .withMessage("Geçerli bir iş yeri seçin.")
    .custom(async (documentTypeId) => {
      const existingDocumentType = await DocumentTypes.findByPk(documentTypeId);
      if (!existingDocumentType) {
        throw new CustomError(
          "Lütfen geçerli bir döküman tipi seçin",
          401,
          "valdiation"
        );
      }
    }),
];
