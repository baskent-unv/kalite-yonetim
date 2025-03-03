import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Workplaces from "../models/workplaces.js";
import { Op, Sequelize } from "sequelize";
import wordFormatter from "../utils/wordFormatter.js";
import Units from "../models/units.js";

export const createWorkplace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firsErrMessage = errors.array()[0];
    return next(new CustomError(firsErrMessage.msg, 400, "validation"));
  }
  const { name, code } = req.body;
  try {
    const existingWorkplace = await Workplaces.findOne({
      where: {
        [Op.or]: [{ name: wordFormatter(name) }, { code }],
      },
    });
    if (existingWorkplace) {
      throw new CustomError(
        "Bu işyeri ismi veya işyeri koduna sahip bir işyeri zaten mevcut.",
        400,
        "validation"
      );
    }
    const workplace = await Workplaces.create({
      name: wordFormatter(name),
      code,
    });
    return res.status(201).json({
      message: "Merkez başarıyla oluşturuldu",
      workplace: workplace,
    });
  } catch (err) {
    return next(err);
  }
};

export const updateWorkplace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firsErrMessage = errors.array()[0];
    return next(new CustomError(firsErrMessage.msg, 400, "validation"));
  }
  const { id } = req.params;
  const { name, code } = req.body;
  try {
    const existingWorkplace = await Workplaces.findByPk(id);
    if (!existingWorkplace) {
      throw new CustomError("Merkez bulunamadı", 404, "not found");
    }
    existingWorkplace.name = name;
    existingWorkplace.code = code;
    await existingWorkplace.save();
    return res.status(200).json({
      message: "Merkez başarıyla güncellendi.",
    });
  } catch (err) {
    return next(err);
  }
};

export const changeWorkplaceStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  if (status !== 1 && status !== 0) {
    return next(
      new CustomError(
        "Geçersiz statü değeri girmeye çakışıyorsun. Sadece 1 veya 0 değerleri kabul edilir.",
        400,
        "validation"
      )
    );
  }
  try {
    const existingWorkplace = await Workplaces.findByPk(id);
    if (!existingWorkplace) {
      throw new CustomError("Merkez bulunamadı", 404, "not found");
    }
    existingWorkplace.status = status;
    await existingWorkplace.save();
    return res.status(200).json({
      message: "Merkez statüsü başarıyla güncellendi.",
    });
  } catch (err) {
    return next(err);
  }
};

export const getWorkplaces = async (req, res, next) => {
  try {
    const workplaces = await Workplaces.findAll();
    if (!workplaces || workplaces.length === 0) {
      throw new CustomError("Hiç işyeri bulunamadı.", 404, "not found");
    }
    return res.status(200).json({
      message: "İşyerleri başarıyla getirildi",
      workplaces,
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteWorkplace = async (req, res, next) => {
  const { id } = req.params;

  try {
    const workplace = await Workplaces.findByPk(id);

    if (!workplace) {
      throw new CustomError(
        "Merkez bulunamadı.",
        404,
        "not found"
      );
    }

    await workplace.destroy();

    return res.status(200).json({
      message: "Merkez başarıyla silindi",
    });
  } catch (err) {
    if (err instanceof Sequelize.ForeignKeyConstraintError) {
      return next(new CustomError(
        "Bu işyerini silmeden önce ona bağlı birimleri, kullanıcıları ve dökümanları silmelisiniz.",
        400,
        "foreign_key_constraint"
      ));
    }
    return next(err);
  }
};

