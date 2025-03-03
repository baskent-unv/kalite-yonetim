import { body } from "express-validator";
import CustomError from "../utils/CustomError.js";
import wordFormatter from "../utils/wordFormatter.js";
import Categories from "../models/categories.js";
import DocumentTypes from "../models/document_types.js";
import { Op } from "sequelize";

export const categoryValidator = (isUpdate = false) => [
  body("name")
    .notEmpty()
    .withMessage("Döküman başlığı boş olamaz.")
    .trim()
    .custom(async (name, {req}) => {
      const id = req.params.id;
      const formattedName = wordFormatter(name);
      const existingCategory = await Categories.findOne({
        where: {
          name: formattedName,
          ...(isUpdate && id ? { id: { [Op.ne]: id } } : {})
        },
      });
      if (existingCategory) {
        throw new CustomError(
          "Bu döküman başlığı zaten kullanılıyor",
          400,
          "validation"
        );
      }
    }),
  body("documentTypeId")
    .notEmpty()
    .withMessage("Başlık tipi boş bırakılamaz.")
    .isInt({ gt: 0 })
    .withMessage("Geçerli bir başlık tipi seçin.")
    .custom(async (documentTypeId) => {
      const existingDocumentType = await DocumentTypes.findByPk(documentTypeId);
      if (!existingDocumentType) {
        throw new CustomError(
          "Lütfen geçerli bir başlık tipi seçin",
          401,
          "valdiation"
        );
      }
    }),
];
