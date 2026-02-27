import express from "express"
import { HandleAttendanceReport, HandleDashboardReport, HandleHRDashboard, HandleStatisticsByYear } from "../controllers/Dashboard.controller.js"
import { VerifyhHRToken } from "../middlewares/Auth.middleware.js"
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"

const router = express.Router()

router.get("/HR-dashboard", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleHRDashboard) 
router.get("/HR-dashboard-report-leave", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDashboardReport) 
router.get(
  "/HR-dashboard-report-attendance",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAttendanceReport
);
router.get(
  "/HR-dashboard-report-recruitment/:year",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleStatisticsByYear
);

export default router