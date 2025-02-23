import { body } from "express-validator";
import Workplaces from "../models/workplaces.js";
import CustomError from "../utils/CustomError.js";
import { Op } from "sequelize";
import wordFormatter from "../utils/wordFormatter.js";

export const workplaceValidator = (isUpdate = false) => [
  body("name")
    .notEmpty()
    .withMessage("İşyeri ismi boş olamaz.")
    .trim()
    .custom(async (name, { req }) => {
      const id = req.params.id;
      const existingWorkplace = await Workplaces.findOne({
        where: {
          name: wordFormatter(name),
          ...(isUpdate && id ? { id: { [Op.ne]: id } } : {}), // Eğer güncelleme ise, aynı id'li kayıt hariç tutuyoruz
        },
      });
      if (existingWorkplace) {
        throw new CustomError(
          "Bu işyeri ismi zaten kullanılıyor",
          400,
          "validation"
        );
      }
    }),
  body("code")
    .notEmpty()
    .withMessage("İşyeri kodu boş olamaz.")
    .trim()
    .custom(async (code, { req }) => {
      const id = req.params.id;
      const existingWorkplace = await Workplaces.findOne({
        where: {
          code: code.toLowerCase(),
          ...(isUpdate && id ? { id: { [Op.ne]: id } } : {}), // Eğer güncelleme ise, aynı id'li kayıt hariç tutuyoruz
        },
      });
      if (existingWorkplace) {
        throw new CustomError(
          "Bu işyeri kodu zaten kullanılıyor",
          400,
          "validation"
        );
      }
    }),
];
