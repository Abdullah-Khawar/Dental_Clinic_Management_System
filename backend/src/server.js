import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import ensureAdminExists from "./utils/ensureAdmin.js";
import "./models/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminExists();
 
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    const details = error.errors?.map((item) => item.message).join(", ");
    console.error(
      "Failed to start server:",
      details ? `${error.message}: ${details}` : error.message,
    );
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    process.exit(1);
  }
};

startServer();
