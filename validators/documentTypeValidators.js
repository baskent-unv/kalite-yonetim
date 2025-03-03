import { body } from "express-validator";
import CustomError from "../utils/CustomError.js";
import DocumentTypes from "../models/document_types.js";
import Categories from "../models/categories.js";
import wordFormatter from "../utils/wordFormatter.js";
import { Op } from "sequelize";

export const documentTypeValidator = (isUpdate = false) => [
  body("name")
    .notEmpty()
    .withMessage("Başlık tipi adı boş olamaz.")
    .trim()
    .custom(async (name, { req }) => {
      const { id } = req.params;
      const existingDocumentType = await Categories.findOne({
        where: {
          name: wordFormatter(name),
          ...(isUpdate && id ? { id: { [Op.ne]: id } } : {})
        },
      });
      if (existingDocumentType) {
        throw new CustomError("Bu başlık tipi zaten mevcut", 400, "validation");
      }
    }),
];
