import AuditLogs from "../models/audit_logs";
import CustomError from "../utils/CustomError"

export const logAudit = async (userId, action, description, ipAddress, userAgent) => {
    try {
        await AuditLogs.create({
            userId,
            action,
            description,
            ipAddress,
            userAgent
        })
    } catch (err) {
        throw new CustomError('İşlem loglanırken hata oluştu');
    }
}