import { body, checkExact } from "express-validator";
import * as userService from "../user/user.service";

export const addHoliday = checkExact([
  body("dates")
    .isArray({ min: 1 })
    .withMessage("Dates must be an array with at least one date")
    .custom((value) => {
      for (const date of value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          throw new Error("Each date must be in YYYY-MM-DD format");
        }
      }
      return true;
    }),
  body("reason")
    .notEmpty()
    .withMessage("Reason is required")
    .isString()
        .withMessage("Reason must be a string"),
   body("userId")
        .notEmpty()
        .withMessage("User  ID is required")
        .isString()
        .withMessage("User  ID must be a string")
        .custom(async (value) => {
          const user = await userService.getUserById(value);
          if (!user) throw new Error("User  not found");
          return true;
        }),
]);
  
