import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import DocumentTypes from "./document_types.js";

const Categories = sequelize.define("Categories", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    documentTypeId: {
        type: DataTypes.INTEGER,
        references: {
            model: DocumentTypes,
            key: "id"
        },
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false
    }
});

DocumentTypes.hasMany(Categories, { foreignKey: "documentTypeId" });
Categories.belongsTo(DocumentTypes, { foreignKey: "documentTypeId" });

export default Categories;