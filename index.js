import express from "express";
import { configDotenv } from "dotenv";
import { sequelize } from "./config/dbConfig.js";
import { fileURLToPath } from "url";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoute from "./routes/authRoute.js";
import workplaceRoute from "./routes/workplaceRoute.js";
import unitRoute from "./routes/unitRoute.js";
import titleRoute from "./routes/titleRoute.js";
import roleRoute from "./routes/roleRoute.js";
import documentTypeRoute from "./routes/documentType.js";
import categoryRoute from "./routes/categoryRoute.js";
import documentRoute from "./routes/documentRoute.js";
import userRoute from "./routes/userRoute.js";
import path from "path";
import { isAdmin } from "./middlewares/isAdmin.js";
const PORT = process.env.PORT || 3005;
configDotenv();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoute);
app.use("/api/workplace", workplaceRoute);
app.use("/api/unit", unitRoute);
app.use("/api/title", titleRoute);
app.use("/api/role", roleRoute);
app.use("/api/document-type", documentTypeRoute);
app.use("/api/category", categoryRoute);
app.use("/api/document", documentRoute);
app.use("/api/user", userRoute);

app.use(errorHandler);

const syncDb = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Tüm modeller başarıyla senkronize edildi.");
  } catch (error) {
    console.error("Senkronizasyon hatası:", error);
  }
};

await syncDb();
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
