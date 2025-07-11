import { Router } from "express";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as holidayController from "./holiday.controller";
import * as holidayValidator from "./holiday.validation";

const router = Router();

router
  .post(
    "/",
    roleAuth(["ADMIN"]),
    holidayValidator.addHoliday,
    catchError,
    holidayController.addHoliday
  )
  .delete(
    "/:id",
    roleAuth(["ADMIN"]),
    catchError,
    holidayController.removeHoliday
  )
  .get("/:userId", holidayController.getHolidays);

export default router;
