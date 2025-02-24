import { validationResult } from "express-validator"
import CustomError from "../utils/CustomError.js";
import Title from "../models/titles.js";
import wordFormatter from "../utils/wordFormatter.js";

export const createTitle = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstMessage = errors.array()[0];
        return next(new CustomError(firstMessage.msg, 400, 'validation'));
    }
    const { name } = req.body;
    try {
        const newTitle = await Title.create({
            name: wordFormatter(name)
        })
        return res.status(201).json({
            message: 'Çalışma ünvanı başarıyla oluşturuldu.',
            title: newTitle
        })
    } catch (err) {
        return next(err);
    }
}

export const updateTitle = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstMessage = errors.array()[0];
        return next(new CustomError(firstMessage.msg, '401', 'validation'));
    }
    const { id } = req.params;
    const { name } = req.body;
    try {
        const existingTitle = await Title.findByPk(id);
        if (!existingTitle) {
            throw new CustomError("Çalışma ünvanı bulunamadı", 404, "not found");
        }
        existingTitle.name = wordFormatter(name);
        await existingTitle.save();
        return res.status(200).json({
            messsage: "Çalışma ünvanı başarıyla güncellendi"
        })
    } catch (err) {
        return next(err);
    }
}

export const changeTitleStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    if (status !== 1 && status !== 0) {
        return next(new CustomError("Geçersiz statü değeri girmeye çalışıyorsun. Sadece 1 veya 0 değerli kabul edilir.", 400, "validation"))
    }
    try {
        const existingTitle = await Title.findByPk(id);
        if (!existingTitle) {
            throw new CustomError("Çalışma ünvanı bulunamadı.", 404, "not found");
        }
        existingTitle.status = status;
        await existingTitle.save();
        return res.status(200).json({
            message: "Çalışma ünvanı statüsü başarıyla güncellendi"
        })
    } catch (err) {
        return next(err);
    }
}

export const getTitles = async(req, res, next) => {
    try {
        const titles = await Title.findAll();
        if(!titles || titles.length === 0) {
            throw new CustomError("Hiç çalışma ünvanı bulunamadı", 404, "not found");
        }
        return res.status(200).json({
            message: "Çalışma ünvanları başarıyla getirildi",
            titles: titles
        })
    } catch(err) {
        return next(err);
    }
}