import { User } from "../models/index.js";
import AppError from "../utils/AppError.js";

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export default {
  getUserProfile,
};
