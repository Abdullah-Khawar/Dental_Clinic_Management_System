import { successResponse } from "../lib/httpResponse.js";
import authService from "../services/auth.service.js";

const login = async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  successResponse(res, "Login successful", {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  successResponse(res, "Logged out successfully");
};

export { login, logout };
