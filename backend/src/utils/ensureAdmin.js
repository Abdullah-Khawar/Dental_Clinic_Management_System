import bcrypt from "bcryptjs";
import { User } from "../models/index.js";

const ensureAdminExists = async () => {
  const email = process.env.ADMIN_EMAIL || "admin@dental.local";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const name = process.env.ADMIN_NAME || "Clinic Admin";

  const existingAdmin = await User.findOne({ where: { email } });

  if (existingAdmin) {
    console.log(`Admin account ready: ${email}`);
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [admin, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log(
      created
        ? `Admin account created: ${email}`
        : `Admin account ready: ${email}`,
    );

    return admin;
  } catch (error) {
    // If another process created the admin first, reuse it.
    if (error.name === "SequelizeUniqueConstraintError") {
      const admin = await User.findOne({ where: { email } });
      if (admin) {
        console.log(`Admin account ready: ${email}`);
        return admin;
      }
    }

    const details = error.errors?.map((item) => item.message).join(", ");
    error.message = details ? `${error.message}: ${details}` : error.message;
    throw error;
  }
};

export default ensureAdminExists;
