import express from "express";
import 'dotenv/config'
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

app.use("/kalite", express.static(path.join(__dirname, '../client')));
app.get("/kalite/*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const syncDb = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Tüm modeller başarıyla senkronize edildi.");
  } catch (error) {
    console.error("Senkronizasyon hatası:", error);
  }
};

const createUserAdmin = async () => {
  const password = 'kalite2025';
  const firstname = 'Admin';
  const lastname = 'Admin';
  const email = '-';
  const username = 'admin';
  const workplaceId = 1;
  const unitId = 1;
  const titleId = 1;
  const roleId = 1;
  try {
    const adminUser = await User.findOne({ where: { username: username } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

      const newUser = await User.create({
        firstname,
        lastname,
        email,
        username,
        password: hashedPassword,
        workplaceId,
        unitId,
        titleId,
        roleId
      });

      console.log('Default admin kullanıcı oluşturuldu.');
    } else {
      console.log('Default admin kullanıcı zaten mevcut.');
    }
  } catch (err) {
    console.error('Default admin oluşturulurken hata:', err);
  }
}

await syncDb();
await createUserAdmin();
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
