import { body } from "express-validator";
import User from "../models/users.js";
import CustomError from "../utils/CustomError.js";
import Units from "../models/units.js";
import { Op } from "sequelize";
import Title from "../models/titles.js";
import Workplaces from "../models/workplaces.js";

export const registerValidator = (isUpdate = false) => [
  body("firstname").notEmpty().withMessage("İsim boş olamaz."),
  body("lastname").notEmpty().withMessage("Soyisim boş olamaz."),
  body("username")
    .notEmpty()
    .withMessage("Kullanıcı adı boş olamaz.")
    .custom(async (username, { req }) => {
      const id = req.params.id;
      const user = await User.findOne({
        where: {
          username: username,
          ...(isUpdate && id ? { id: { [Op.ne]: id } } : {})
        }
      });
      if (user) {
        throw new CustomError("Bu kullanıcı adı zaten kullanılıyor");
      }
    }),
  body("email")
    .isEmail()
    .withMessage("Geçerli bir e-posta adresi girin.")
    .custom(async (email, { req }) => {
      const id = req.params.id;
      const existingUser = await User.findOne({
        where: {
          email: email,
          ...(isUpdate && id ? { id: { [Op.ne]: id } } : {})
        }
      });
      if (existingUser) {
        throw new CustomError(
          "Bu e-posta adresi zaten kullanılıyor.",
          401,
          "authentication"
        );
      }
    }),
  body("password")
    .if(() => !isUpdate) // Sadece isUpdate false ise kontrol eder
    .notEmpty()
    .withMessage("Şifre boş olamaz"),
  body("workplaceId")
    .notEmpty()
    .withMessage("İşyeri boş bırakılamaz.")
    .isInt({ gt: 0 })
    .withMessage("Geçerli bir iş yeri seçin.")
    .custom(async (workplaceId) => {
      const existingWorkplace = await Workplaces.findByPk(workplaceId);
      if (!existingWorkplace) {
        throw new CustomError(
          "Lütfen geçerli bir işyeri seçin",
          401,
          "validation"
        );
      }
    }),
  body("unitId")
    .notEmpty()
    .withMessage("Birim boş bırakıamaz.")
    .isInt({ gt: 0 })
    .withMessage("Geçerli bir birim seçin.")
    .custom(async (unitId) => {
      const existingUnit = await Units.findByPk(unitId);
      if (!existingUnit) {
        throw new CustomError(
          "Lütfen geçerli bir birim seçin",
          401,
          "validation"
        );
      }
    }),
  body("titleId")
    .notEmpty()
    .withMessage("Çalışma ünvanı boş bırakılamaz.")
    .isInt({ gt: 0 })
    .withMessage("Geçerli bir çalışma ünvanı seçin")
    .custom(async (titleId) => {
      const existingTitle = await Title.findByPk(titleId);
      if (!existingTitle) {
        throw new CustomError(
          "Lütfen geçerli bir çalışma ünvanı seçin",
          401,
          "validation"
        );
      }
    }),
];

export const loginValidator = [
  body("identifier")
    .notEmpty()
    .withMessage("E-posta veya kullanıcı adı bilgisi girilmelidir.")
    .custom((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_]+$/.test(value);
      if (!isEmail && !isUsername) {
        throw new CustomError(
          "Geçerli bir e-posta adresi veya kullanıcı adı girin."
        );
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Parola boş olamaz."),
];

export const resetPasswordValidator = [
  body('oldPassword').notEmpty()
    .withMessage("'Güncel şifre' boş bırakılamaz.")
    .trim(),
  body('newPassword').notEmpty()
    .withMessage("'Yeni şifre' boş bırakılamaz.")
    .trim(),
  body('confirmPassword').notEmpty()
    .withMessage("'Yeni şifre tekrar' boş bırakılamaz.")
    .trim()
];

export const verifyTokenValidator = [
  body('code').notEmpty().withMessage('Doğrulama Kodu boş bırakılamaz.').custom((value) => {
    if (!/^\d{4}$/.test(value)) {
      throw new CustomError("Doğrulama Kodu 4 haneli sayılardan oluşmalı.");
    }
    return true;
  })
];

export const changePasswordValidator = [
  body('token').notEmpty().withMessage("Token bulunamadı.").trim(),
  body('password').notEmpty().withMessage("'Şifre' boş bırakılamaz.").trim(),
  body('confirmPassword').notEmpty().withMessage("'Şifre Tekrar' boş bırakılamaz.")
]
