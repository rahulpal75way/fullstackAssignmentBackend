import { type BaseSchema } from "../common/dto/base.dto";

export interface IBooking extends BaseSchema {
  _id: string;
  userId: string;
  staffId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  status: BookingStatus;
}

export enum BookingStatus {
  BOOKED = "booked",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled",
}

export interface CreateBookingDTO {
  userId: string;
  staffId: string;
  date: string;
  time: string;
}

export interface UpdateBookingDTO {
  date?: string;
  time?: string;
  status?: BookingStatus;
}
