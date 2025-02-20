import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import User from "./users.js";

const AuditLogs = sequelize.define("Audit_Logs", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    ipAddress: {
        type: DataTypes.STRING,
    },
    userAgent: {
        type: DataTypes.TEXT
    }
}, { tableName: "audit_logs" });

AuditLogs.belongsTo(User, { foreignKey: "userId" });

export default AuditLogs;