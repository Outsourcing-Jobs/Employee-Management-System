import express from "express"
import {
  HandleCreateBaseSalary,
  HandleGetBaseSalaryByEmployee,
  HandleUpdateBaseSalary,
  HandleDeleteBaseSalary,
  HandleGetAllBaseSalaries
} from "../controllers/BaseSalary.controller.js"

import { VerifyhHRToken } from "../middlewares/Auth.middleware.js";
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js";

const router = express.Router()

router.post(
  "/",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleCreateBaseSalary
)

router.get(
  "/base-salary/:employeeID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleGetBaseSalaryByEmployee
)

router.get(
  "/",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleGetAllBaseSalaries
)

router.patch(
  "/update-base-salary/:employeeID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleUpdateBaseSalary
)

router.delete(
  "/delete-base-salary/:employeeID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDeleteBaseSalary
)

export default router
