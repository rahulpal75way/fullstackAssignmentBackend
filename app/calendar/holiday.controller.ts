import { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { createResponse } from "../common/helper/response.hepler";
import * as holidayService from "./holiday.service";

export const addHoliday = asyncHandler(async (req: Request, res: Response) => {
  const { dates, reason, userId } = req.body;
  const holidays = await holidayService.addHoliday({ dates, reason, userId });
  res.send(createResponse(holidays, "Holidays added successfully"));
});
  

export const removeHoliday = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const holiday = await holidayService.getHolidayById(id);
    if (!holiday) throw createHttpError(404, { message: "Holiday not found" });
    await holidayService.removeHoliday(id);
    res.send(createResponse(null, "Holiday removed successfully"));
  }
);

export const getHolidays = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await holidayService.getHolidays(userId);
  res.send(createResponse(result));
});
