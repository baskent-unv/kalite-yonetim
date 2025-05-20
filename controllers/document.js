import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Documents from "../models/documents.js";
import fs from "fs";
import wordFormatter from "../utils/wordFormatter.js";
import Categories from "../models/categories.js";
import Workplaces from "../models/workplaces.js";
import { Op } from "sequelize";
import Units from "../models/units.js";
import DocumentTypes from "../models/document_types.js";
import { fileURLToPath } from "url";
import path, { normalize } from "path";
import { disablePdfPriting } from "../utils/formattedPdfFile.js";
export const uploadDocument = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 401, "validation"));
  }
  if (!req.file) {
    throw new CustomError(
      "PDF dosyası yüklenemedi veya yanlış formatta.",
      401,
      "validation"
    );
  }
  const { name, categoryId, workplaceId, unitId } = req.body;
  try {
    const normalizedPath = normalize(req.file.path);
    const filePath = normalizedPath.replace(/\\/g, "/");
    const fileSize = req.file.size;
    const existingDocument = await Documents.findOne({
      where: {
        name: wordFormatter(name),
        categoryId: categoryId,
        workplaceId: workplaceId,
        unitId: unitId ? unitId : null,
        fileSize: fileSize,
      },
    });
    if (existingDocument) {
      const filePathToDelete = req.file.path;
      if (fs.existsSync(filePathToDelete)) {
        fs.unlinkSync(filePathToDelete); // Yeni dosya siliniyor
      }
      throw new CustomError(
        "Eklemek istediğiniz döküman zaten mevcut!",
        409,
        "conflict"
      );
    }
    const selectedCategory = await Categories.findByPk(categoryId);
    if (unitId && selectedCategory.documentTypeId === 1) {
      throw new CustomError(
        "Seçtiğiniz kategori bir birimin altında yer alamaz.",
        401,
        "validation"
      );
    } else if (!unitId && selectedCategory.documentTypeId === 2) {
      throw new CustomError(
        "Bu kategoriyi seçebilmek için bir birim seçmelisiniz.",
        401,
        "validation"
      );
    }
    const docType = unitId ? 2 : 1;
    if (categoryId == 25) {
      const newDocument = await Documents.create({
        name: wordFormatter(name),
        categoryId,
        unitId,
        documentTypeId: docType,
        workplaceId,
        filePath: filePath, // Yazdırma kısıtlamalı dosya yolu kaydediliyor
        fileSize,
      });

      return res.status(201).json({
        message: "Döküman başarıyla yüklendi ve yazdırma kısıtlaması uygulandı.",
        document: newDocument,
      });
    } else {
      const outputFilePath = `uploads/documents/${req.file.filename}-no-print.pdf`;
      disablePdfPriting(filePath, outputFilePath, async (err, processedFilePath) => {
        if (err) {
          return next(new CustomError("PDF dosyasına yazdırma kısıtlaması eklenirken hata oluştu.", 500, "pdf_error"));
        }

        // Yeni dokümanı veritabanına kaydet
        const newDocument = await Documents.create({
          name: wordFormatter(name),
          categoryId,
          unitId,
          documentTypeId: docType,
          workplaceId,
          filePath: processedFilePath, // Yazdırma kısıtlamalı dosya yolu kaydediliyor
          fileSize,
        });

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return res.status(201).json({
          message: "Döküman başarıyla yüklendi ve yazdırma kısıtlaması uygulandı.",
          document: newDocument,
        });
      });
    }
  } catch (err) {
    return next(err);
  }
};

export const updateDocument = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 401, "validation"));
  }

  const { id } = req.params; // Güncellenmek istenen dokümanın ID'si
  const { name, categoryId, workplaceId, unitId } = req.body;

  try {
    // Mevcut dokümanı bul
    const existingDocument = await Documents.findByPk(id);
    if (!existingDocument) {
      throw new CustomError("Güncellemek istediğiniz döküman bulunamadı.", 404, "not_found");
    }

    // Eğer yeni bir dosya yüklendiyse
    if (req.file) {
      const normalizedPath = normalize(req.file.path);
      const filePath = normalizedPath.replace(/\\/g, "/");
      const fileSize = req.file.size;

      // Aynı dosya adı ve diğer kriterlere göre başka bir doküman var mı?
      const duplicateDocument = await Documents.findOne({
        where: {
          name: wordFormatter(name),
          categoryId: categoryId,
          workplaceId: workplaceId,
          unitId: unitId,
          fileSize: fileSize,
          id: { [Op.ne]: id }, // Güncellenen dokümanı hariç tut
        },
      });

      if (duplicateDocument) {
        // Yeni yüklenen dosyayı sil
        const filePathToDelete = req.file.path;
        if (fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
        }
        throw new CustomError(
          "Bu kriterlerle başka bir doküman zaten mevcut!",
          409,
          "conflict"
        );
      }

      // Eski dosyayı sil
      const oldFilePath = existingDocument.filePath;
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Yeni dosyaya yazdırma kısıtlaması uygulayın
      const outputFilePath = `uploads/documents/${req.file.filename}-no-print.pdf`;
      disablePdfPriting(filePath, outputFilePath, async (err, processedFilePath) => {
        if (err) {
          return next(new CustomError("PDF dosyasına yazdırma kısıtlaması eklenirken hata oluştu.", 500, "pdf_error"));
        }

        // Dokümanı güncelle
        existingDocument.name = wordFormatter(name);
        existingDocument.categoryId = categoryId;
        existingDocument.unitId = unitId ? unitId : null;
        existingDocument.documentTypeId = unitId ? 2 : 1;
        existingDocument.workplaceId = workplaceId;
        existingDocument.filePath = processedFilePath; // Yeni dosya yolu
        existingDocument.fileSize = fileSize;
        existingDocument.documentTypeId = unitId ? 2 : 1;

        await existingDocument.save();

        return res.status(200).json({
          message: "Döküman başarıyla güncellendi ve yazdırma kısıtlaması uygulandı.",
          document: existingDocument,
        });
      });
    } else {
      // Dosya yoksa sadece metadata güncellenir
      existingDocument.name = wordFormatter(name);
      existingDocument.categoryId = categoryId;
      existingDocument.unitId = unitId ? unitId : null;
      existingDocument.documentTypeId = unitId ? 2 : 1;
      existingDocument.workplaceId = workplaceId;

      await existingDocument.save();

      return res.status(200).json({
        message: "Döküman başarıyla güncellendi.",
        document: existingDocument,
      });
    }
  } catch (err) {
    return next(err);
  }
};


export const getDocuments = async (req, res, next) => {
  const { categoryId } = req.query;
  try {
    const whereCondition = categoryId ? { categoryId } : {};
    const documents = await Documents.findAll({
      where: whereCondition,
      include: [
        {
          model: Categories,
          attributes: ['id', 'name']
        }, {
          model: Workplaces,
          attributes: ['id', 'code', 'name']
        },
        {
          model: Units,
          attributes: ['id', 'code', 'name']
        },
        {
          model: DocumentTypes,
          attributes: ['id', 'name']
        },
      ]
    });
    if (!documents || documents.length === 0) {
      throw new CustomError('Hiç döküman bulunamadı', 404, 'not found');
    }
    return res.status(200).json({
      message: 'Dökümanlar başarıyla getirildi.',
      documents: documents
    })
  } catch (err) {
    return next(err);
  }
}

export const sendPdf = async (req, res, next) => {
  try {
    // __dirname ve __filename'yi ES Module'da kullanma
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Dosya yolunu oluştur
    const pdfPath = path.join(__dirname, '../uploads/documents', req.params.filename);

    // PDF dosyasını gönder
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(pdfPath, (err) => {
      if (err) {
        // Hata durumunda error handling
        next(err); // Hata varsa middleware'e gönder
      }
    });
  } catch (error) {
    // Genel hata yakalayıcı
    return next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  const { id } = req.params;
  try {
    const document = await Documents.findByPk(id);

    if (!document) {
      throw new CustomError(
        "Silmek istediğiniz döküman bulunamadı.",
        404,
        "not_found"
      );
    }

    const filePath = document.filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`Silinmek istenen dosya bulunamadı: ${filePath}`);
    }

    await Documents.destroy({ where: { id: id } });

    return res.status(200).json({
      message: "Döküman başarıyla silindi.",
    });
  } catch (err) {
    return next(err);
  }
};
