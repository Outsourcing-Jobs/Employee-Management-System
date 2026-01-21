import express from "express";
import {
  HandleExportSalaryByMonth,
  HandleExportSalaryByEmployee,
  HandleExportSalaryByYear,
  HandleExportAllEmployees,
  HandleExportAllHR,
  ExportFullSystemPDF,
} from "../controllers/Report.controller.js";

import { VerifyhHRToken } from "../middlewares/Auth.middleware.js";
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js";

const router = express.Router();

router.get(
  "/export/month",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleExportSalaryByMonth,
);

router.get(
  "/export/employee",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleExportSalaryByEmployee,
);

router.get(
  "/export/year",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleExportSalaryByYear,
);

router.get(
  "/export/all-employees",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleExportAllEmployees,
);

router.get(
  "/export/all-hr",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleExportAllHR,
);

router.get(
  "/export/full-system-report-pdf",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  ExportFullSystemPDF,
);

export default router;
