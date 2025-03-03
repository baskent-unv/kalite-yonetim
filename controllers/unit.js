import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Units from "../models/units.js";
import { Op } from "sequelize";
import Workplaces from "../models/workplaces.js";
import wordFormatter from "../utils/wordFormatter.js";

export const unitCreate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstMessage = errors.array()[0];
        return next(new CustomError(firstMessage.msg, 400, 'validation'));
    }
    const { name, code, description, workplaceId } = req.body;
    try {
        const workplace = await Workplaces.findByPk(workplaceId);
        if (!workplace) {
            throw new CustomError('Geçersiz bir işyeri seçimi yapıldı.', 400, 'validation')
        }
        const existingUnit = await Units.findOne({
            where: {
                [Op.or]: [
                    { name: wordFormatter(name) },
                    { code }
                ]
            }
        });
        if (existingUnit) {
            throw new CustomError('Bu birim ismi ve birim koduna sahip bir birim zaten var', 400, 'validation')
        }
        const newUnit = await Units.create({
            name: wordFormatter(name),
            code,
            description,
            workplaceId
        });
        res.status(201).json({
            message: 'Birim başarıyla oluşturuldu',
            unit: newUnit
        })
    } catch (err) {
        next(err);
    }
}

export const updateUnit = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstMessage = errors.array()[0];
        return next(new CustomError(firstMessage.msg, '401', 'validation'));
    }
    const { id } = req.params;
    const { name, code, description, workplaceId } = req.body;
    try {
        const existingUnit = await Units.findByPk(id);
        if (!existingUnit) {
            throw new CustomError('Birim bulunamadı', 404, 'not found');
        }
        existingUnit.name = wordFormatter(name);
        existingUnit.code = code;
        existingUnit.description = description;
        existingUnit.workplaceId = workplaceId;
        await existingUnit.save();
        return res.status(200).json({
            message: "Birim başarıyla güncellendi."
        })
    } catch (err) {
        return next(err);
    }
}

export const changeUnitStatus = async (req, res, next) => {
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
        const existingUnit = await Units.findByPk(id);
        if(!existingUnit) {
            throw new CustomError('Birim bulunamadı', 404, 'not found');
        }
        existingUnit.status = status;
        await existingUnit.save();
        return res.status(200).json({
            message: 'Birimin statüsü başarıyla değiştirildi.'
        })
    } catch(err) {
        return next(err);
    }
}

export const getUnits = async (req, res, next) => {
    try {
        const units = await Units.findAll({
            include: [
                {
                    model: Workplaces,
                    attributes: ['id', 'name']
                }
            ]
        });
        if (!units || units.length === 0) {
            throw new CustomError("Hiç birim bulunamadı", 404, "not found");
        }
        return res.status(200).json({
            message: "Birimler başarıyla getirildi.",
            units
        })
    } catch (err) {
        return next(err);
    }
}

export const deleteUnit = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const unit = await Units.findByPk(id);
  
      if (!unit) {
        throw new CustomError(
          "Birim bulunamadı.",
          404,
          "not found"
        );
      }
  
      await unit.destroy();
  
      return res.status(200).json({
        message: "Birim başarıyla silindi",
      });
    } catch (err) {
      if (err instanceof Sequelize.ForeignKeyConstraintError) {
        return next(new CustomError(
          "Bu birimi silmeden önce ona bağlı kullanıcıları ve dökümanları silmelisiniz.",
          400,
          "foreign_key_constraint"
        ));
      }
      return next(err);
    }
  };
  