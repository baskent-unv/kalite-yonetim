import { body } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Roles from "../models/roles.js";

export const roleValidator = [
  body("name")
    .notEmpty()
    .withMessage("Rol adı boş olamaz.")
    .trim()
    .custom(async (name) => {
      const existingRole = await Roles.findOne({
        where: {
          name: name.toLowerCase(),
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
