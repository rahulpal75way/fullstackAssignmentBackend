import { body, checkExact } from "express-validator";
import * as userService from "../user/user.service";
import * as bookingService from "./booking.service";

export const createBooking = checkExact([
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be a string"),
    body("description")
      .optional() // Make it optional if you want to allow bookings without a description
      .isString()
      .withMessage("Description must be a string"),
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
    body("staffId")
      .notEmpty()
      .withMessage("Staff ID is required")
      .isString()
      .withMessage("Staff ID must be a string")
      .custom(async (value) => {
        const user = await userService.getUserById(value);
        if (!user || user.role !== "ADMIN") throw new Error("Staff not found");
        return true;
      }),
    body("date")
      .notEmpty()
      .withMessage("Date is required")
      .isString()
      .withMessage("Date must be a string")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Date must be in YYYY-MM-DD format"),
    body("time")
      .notEmpty()
      .withMessage("Time is required")
      .isString()
      .withMessage("Time must be a string")
      .matches(/^\d{2}:\d{2}$/)
      .withMessage("Time must be in HH:MM format")
      .custom(async (value, { req }) => {
        const isAvailable = await bookingService.checkSlotAvailability(
          req.body.staffId,
          req.body.date,
          value
        );
        if (!isAvailable) throw new Error("Slot is not available");
        return true;
      }),
  ]);
  

export const updateBooking = checkExact([
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("description")
    .optional() // Make it optional if you want to allow bookings without a description
    .isString()
    .withMessage("Description must be a string"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isString()
    .withMessage("Date must be a string")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("time")
    .notEmpty()
    .withMessage("Time is required")
    .isString()
    .withMessage("Time must be a string")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Time must be in HH:MM format")
    .custom(async (value, { req }) => {
      if (!req.params || !req.params.id) {
        throw new Error("Booking ID is required");
      }
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) throw new Error("Booking not found");
      const isAvailable = await bookingService.checkSlotAvailability(
        booking.staffId,
        req.body.date,
        value
      );
      if (!isAvailable) throw new Error("Slot is not available");
      return true;
    }),
]);
