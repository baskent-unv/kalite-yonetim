import { Op } from "sequelize";
import Title from "../models/titles.js";
import Units from "../models/units.js";
import User from "../models/users.js";
import Workplaces from "../models/workplaces.js";
import CustomError from "../utils/CustomError.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import LoginData from "../models/loginData.js";
configDotenv();

export const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErrMessage = errors.array()[0];
    return next(new CustomError(firstErrMessage.msg, 400, "validation"));
  }
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    workplaceId,
    unitId,
    titleId,
  } = req.body;
  try {
    const workplace = await Workplaces.findByPk(workplaceId);
    const unit = await Units.findByPk(unitId);
    const title = await Title.findByPk(titleId);
    if (!workplace || !unit || !title) {
      throw new CustomError(
        "Geçersiz seçim (Birim, Çalışma Yeri, Çalışma Ünvanı)",
        400,
        "validation"
      );
    }
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new CustomError(
        "Bu e-posta veya kullanıcı adına sahip bir kullanıcı zaten kullanılıyor.",
        400,
        "authentication"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
      workplaceId,
      unitId,
      titleId,
    });

    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu.",
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 400, "validation"));
  }
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() },
        ],
      },
    });
    if (!user) {
      throw new CustomError(
        "Bu kullanıcı adı veya e-posta adresi ile ilgili kayıtlı kullanıcı bulunamadı.",
        401,
        "authentication"
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError("Girilen şifre yanlış", 401, "authentication");
    }
    user.loginCount += 1;
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await LoginData.create({
      userId: user.id,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      login_date: new Date(),
      token: token,
      status: "success",
    });

    return res.status(200).json({
      message: "Giriş başarılı",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const loginData = await LoginData.findOne({ where: { token } });
    if (loginData) {
      loginData.logout_date = new Date();
      await loginData.save();
    }
    res.status(200).json({ message: "Başarıylas çıkış yapıldı." });
  } catch (err) {
    next(err);
  }
};
