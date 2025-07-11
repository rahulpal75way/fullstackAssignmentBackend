import { ProjectionType, QueryOptions } from "mongoose";
import { type IHoliday } from "./holiday.dto";
import HolidaySchema from "./holiday.schema";

export const addHoliday = async ({
  dates,
    reason,
  userId
}: {
  dates: string[];
        reason: string;
        userId: string;
}) => {
  const holidays = dates.map((date) => ({ date, reason, userId }));
  const result = await HolidaySchema.insertMany(holidays);
  return result.map((doc) => doc.toJSON());
};
  

export const removeHoliday = async (id: string) => {
  const result = await HolidaySchema.deleteOne({ _id: id });
  return result;
};

export const getHolidayById = async (
  id: string,
  projection?: ProjectionType<IHoliday>
) => {
  const result = await HolidaySchema.findById(id, projection).lean();
  return result;
};

export const getHolidays = async (
  userId: string,
  projection?: ProjectionType<IHoliday>,
  options?: QueryOptions<IHoliday>
) => {
  const result = await HolidaySchema.find(
    { userId },
    projection,
    options
  ).lean();
  return result;
};

export const getHolidaysByDate = async (date: string) => {
  const result = await HolidaySchema.findOne({ dates: date }).lean();
  return result;
};
