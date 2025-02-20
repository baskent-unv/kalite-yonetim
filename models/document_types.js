import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const DocumentTypes = sequelize.define("Document_Type", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false
    }
}, { tableName: 'document_type' });

export default DocumentTypes;