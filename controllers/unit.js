import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Units from "../models/units.js";
import { Op } from "sequelize";
import Workplaces from "../models/workplaces.js";

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
                    { name },
                    { code }
                ]
            }
        });
        if (existingUnit) {
            throw new CustomError('Bu birim ismi ve birim koduna sahip bir birim zaten var', 400, 'validation')
        }
        const newUnit = await Units.create({
            name,
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