import { ProjectionType, QueryOptions } from "mongoose";
import { type IBooking, BookingStatus } from "./booking.dto";
import BookingSchema from "./booking.schema";
import * as holidayService from "../calendar/holiday.service";

export const createBooking = async (
  data: Omit<IBooking, "_id" | "createdAt" | "updatedAt">
) => {
  const isSlotAvailable = await checkSlotAvailability(
    data.staffId,
    data.date,
    data.time
  );
  if (!isSlotAvailable) throw new Error("Slot is not available");
  const result = await BookingSchema.create(data);
  return result.toJSON();
};

export const updateBooking = async (id: string, data: Partial<IBooking>) => {
  const result = await BookingSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  }).lean();
  return result;
};

export const getBookingById = async (
  id: string,
  projection?: ProjectionType<IBooking>
) => {
  const result = await BookingSchema.findById(id, projection).lean();
  return result;
};

// booking.service.ts
export const getAllBookings = async (
  filter: Record<string, any>, // <-- new
  projection?: ProjectionType<IBooking>,
  options?: QueryOptions<IBooking>
) => {
  return await BookingSchema.find(filter, projection, options).lean();
};


// booking.service.ts
export const countItems = (filter: Record<string, any>) => {
  return BookingSchema.countDocuments(filter);
};


export const checkSlotAvailability = async (
  staffId: string,
  date: string,
  time: string
) => {
  const existingBooking = await BookingSchema.findOne({
    staffId,
    date,
    time,
    status: { $ne: BookingStatus.CANCELLED },
  });
  const holiday = await holidayService.getHolidaysByDate(date);
  return !existingBooking && !holiday;
};
