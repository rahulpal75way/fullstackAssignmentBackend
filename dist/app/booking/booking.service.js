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
exports.checkSlotAvailability = exports.countItems = exports.getAllBookings = exports.getBookingById = exports.updateBooking = exports.createBooking = void 0;
const booking_dto_1 = require("./booking.dto");
const booking_schema_1 = __importDefault(require("./booking.schema"));
const holidayService = __importStar(require("../calendar/holiday.service"));
const createBooking = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isSlotAvailable = yield (0, exports.checkSlotAvailability)(data.staffId, data.date, data.time);
    if (!isSlotAvailable)
        throw new Error("Slot is not available");
    const result = yield booking_schema_1.default.create(data);
    return result.toJSON();
});
exports.createBooking = createBooking;
const updateBooking = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_schema_1.default.findOneAndUpdate({ _id: id }, data, {
        new: true,
    }).lean();
    return result;
});
exports.updateBooking = updateBooking;
const getBookingById = (id, projection) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_schema_1.default.findById(id, projection).lean();
    return result;
});
exports.getBookingById = getBookingById;
const getAllBookings = (projection, options) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_schema_1.default.find({}, projection, options).lean();
    return result;
});
exports.getAllBookings = getAllBookings;
const countItems = () => {
    return booking_schema_1.default.count();
};
exports.countItems = countItems;
const checkSlotAvailability = (staffId, date, time) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBooking = yield booking_schema_1.default.findOne({
        staffId,
        date,
        time,
        status: { $ne: booking_dto_1.BookingStatus.CANCELLED },
    });
    const holiday = yield holidayService.getHolidaysByDate(date);
    return !existingBooking && !holiday;
});
exports.checkSlotAvailability = checkSlotAvailability;
