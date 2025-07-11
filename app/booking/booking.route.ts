import { Router } from "express";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as bookingController from "./booking.controller";
import * as bookingValidator from "./booking.validation";

const router = Router();

router
  .post(
    "/",
    bookingValidator.createBooking,
    roleAuth(["USER"]),
    catchError,
    bookingController.createBooking
  )
  .put(
    "/:id",
    bookingValidator.updateBooking,
    catchError,
    bookingController.rescheduleBooking
  )
  .patch("/:id/cancel", catchError, bookingController.cancelBooking)
  .get("/:id", bookingController.getBookingById)
  .get("/all/:userId", bookingController.getAllBookings);

export default router;
