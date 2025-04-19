import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({
    path : './env'
});

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .authenticate()
  .then(() => console.log("🟢 Database connected"))
  .catch((err) => console.error("🔴 DB connection error:", err));
