import { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { createResponse } from "../common/helper/response.hepler";
import { sendEmail } from "../common/services/email.service";
import * as bookingService from "./booking.service";
import * as userService from "../user/user.service";
import { BookingStatus } from "./booking.dto";

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, staffId, date, time, title, description } = req.body;
    const user = await userService.getUserById(userId, {
      email: true,
      name: true,
    });
    if (!user) throw createHttpError(400, { message: "User not found" });
    const staff = await userService.getUserById(staffId, {
      email: true,
      name: true,
    });
    if (!staff) throw createHttpError(400, { message: "Staff not found" });

    const isSlotAvailable = await bookingService.checkSlotAvailability(
      staffId,
      date,
      time
    );
    if (!isSlotAvailable)
      throw createHttpError(400, { message: "Slot is not available" });

    const booking = await bookingService.createBooking({
      userId,
      staffId,
      title,
      description,
      date,
      time,
      status: BookingStatus.BOOKED,
    });

    await sendEmail({
      to: user.email,
      subject: "Booking Confirmation",
      html: `<p>Your appointment with ${staff.name} on ${date} at ${time} has been confirmed.</p>`,
    });

    // Notify staff
    await sendEmail({
      to: staff.email,
      subject: "New Booking Assigned",
      html: `<p>Dear ${staff.name}, you have a new appointment with ${user.name} on <b>${date}</b> at <b>${time}</b>.</p>`,
    });

    res.send(createResponse(booking, "Booking created successfully"));
  }
);

export const rescheduleBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { date, time, title, description } = req.body;
    const booking = await bookingService.getBookingById(id);
    if (!booking) throw createHttpError(404, { message: "Booking not found" });

    const isSlotAvailable = await bookingService.checkSlotAvailability(
      booking.staffId,
      date,
      time
    );
    if (!isSlotAvailable)
      throw createHttpError(400, { message: "Slot is not available" });

    const user = await userService.getUserById(booking.userId, {
      email: true,
      name: true,
    });
    if (!user) throw createHttpError(400, { message: "User Not Found!" });
    const staff = await userService.getUserById(booking.staffId, {
      email: true,
      name: true,
    });
    if (!staff) throw createHttpError(400, { message: "Staff Not Found!" });

    const updatedBooking = await bookingService.updateBooking(id, {
      date,
      time,
      title,
      description,
      status: BookingStatus.RESCHEDULED,
    });

    await sendEmail({
      to: user.email,
      subject: "Booking Rescheduled",
      html: `<p>Your appointment with ${staff.name} has been rescheduled to ${date} at ${time}.</p>`,
    });

    // Notify staff
    await sendEmail({
      to: staff.email,
      subject: "New Booking Rescheduled",
      html: `<p>Dear ${staff.name}, you have Rescheduled with ${user.name} on <b>${date}</b> at <b>${time}</b>.</p>`,
    });

    res.send(
      createResponse(updatedBooking, "Booking rescheduled successfully")
    );
  }
);

export const cancelBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    if (!booking) throw createHttpError(404, { message: "Booking not found" });

    const user = await userService.getUserById(booking.userId, {
      email: true,
      name: true,
    });
    if (!user) throw createHttpError(400, { message: "User Not Found!" });
    const staff = await userService.getUserById(booking.staffId, {
      email: true,
      name: true,
    });
    if (!staff) throw createHttpError(400, { message: "Staff Not Found!" });

    const updatedBooking = await bookingService.updateBooking(id, {
      status: BookingStatus.CANCELLED,
    });

    await sendEmail({
      to: user.email,
      subject: "Booking Cancelled",
      html: `<p>Your appointment with ${staff.name} on ${booking.date} at ${booking.time} has been cancelled.</p>`,
    });

    // Notify staff
    await sendEmail({
      to: staff.email,
      subject: "Booking Cancelled",
      html: `<p>Dear ${staff.name}, you have Cancelled with ${user.name} on <b>${booking.date}</b> at <b>${booking.time}</b>.</p>`,
    });

    res.send(createResponse(updatedBooking, "Booking cancelled successfully"));
  }
);

export const getBookingById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    if (!booking) throw createHttpError(404, { message: "Booking not found" });
    res.send(createResponse(booking));
  }
);

export const getAllBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;

    const projection = {
      title: 1,
      description: 1,
      userId: 1,
      staffId: 1,
      date: 1,
      time: 1,
      status: 1,
    };

    const filter = {
      $or: [{ userId }, { staffId: userId }],
    };

    const result = await bookingService.getAllBookings(filter, projection, {
      skip,
      limit,
    });

    if (skip || limit) {
      const count = await bookingService.countItems(filter);
      res.send(createResponse({ count, bookings: result })); // ✅ just res.send
      return;
    }

    res.send(createResponse(result)); // ✅ just res.send
  }
);


  
