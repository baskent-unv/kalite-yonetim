import { body } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Units from "../models/units.js";

export const unitValidator = [
    body('name').notEmpty().withMessage('Birim ismi boş olamaz.').trim().custom(async (name) => {
        const existingUnit = await Units.findOne({
            where: {
                name: name.toLowerCase()
            }
        });
        if (existingUnit) {
            throw new CustomError("Bu birim ismi zaten kullanılıyor", 400, 'validation');
        }
    }),
    body('code').notEmpty().withMessage('Birim kodu boş olamaz.')
        .trim().custom(async (code) => {
            const existingUnit = await Units.findOne({ where: {
                code: code.toLowerCase()
            } });
            if (existingUnit) {
                throw new CustomError("Bu birim kodu zaten kullanılıyor", 400, 'validation');
            }
        }),
    body('workplaceId').notEmpty().withMessage('İşyeri boş bırakılamaz.')
        .isInt({ gt: 0 }).withMessage('Geçerli bir iş yeri seçin.'),
]