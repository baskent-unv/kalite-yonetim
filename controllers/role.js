import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js";
import Roles from "../models/roles.js";
import wordFormatter from "../utils/wordFormatter.js";

export const createRole = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 401, "validation"));
  }
  const { name, description } = req.body;
  try {
    const newRole = await Roles.create({
      name: wordFormatter(name),
      description,
    });
    return res.status(201).json({
      message: "Rol başarıyla oluşturuldu.",
      role: newRole,
    });
  } catch (err) {
    return next(err);
  }
};

export const updateRole = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 401, 'validation'));
  }
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const exsitingRole = await Roles.findByPk(id);
    if (!exsitingRole) {
      throw new CustomError('Rol bulunamadı', 404, 'not found');
    }
    exsitingRole.name = wordFormatter(name);
    exsitingRole.description = description;
    await exsitingRole.save();
    return res.status(200).json({
      message: 'Rol başarıyla güncellendi'
    })
  } catch (err) {
    return next(err);
  }
}

export const changeRoleStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  if (status !== 0 && status !== 1) {
    return next(new CustomError("Geçersiz statü değeri girmeye çakışıyorsun. Sadece 1 veya 0 değerleri kabul edilir.",
      400,
      "validation"))
  }
  try {
    const exsitingRole = await Roles.findByPk(id);
    if (!exsitingRole) {
      throw new CustomError('Rol bulunamadı', 404, 'not found');
    }
    exsitingRole.status = status;
    await exsitingRole.save();
    return res.status(200).json({
      message: 'Rol statüsü başarıyla güncellendi',
    })
  } catch (err) {
    return next(err);
  }
}

export const getRoles = async (req, res, next) => {
  try {
    const roles = await Roles.findAll();
    if (!roles || roles.length === 0) {
      throw new CustomError('Hiç rol bulunamadı.', 404, 'not found');
    }
    return res.status(200).json({
      message: 'Roller başarıyla getirildi.',
      roles
    })
  } catch (err) {
    return next(err);
  }
}
