import { configDotenv } from "dotenv";
import CustomError from "../utils/CustomError.js";
import jwt from "jsonwebtoken"
import User from "../models/users.js";
configDotenv();

export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new CustomError("Token bulunamadı, giriş yapmalısınız.", 401, "authentication");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new CustomError("Kullanıcı bulunamadı", 404, "authentication");
        }

        req.user = {
            id: user.id,
            email: user.email,
            roleId: user.roleId,
            firstname: user.firstname,
            lastname: user.lastname
        }
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(new CustomError("Tokenin süresi dolmuş.", 401, "authentication"))
        } else if (err.name === "JsonWebTokenError") {
            return next(new CustomError("Token geçersiz.", 401, "authentication"))
        }
        next(err);
    }
}