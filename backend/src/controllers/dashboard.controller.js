
import dashboardService from "../services/dashboard.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../lib/httpResponse.js";

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard();

  successResponse(
    res,
    "Dashboard data retrieved successfully",
    dashboard
  );
});

export default {
  getDashboard,
};
