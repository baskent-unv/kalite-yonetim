import LoginData from "../models/loginData.js";
import Roles from "../models/roles.js";
import Title from "../models/titles.js";
import Units from "../models/units.js";
import User from "../models/users.js";
import Users from "../models/users.js";
import Workplaces from "../models/workplaces.js";
import CustomError from "../utils/CustomError.js";
import { Sequelize } from "sequelize";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
export const getUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const existingUser = await Users.findByPk(id, {
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
                    required: false,
                    attributes: ['id', 'name']
                }
            ]
        });
        if (!existingUser) {
            throw new CustomError('Kullanıcı bulunamadı', 404, 'not found')
        }
        return res.status(200).json({
            message: 'Kullanıcı başarıyla getirildi.',
            user: {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
                firstname: existingUser.firstname,
                lastname: existingUser.lastname,
                ipAddress: existingUser.LoginData && existingUser.LoginData.length > 0 ? existingUser.LoginData[0].ip_address.split(":").pop() : null,
                userAgent: existingUser.LoginData && existingUser.LoginData.length > 0 ? existingUser.LoginData[0].user_agent : null,
                loginDate: existingUser.LoginData && existingUser.LoginData.length > 0 ? existingUser.LoginData[0].login_date : null,
                roleId: existingUser.roleId,
                unit: existingUser.Unit ? existingUser.Unit.name : null,
                unitId: existingUser.Unit ? existingUser.Unit.id : null,
                title: existingUser.Title ? existingUser.Title.name : null,
            },
        })
    } catch (err) {
        return next(err);
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const users = await Users.findAll({
            attributes: { exclude: ['password'] },
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
                    required: false,
                    attributes: ['id', 'name']
                }
            ]
        })
        if (!users || users.length === 0) {
            throw new CustomError('Hiç kullanıcı bulunamadı.', 404, 'not found');
        }
        return res.status(200).json({
            message: 'Kullanıcılar başarıyla getirildi.',
            users: users
        })
    } catch (err) {
        return next(err);
    }
}

export const updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstMessage = errors.array()[0];
        return next(new CustomError(firstMessage.msg, '401', 'validation'));
    }
    const { id } = req.params;
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
        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            throw new CustomError('Kullanıcı bulunamadı', 404, 'not found');
        }
        let hashedPassword = existingUser.password; // Mevcut şifreyi koru
        if (password) {
            hashedPassword = await bcrypt.hash(password, 12);
        }
        existingUser.firstname = firstname || existingUser.firstname;
        existingUser.lastname = lastname || existingUser.lastname;
        existingUser.username = username || existingUser.username;
        existingUser.email = email || existingUser.email;
        existingUser.password = hashedPassword;
        existingUser.workplaceId = workplaceId || existingUser.workplaceId;
        existingUser.unitId = unitId || existingUser.unitId;
        existingUser.titleId = titleId || existingUser.titleId;
        existingUser.roleId = roleId || existingUser.roleId;
        await existingUser.save();
        return res.status(200).json({
            message: "Kullanıcı başarıyla güncellendi."
        })
    } catch (err) {
        return next(err);
    }
}

export const changeUserStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    if (status !== 0 && status !== 1) {
        return next(new CustomError(
            "Geçersiz statü değeri girmeye çakışıyorsun. Sadece 1 veya 0 değerleri kabul edilir.",
            400,
            "validation"
        ))
    }
    try {
        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            throw new CustomError('Kullanıcı bulunamadı', 404, 'not found');
        }
        existingUser.status = status;
        await existingUser.save();
        return res.status(200).json({
            message: 'Kullanıcı statüsü başarıyla değiştirildi.'
        })
    } catch (err) {
        return next(err);
    }
}

export const changeUserApproval = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    if (status !== 0 && status !== 1) {
        return next(new CustomError(
            "Geçersiz statü değeri girmeye çakışıyorsun. Sadece 1 veya 0 değerleri kabul edilir.",
            400,
            "validation"
        ))
    }
    try {
        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            throw new CustomError('Kullanıcı bulunamadı', 404, 'not found');
        }
        existingUser.adminApproval = status;
        existingUser.approvedUser = req.user.id;
        existingUser.approvedDate = new Date();
        await existingUser.save();
        return res.status(200).json({
            message: 'Kullanıcı başarıyla onaylandı.'
        })
    } catch (err) {
        return next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            throw new CustomError(
                "Kullanıcı bulunamadı.",
                404,
                "not found"
            );
        }
        await user.destroy();
        return res.status(200).json({
            message: "Kullanıcı başarıyla silindi",
        });
    } catch (err) {
        if (err instanceof Sequelize.ForeignKeyConstraintError) {
            return next(new CustomError(
                "Bu kullanıcıyı silmeden önce ona bağlı dökümanları silmelisiniz.",
                400,
                "foreign_key_constraint"
            ));
        }
        return next(err);
    }
}

export const changePassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstMessage = errors.array()[0];
        return next(new CustomError(firstMessage.msg, 401, 'validation'));
    }
    const { oldPassword, newPassword, confirmPassword } = req.body;
    try {
        const existingUser = await User.findByPk(req.user.id);
        if (!existingUser || existingUser.length === 0) {
            throw new CustomError('Kullanıcı bulunamadı, lütfen kullanıcı girişi yaparak tekrar deneyin.', 404, 'not found')
        }
        const isEqual = await bcrypt.compare(oldPassword, existingUser.password);
        if (!isEqual) {
            throw new CustomError('Mevcut parolanızı yanlış girdiniz.', 401, 'authenticate')
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        existingUser.password = hashedPassword;
        existingUser.save();
        res.status(200).json({ message: 'Şifreniz başarıyla değiştirildi.' })
    } catch (err) {
        return next(err);
    }
}