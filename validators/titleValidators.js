import { body } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Title from "../models/titles.js";
import wordFormatter from "../utils/wordFormatter.js";
import { Op } from "sequelize";

export const titleValidator = (isUpdate = false) => [
  body("name")
    .notEmpty()
    .withMessage("Çalışma ünvanı boş olamaz.")
    .trim()
    .custom(async (name, { req }) => {
      const id = req.params.id;
      const existingTitle = await Title.findOne({
        where: {
          name: wordFormatter(name),
          ...(isUpdate && id ? { id: { [Op.ne]: id } } : {})
        },
      });
      if (existingTitle) {
        throw new CustomError(
          "Bu çalışma ünvanı zaten mevcut",
          400,
          "validation"
        );
      }
    }),
];
