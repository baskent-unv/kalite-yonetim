import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import DocumentTypes from "../models/document_types.js";

export const createDocumentType = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage, 401, "validation"));
  }
  const { name, description } = req.body;
  try {
    const newDocumentType = await DocumentTypes.create({
      name,
      description,
    });
    res.status(201).json({
      message: "Döküman tipi başarıyla oluşturuldu.",
      documentType: newDocumentType,
    });
  } catch (err) {
    return next(err);
  }
};
