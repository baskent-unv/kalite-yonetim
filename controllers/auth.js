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
import Roles from "../models/roles.js";
import { sendMail } from "../services/mailService.js";
import ResetPassword from "../models/resetPassword.js";
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
    roleId,
  } = req.body;
  try {
    let rlId;
    if (roleId) {
      rlId = roleId;
    } else {
      rlId = 1;
    }
    const workplace = await Workplaces.findByPk(workplaceId);
    const unit = await Units.findByPk(unitId);
    const title = await Title.findByPk(titleId);
    const role = await Roles.findByPk(rlId);
    if (!workplace || !unit || !title || !role) {
      throw new CustomError(
        "Geçersiz seçim (Birim, Çalışma Yeri, Çalışma Ünvanı, Kullanıcı rolü)",
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
      rlId
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
      include: [
        {
          model: LoginData,
          required: false,
          attributes: ['ip_address', 'user_agent', 'login_date'],
          order: [['login_date', 'DESC']],
          limit: 1
        },
        {
          model: Workplaces,
          required: false,
          attributes: ['id', 'name', "code"],
        },
        {
          model: Units,
          required: false,
          attributes: ['id', 'name'],
        },
        {
          model: Title,
          required: false,
          attributes: ['id', 'name']
        },
        {
          model: Roles,
          attributes: ['id', 'name']
        }
      ]
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
    if (user.adminApproval == 0) {
      throw new CustomError('Kullanıcının giriş yapabilmesi için sorumlu tarafından onaylanması gerekiyor.', 401, 'authentication')
    }
    if (user.status == 0) {
      throw new CustomError('Kullanıcının hesabı dondurulmuş. Sorumlunu ile iletişime geçebilirsiniz.', 401, 'authentication')
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
        ipAddress: user.LoginData && user.LoginData.length > 0 ? user.LoginData[0].ip_address.split(":").pop() : null,
        userAgent: user.LoginData && user.LoginData.length > 0 ? user.LoginData[0].user_agent : null,
        loginDate: user.LoginData && user.LoginData.length > 0 ? user.LoginData[0].login_date : null,
        roleId: user.roleId,
        unit: user.Unit ? user.Unit.name : null,
        unitId: user.Unit ? user.Unit.id : null,
        title: user.Title ? user.Title.name : null,
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

export const getResetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 400, "validation"));
  }
  const { email } = req.body;
  try {
    const code = Math.floor(Math.random() * (9999 - 1000) + 1000);
    const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 dakika sonrası
    const existingUser = await User.findOne({
      where: {
        email
      }
    })
    if (!existingUser) {
      throw new CustomError('Böyle bir kullanıcı bulunamadı', 404, 'not found');
    }
    // 5 dakika içinde gönderilmiş bir kod var mı?
    const recentCode = await ResetPassword.findOne({
      where: {
        userId: existingUser.id,
        created_at: {
          [Op.gt]: new Date(Date.now() - 5 * 60 * 1000)
        },
        used: false
      },
      order: [['created_at', 'DESC']]
    });

    if (recentCode) {
      throw new CustomError('Yeniden kod göndermek için 5 dakika beklemeniz gerekiyor.', 400, 'authentication');
    }
    await ResetPassword.create({
      userId: existingUser.id,
      code,
      temp_token: crypto.randomUUID(), // Benzersiz geçici token (isteğe bağlı)
      expires_at,
      used: false,
      created_at: new Date(),
      updated_at: new Date()
    });
    await sendMail(email, 'Başkent Üniversitesi Ankara Hastanesi Kalite Kontrol Sistemi', './mailTemplate/reset-password.html', code)
    return res.status(200).json({
      message: 'Şifre sıfırlama kodu başarıyla gönderildi.',
    })
  } catch (err) {
    return next(err)
  }
}

export const verifyResetToken = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 400, "validation"));
  }
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new CustomError('Kullanıcı bulunamadı.', 404, 'not found');
    }
    const resetRecord = await ResetPassword.findOne({
      where: {
        userId: user.id,
        code,
        used: false,
        expires_at: {
          [Op.gt]: new Date()
        }
      },
      order: [['created_at', 'DESC']]
    })
    if (!resetRecord) {
      throw new CustomError('Token geçersiz veya süresi dolmuş', 400, 'invalid_token')
    }
    return res.status(200).json({
      message: 'Kod doğrulandı. Şifrenizi sıfırlayabilirsiniz.',
      temp_token: resetRecord.temp_token
    })
  } catch (err) {
    return next(err);
  }
}

export const getChangePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMessage = errors.array()[0];
    return next(new CustomError(firstMessage.msg, 400, "validation"));
  }
  const { token, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new CustomError('Şifreler uyuşmuyor.', 400, 'validation'));
  }
  try {
    const resetRecord = await ResetPassword.findOne({
      where: {
        temp_token: token,
        used: false,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    })
    if (!resetRecord) {
      throw new CustomError('Token geçersiz veya süresi dolmuş.', 404, 'not found');
    }

    const user = await User.findByPk(resetRecord.userId);
    if (!user) {
      throw new CustomError("Kullanıcı bulunamadı.", 404, "not found");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.update({ password: hashedPassword });
    resetRecord.update({ used: true })
    return res.status(200).json({
      message: "Şifreniz başarıyla güncellendi"
    });
  } catch (err) {
    return next(err);
  }
}