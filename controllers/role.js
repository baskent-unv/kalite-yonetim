import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Roles from "../models/roles.js";

export const createRole = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 401, "validation"));
  }
  const { name, description } = req.body;
  try {
    const newRole = await Roles.create({
      name,
      description,
    });
    return res.status(201).json({
      message: "Rol başarıyla oluşturuldu.",
      role: newRole,
    });
  } catch (err) {
    return next(err);
  }
};
