"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookings = exports.getBookingById = exports.cancelBooking = exports.rescheduleBooking = exports.createBooking = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const response_hepler_1 = require("../common/helper/response.hepler");
const email_service_1 = require("../common/services/email.service");
const bookingService = __importStar(require("./booking.service"));
const userService = __importStar(require("../user/user.service"));
const booking_dto_1 = require("./booking.dto");
exports.createBooking = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, staffId, date, time, title, description } = req.body;
    const user = yield userService.getUserById(userId, {
        email: true,
        name: true,
    });
    if (!user)
        throw (0, http_errors_1.default)(400, { message: "User not found" });
    const staff = yield userService.getUserById(staffId, {
        email: true,
        name: true,
    });
    if (!staff)
        throw (0, http_errors_1.default)(400, { message: "Staff not found" });
    const isSlotAvailable = yield bookingService.checkSlotAvailability(staffId, date, time);
    if (!isSlotAvailable)
        throw (0, http_errors_1.default)(400, { message: "Slot is not available" });
    const booking = yield bookingService.createBooking({
        userId,
        staffId,
        title,
        description,
        date,
        time,
        status: booking_dto_1.BookingStatus.BOOKED,
    });
    yield (0, email_service_1.sendEmail)({
        to: user.email,
        subject: "Booking Confirmation",
        html: `<p>Your appointment with ${staff.name} on ${date} at ${time} has been confirmed.</p>`,
    });
    res.send((0, response_hepler_1.createResponse)(booking, "Booking created successfully"));
}));
exports.rescheduleBooking = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { date, time } = req.body;
    const booking = yield bookingService.getBookingById(id);
    if (!booking)
        throw (0, http_errors_1.default)(404, { message: "Booking not found" });
    const isSlotAvailable = yield bookingService.checkSlotAvailability(booking.staffId, date, time);
    if (!isSlotAvailable)
        throw (0, http_errors_1.default)(400, { message: "Slot is not available" });
    const user = yield userService.getUserById(booking.userId, {
        email: true,
        name: true,
    });
    if (!user)
        throw (0, http_errors_1.default)(400, { message: "User Not Found!" });
    const staff = yield userService.getUserById(booking.staffId, {
        email: true,
        name: true,
    });
    if (!staff)
        throw (0, http_errors_1.default)(400, { message: "Staff Not Found!" });
    const updatedBooking = yield bookingService.updateBooking(id, {
        date,
        time,
        status: booking_dto_1.BookingStatus.RESCHEDULED,
    });
    yield (0, email_service_1.sendEmail)({
        to: user.email,
        subject: "Booking Rescheduled",
        html: `<p>Your appointment with ${staff.name} has been rescheduled to ${date} at ${time}.</p>`,
    });
    res.send((0, response_hepler_1.createResponse)(updatedBooking, "Booking rescheduled successfully"));
}));
exports.cancelBooking = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const booking = yield bookingService.getBookingById(id);
    if (!booking)
        throw (0, http_errors_1.default)(404, { message: "Booking not found" });
    const user = yield userService.getUserById(booking.userId, {
        email: true,
        name: true,
    });
    if (!user)
        throw (0, http_errors_1.default)(400, { message: "User Not Found!" });
    const staff = yield userService.getUserById(booking.staffId, {
        email: true,
        name: true,
    });
    if (!staff)
        throw (0, http_errors_1.default)(400, { message: "Staff Not Found!" });
    const updatedBooking = yield bookingService.updateBooking(id, {
        status: booking_dto_1.BookingStatus.CANCELLED,
    });
    yield (0, email_service_1.sendEmail)({
        to: user.email,
        subject: "Booking Cancelled",
        html: `<p>Your appointment with ${staff.name} on ${booking.date} at ${booking.time} has been cancelled.</p>`,
    });
    res.send((0, response_hepler_1.createResponse)(updatedBooking, "Booking cancelled successfully"));
}));
exports.getBookingById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const booking = yield bookingService.getBookingById(id);
    if (!booking)
        throw (0, http_errors_1.default)(404, { message: "Booking not found" });
    res.send((0, response_hepler_1.createResponse)(booking));
}));
exports.getAllBookings = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = req.query.skip
        ? parseInt(req.query.skip)
        : undefined;
    const limit = req.query.limit
        ? parseInt(req.query.limit)
        : undefined;
    // Define the projection to include title and description
    const projection = {
        title: 1,
        description: 1,
        userId: 1,
        staffId: 1,
        date: 1,
        time: 1,
    }; // Add other fields as needed
    const result = yield bookingService.getAllBookings(projection, {
        skip,
        limit,
    });
    if (skip || limit) {
        const count = yield bookingService.countItems();
        res.send((0, response_hepler_1.createResponse)({ count, bookings: result }));
        return;
    }
    res.send((0, response_hepler_1.createResponse)(result));
}));
