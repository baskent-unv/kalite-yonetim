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
    workplaceId: {
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

Units.belongsTo(Workplaces, { foreignKey: "workplaceId" });
Workplaces.hasMany(Units, { foreignKey: "workplaceId" });

export default Units;