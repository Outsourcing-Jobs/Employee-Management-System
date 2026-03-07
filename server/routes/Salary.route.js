import express from "express";
import {
  HandleCreateSalary,
  HandleAllSalary,
  HandleSalary,
  HandleUpdateSalary,
  HandleDeleteSalary,
  UpdateSalaryStatus,
  HandleGetSalaryByEmployee,
} from "../controllers/Salary.controller.js";
import { VerifyEmployeeToken, VerifyhHRToken } from "../middlewares/Auth.middleware.js";
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js";
const router = express.Router();

router.post(
  "/create-salary",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleCreateSalary,
);

router.get("/by-employee", VerifyEmployeeToken, HandleGetSalaryByEmployee);

router.get(
  "/all",
    VerifyhHRToken,
    RoleAuthorization("HR-Admin"),
  HandleAllSalary,
);

router.get(
  "/:salaryID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleSalary,
);

router.patch(
  "/update-salary",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleUpdateSalary,
);

router.patch(
  "/update-status-salary",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  UpdateSalaryStatus,
);


router.delete(
  "/delete-salary/:salaryID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDeleteSalary,
);

export default router;
