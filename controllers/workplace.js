import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Workplaces from "../models/workplaces.js";
import { Op } from "sequelize";

export const createWorkplace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const firsErrMessage = errors.array()[0];
        return next(new CustomError(firsErrMessage.msg, 400, 'validation'));
    }
    const { name, code } = req.body;
    try {
        const existingWorkplace = await Workplaces.findOne({
            where: {
                [Op.or]: [
                    { name },
                    { code }
                ]
            }
        });
        if (existingWorkplace) {
            throw new CustomError("Bu işyeri ismi veya işyeri koduna sahip bir işyeri zaten mevcut.", 400, 'validation')
        }
        const workplace = await Workplaces.create({
            name,
            code
        });
        return res.status(201).json({
            message: 'İşyeri başarıyla oluşturuldu',
            workplace: workplace
        })
    } catch(err) {
        return next(err);
    }
}

export const updateWorkplace = async (req, res, next) => {

}