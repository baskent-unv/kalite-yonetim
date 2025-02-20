import { configDotenv } from "dotenv";
import { Sequelize } from "sequelize";
configDotenv();
export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);

(async () => {
    try {
      await sequelize.authenticate();
      // await sequelize.sync({ alter: true });
      console.log("Veritabanı bağlantısı başarılı");
    } catch (error) {
      console.error("Bağlantı başarısız", error);
    }
  })();