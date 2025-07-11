import { type BaseSchema } from "../common/dto/base.dto";

export interface IHoliday extends BaseSchema {
  _id: string;
  userId: string;
  date: string;
  reason: string;
}

export interface CreateHolidayDTO {
  dates: string[];
  reason: string;
}
