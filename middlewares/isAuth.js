import { configDotenv } from "dotenv";
import CustomError from "../utils/CustomError";
import jwt from "jsonwebtoken"
import User from "../models/users";
configDotenv();

export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new CustomError("Token bulunamadı", 401, "authentication");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId);

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
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(new CustomError("Tokenin süresi dolmuş.", 401, "authentication"))
        } else if (err.name === "JsonWebTokenError") {
            return next(new CustomError("Token geçersiz.", 401, "authentication"))
        }
    }
}