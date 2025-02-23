import { body } from "express-validator";
import Categories from "../models/categories.js";
import CustomError from "../utils/CustomError.js";
import Workplaces from "../models/workplaces.js";

export const documentValidator = [
  body("name").notEmpty().withMessage("Döküman ismi boş olamaz."),
  body("workplaceId")
    .notEmpty()
    .withMessage("İşyeri boş bırakılamaz.")
    .isInt({ gt: 0 })
    .withMessage("Geçerli bir iş yeri seçin.")
    .custom(async (workplaceId) => {
      const existingWorkplace = await Workplaces.findByPk(workplaceId);
      if (!existingWorkplace) {
        throw new CustomError(
          "Lütfen geçerli bir işyeri seçin",
          401,
          "valdiation"
        );
      }
    }),
  body("categoryId")
    .notEmpty()
    .withMessage("Kategori boş bırakılamaz.")
    .isInt({ gt: 0 })
    .withMessage("Geçerli bir kategori seçin.")
    .custom(async (categoryId) => {
      const existingcategory = await Categories.findByPk(categoryId);
      if (!existingcategory) {
        throw new CustomError(
          "Lütfen geçerli bir kategori seçin",
          401,
          "valdiation"
        );
      }
    }),
];
