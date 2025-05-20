import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import User from "./users.js";

const ResetPassword = sequelize.define("Reset_Password", {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    temp_token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}
);

User.hasMany(ResetPassword, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});

ResetPassword.belongsTo(User, {
    foreignKey: 'userId',
});

export default ResetPassword;