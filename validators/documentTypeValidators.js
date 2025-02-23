import { body } from "express-validator";
import CustomError from "../utils/CustomError.js";
import DocumentTypes from "../models/document_types.js";
import Categories from "../models/categories.js";

export const documentTypeValidator = [
  body("name")
    .notEmpty()
    .withMessage("Döküman tipi adı boş olamaz.")
    .trim()
    .custom(async (name) => {
      const existingDocumentType = await Categories.findOne({
        where: {
          name: name.toLowerCase(),
        },
      });
      if (existingDocumentType) {
        throw new CustomError("Bu döküman tipi zaten mevcut", 400, "validation");
      }
    }),
];
