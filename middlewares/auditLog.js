import { logAudit } from "../services/auditLogService.js";



// Her istek için otomatik log kaydı yapacak middleware
const auditLog = async (req, res, next) => {
    const userId = req.user ? req.user.id : null;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const action = req.method;
    const description = `"${action}" işlemi için ${req.originalUrl} adresine istek gönderildi`;

    if (userId) {
        await logAudit(userId, action, description, ipAddress, userAgent);
    }
    console.log(ipAddress,userAgent, 'ip');
    next();
};

export default auditLog;
