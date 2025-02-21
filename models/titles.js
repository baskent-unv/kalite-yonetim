import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Title = sequelize.define("Title", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false
    }
})

export default Title;