import { successResponse } from "../lib/httpResponse.js";
import userService from "../services/user.service.js";

const getProfile = async (req, res) => {
  const user = await userService.getUserProfile(req.user.userId);
  successResponse(res, "User profile data", user);
};

export { getProfile };
