import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import Workplaces from "./workplaces.js";
import Units from "./units.js";
import Title from "./titles.js";
import Roles from "./roles.js";

const User = sequelize.define("User", {
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Roles,
            key: "id"
        },
        allowNull: false,
        defaultValue: 1
    },
    workplaceId: {
        type: DataTypes.INTEGER,
        references: {
            model: Workplaces,
            key: "id"
        },
        allowNull: false
    },
    unitId: {
        type: DataTypes.INTEGER,
        references: {
            model: Units,
            key: "id"
        },
        allowNull: false
    },
    titleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Title,
            key: "id"
        },
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    resetToken: {
        type: DataTypes.STRING,
    },
    resetTokenExpires: {
        type: DataTypes.DATE
    },
    loginCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    lastLogin: {
        type: DataTypes.DATE,
    }
});

Workplaces.hasMany(User, { foreignKey: "workplaceId" });
User.belongsTo(Workplaces, { foreignKey: "workplaceId" });

Units.hasMany(User, { foreignKey: "unitId" });
User.belongsTo(Units, { foreignKey: "unitId" });

Title.hasMany(User, { foreignKey: "titleId" });
User.belongsTo(Title, { foreignKey: "titleId" });

Roles.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Roles, { foreignKey: "roleId" });

export default User;