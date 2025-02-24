import { body } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Roles from "../models/roles.js";
import wordFormatter from "../utils/wordFormatter.js";
import { Op } from "sequelize";

export const roleValidator = (isUpdate = false) => [
  body("name")
    .notEmpty()
    .withMessage("Rol adı boş olamaz.")
    .trim()
    .custom(async (name, { req }) => {
      const { id } = req.params;
      const existingRole = await Roles.findOne({
        where: {
          name: wordFormatter(name),
          ...(isUpdate && id ? { id: { [Op.ne]: id } } : {})
        },
      });
      if (existingRole) {
        throw new CustomError(
          "Bu rol zaten mevcut",
          400,
          "validation"
        );
      }
    }),
];
