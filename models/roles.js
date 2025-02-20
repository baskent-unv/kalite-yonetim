import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Roles = sequelize.define("Roles", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }
});

export default Roles;