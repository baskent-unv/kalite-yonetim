import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import User from "./users.js";

const LoginData = sequelize.define(
  "LoginData",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    login_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    logout_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "success",
      validate: {
        isIn: [["success", "failure"]],
      },
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "login_data" }
);

LoginData.belongsTo(User, {
  foreignKey: "userId", // userId ile ilişkili
});

User.hasMany(LoginData, {
  foreignKey: "userId",
});

export default LoginData;
