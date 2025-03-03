import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import DocumentTypes from "../models/document_types.js";
import Categories from "../models/categories.js";
import wordFormatter from "../utils/wordFormatter.js";

export const createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 401, "validation"));
  }
  const { name, documentTypeId, description } = req.body;
  try {
    const existingDocumentType = await DocumentTypes.findByPk(documentTypeId);
    if (!existingDocumentType) {
      throw new CustomError(
        "Böyle bir başlık tipi bulunmamakta.",
        401,
        "validation"
      );
    }
    const newCategory = await Categories.create({
      name: wordFormatter(name),
      documentTypeId,
      description,
    });
    res.status(201).json({
      message: "Kategori başarıyla oluşturuldu.",
      category: newCategory,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Categories.findAll({
      include: [
        {
          model: DocumentTypes,
          attributes: ['id', 'name', 'description']
        }
      ]
    });
    if (!categories || categories.length === 0) {
      throw new CustomError('Hiç döküman başlığı bulunamadı', 404, 'not found');
    }
    return res.status(200).json({
      message: 'Döküman başlıkları başarıyla getirildi',
      categories: categories
    })
  } catch (err) {
    return next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      const firstMessage = errors.array()[0];
      return next(new CustomError(firstMessage.msg, '401', 'validation'));
  }
  const { id } = req.params;
  const { name, description, documentTypeId } = req.body;
  try {
      const existingCategory = await Categories.findByPk(id);
      if (!existingCategory) {
          throw new CustomError('Döküman başlığı bulunamadı', 404, 'not found');
      }
      existingCategory.name = wordFormatter(name);
      existingCategory.description = description;
      existingCategory.documentTypeId = documentTypeId;
      await existingCategory.save();
      return res.status(200).json({
          message: "Döküman başlığı başarıyla güncellendi."
      })
  } catch (err) {
      return next(err);
  }
}

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Categories.findByPk(id);

    if (!category) {
      throw new CustomError(
        "Döküman başlığı bulunamadı.",
        404,
        "not found"
      );
    }

    await category.destroy();

    return res.status(200).json({
      message: "Döküman Başlığı başarıyla silindi",
    });
  } catch (err) {
    if (err instanceof Sequelize.ForeignKeyConstraintError) {
      return next(new CustomError(
        "Bu döküman başlığını silmeden önce ona bağlı dökümanları ve birimleri silmelisiniz.",
        400,
        "foreign_key_constraint"
      ));
    }
    return next(err);
  }
};

export const changeCategoryStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  if (status !== 0 && status !== 1) {
      return next(new CustomError(
          "Geçersiz statü değeri girmeye çakışıyorsun. Sadece 1 veya 0 değerleri kabul edilir.",
          400,
          "validation"
      ))
  }
  try {
      const existingCategory = await Categories.findByPk(id);
      if(!existingCategory) {
          throw new CustomError('Döküman başlığı bulunamadı', 404, 'not found');
      }
      existingCategory.status = status;
      await existingCategory.save();
      return res.status(200).json({
          message: 'Dökğman başlığı statüsü başarıyla değiştirildi.'
      })
  } catch(err) {
      return next(err);
  }
}
