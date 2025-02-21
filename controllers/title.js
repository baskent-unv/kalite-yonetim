import { validationResult } from "express-validator"
import CustomError from "../utils/CustomError.js";
import Title from "../models/titles.js";

export const createTitle = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstMessage = errors.array()[0];
        return next(new CustomError(firstMessage.msg, 400, 'validation'));
    }
    const { name } = req.body;
    try {
        const newTitle = await Title.create({
            name
        })
        return res.status(201).json({
            message: 'Çalışma ünvanı başarıyla oluşturuldu.',
            title: newTitle
        })
    } catch (err) {
        return next(err);
    }
}