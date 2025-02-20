import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import Workplaces from "./workplaces.js";

const Units = sequelize.define("Units", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    workPlaceId: {
        type: DataTypes.INTEGER,
        references: {
            model: Workplaces,
            key: "id"
        },
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false
    }
});

Units.belongsTo(Workplaces, { foreignKey: "workPlaceId" });
Workplaces.hasMany(Units, { foreignKey: "workPlaceId" });

export default Units;