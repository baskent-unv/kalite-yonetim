import { createTransport } from "nodemailer";
import CustomError from "../utils/CustomError.js";
import fs from "fs"
import path from "path"
import { configDotenv } from "dotenv";
configDotenv();

const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.ADMIN_EMAIL_USER,
        pass: process.env.ADMIN_EMAIL_PASS,
    },
})


export const sendMail = async (mails, subject, html, code) => {
    try {
        let htmlContent = fs.readFileSync(path.resolve(html), 'utf8');
        if (code) {
            htmlContent = htmlContent.replaceAll('{{code}}', code);
        }
        let mailOptions = {
            from: process.env.ADMIN_EMAIL_USER,
            to: mails,
            subject: subject,
            html: htmlContent
        }
        let info = await transporter.sendMail(mailOptions);
        return info;
    } catch(error) {
        throw new CustomError('E-Posta gönderilemedi.', 404, 'not found');
    }
}