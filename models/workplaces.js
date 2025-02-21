import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Workplaces = sequelize.define("Workplaces", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }
});

export default Workplaces;