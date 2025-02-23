import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import Categories from "./categories.js";
import Units from "./units.js";
import DocumentTypes from "./document_types.js";
import Workplaces from "./workplaces.js";

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
    workplaceId: {
        type: DataTypes.INTEGER,
        references: {
            model: Workplaces,
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
        // Döküman tipi kullanıcıdan istenmeyecek, eğer birim seçildiyse arka planda birime özel tip olarak seçilecek aksi halde ise genel tip olarak
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
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false
    }
});

Categories.hasMany(Documents, { foreignKey: "categoryId" });
Documents.belongsTo(Categories, { foreignKey: "categoryId" });

Workplaces.hasMany(Documents, { foreignKey: "workplaceId" });
Documents.belongsTo(Workplaces, { foreignKey: "workplaceId" });

Units.hasMany(Documents, { foreignKey: "unitId" });
Documents.belongsTo(Units, { foreignKey: "unitId" });

DocumentTypes.hasMany(Documents, { foreignKey: "documentTypeId" });
Documents.belongsTo(DocumentTypes, { foreignKey: "documentTypeId" });

export default Documents;