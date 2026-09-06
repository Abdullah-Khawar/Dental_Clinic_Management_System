import dns from "dns";
import dotenv from "dotenv";
import pg from "pg";
import { Sequelize } from "sequelize";

dotenv.config();

// Prefer IPv4 so Supabase connections work on networks without IPv6.
dns.setDefaultResultOrder("ipv4first");

const useSsl =
  process.env.DB_SSL === "true" ||
  String(process.env.DB_HOST || "").includes("supabase.co") ||
  String(process.env.DB_HOST || "").includes("pooler.supabase.com");

const commonOptions = {
  dialect: "postgres",
  // Required on Vercel/serverless so Sequelize does not look for optional peer deps.
  dialectModule: pg,
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
