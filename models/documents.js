import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import Categories from "./categories.js";
import Units from "./units.js";
import DocumentTypes from "./document_types.js";

const Documents = sequelize.define("document", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Categories,
            key: 'id'
        },
        allowNull: false
    },
    unitId: {
        type: DataTypes.INTEGER,
        references: {
            model: Units,
            key: 'id'
        },
    },
    documentTypeId: {
        type: DataTypes.INTEGER,
        references: {
            model: DocumentTypes,
            key: "id"
        },
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false
    }
});

Categories.hasMany(Documents, { foreignKey: "categoryId" });
Documents.belongsTo(Categories, { foreignKey: "screenId" });

Units.hasMany(Documents, { foreignKey: "unitId" });
Documents.belongsTo(Units, { foreignKey: "unitId" });

DocumentTypes.hasMany(Documents, { foreignKey: "documentTypeId" });
Documents.belongsTo(DocumentTypes, { foreignKey: "documentTypeId" });

export default Documents;