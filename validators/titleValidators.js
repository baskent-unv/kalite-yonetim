import { body } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Title from "../models/titles.js";

export const titleValidator = [
    body('name').notEmpty().withMessage('Çalışma ünvanı boş olamaz.').trim().custom(async (name) => {
        const existingUnit = await Title.findOne({
            where: {
                name: name.toLowerCase()
            }
        });
        if (existingUnit) {
            throw new CustomError("Bu çalışma ünvanı zaten mevcut", 400, 'validation');
        }
    }),
]