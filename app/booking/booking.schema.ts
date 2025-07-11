import mongoose from "mongoose";
import { BookingStatus, type IBooking } from "./booking.dto";
import * as holidayService from "../calendar/holiday.service";

const Schema = mongoose.Schema;

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: String, required: true },
    staffId: { type: String, required: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.BOOKED,
    },
  },
  { timestamps: true }
);

BookingSchema.pre("save", async function (next) {
  const holiday = await holidayService.getHolidaysByDate(this.date);
  if (holiday) {
    throw new Error("Cannot book on a holiday");
  }
  next();
});

export default mongoose.model<IBooking>("booking", BookingSchema);
