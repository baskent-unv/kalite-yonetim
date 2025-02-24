import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import DocumentTypes from "../models/document_types.js";
import wordFormatter from "../utils/wordFormatter.js";

export const createDocumentType = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage, 401, "validation"));
  }
  const { name, description } = req.body;
  try {
    const newDocumentType = await DocumentTypes.create({
      name: wordFormatter(name),
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

export const updateDocumentType = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 401, 'validation'));
  }
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const exsistingDocumentType = await DocumentTypes.findByPk(id);
    if (!exsistingDocumentType) {
      throw new CustomError('Döküman tipi bulunamadı', 404, 'not found');
    }
    exsistingDocumentType.name = wordFormatter(name);
    exsistingDocumentType.description = description;
    await exsistingDocumentType.save();
    return res.status(200).json({
      message: 'Döküman tipi başarıyla güncellendi'
    })
  } catch (err) {
    return next(err);
  }
}

export const changeDocumentTypeStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  if (status !== 0 && status !== 1) {
    return next(new CustomError("Geçersiz statü değeri girmeye çakışıyorsun. Sadece 1 veya 0 değerleri kabul edilir.",
      400,
      "validation"))
  }
  try {
    const exsistingDocumentType = await DocumentTypes.findByPk(id);
    if (!exsistingDocumentType) {
      throw new CustomError('Döküman tipi bulunamadı', 404, 'not found');
    }
    exsistingDocumentType.status = status;
    await exsistingDocumentType.save();
    return res.status(200).json({
      message: 'Döküman tipi statüsü başarıyla güncellendi',
    })
  } catch (err) {
    return next(err);
  }
}

export const getDocumentTypes = async (req, res, next) => {
  try {
    const documentTypes = await DocumentTypes.findAll();
    if (!documentTypes || documentTypes.length === 0) {
      throw new CustomError('Hiç döküman tipi bulunamadı.', 404, 'not found');
    }
    return res.status(200).json({
      message: 'Döküman tipleri başarıyla getirildi.',
      documentTypes
    })
  } catch (err) {
    return next(err);
  }
}
