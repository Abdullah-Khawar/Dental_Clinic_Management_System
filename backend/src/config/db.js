import dns from "dns";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

dns.setDefaultResultOrder("ipv4first");

const useSsl =
  process.env.DB_SSL === "true" ||
  String(process.env.DB_HOST || "").includes("supabase.co") ||
  String(process.env.DB_HOST || "").includes("pooler.supabase.com");

const commonOptions = {
  dialect: "postgres",
  logging: false,
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, commonOptions)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...commonOptions,
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 5432,
      },
    );

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);
    process.exit(1);
  }
};

export default sequelize;
