import express from "express"
import { configDotenv } from "dotenv";
import { sequelize } from "./config/dbConfig.js";
import User from "./models/users.js";
import Units from "./models/units.js";
import Workplaces from "./models/workplaces.js";
import Roles from "./models/roles.js";
import Categories from "./models/categories.js";
import Documents from "./models/documents.js";
import DocumentTypes from "./models/document_types.js";
import Title from "./models/titles.js";
import AuditLogs from "./models/audit_logs.js";
import { errorHandler } from "./middlewares/errorHandler.js";
const PORT = process.env.PORT || 3005;
configDotenv();
const app = express();
app.use(express.json());


app.use(errorHandler);

const syncDb = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("Tüm modeller başarıyla senkronize edildi.");
    } catch (error) {
        console.error("Senkronizasyon hatası:", error);
    }
}

await syncDb();
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`)
});