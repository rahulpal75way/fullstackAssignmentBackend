import mongoose from "mongoose";
import { IHoliday } from "./holiday.dto";


const Schema = mongoose.Schema;

const HolidaySchema = new Schema<IHoliday>(
  {
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    userId: { type: String, required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IHoliday>("holiday", HolidaySchema);
