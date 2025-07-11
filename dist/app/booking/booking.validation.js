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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBooking = exports.createBooking = void 0;
const express_validator_1 = require("express-validator");
const userService = __importStar(require("../user/user.service"));
const bookingService = __importStar(require("./booking.service"));
exports.createBooking = (0, express_validator_1.checkExact)([
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string"),
    (0, express_validator_1.body)("description")
        .optional() // Make it optional if you want to allow bookings without a description
        .isString()
        .withMessage("Description must be a string"),
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("User  ID is required")
        .isString()
        .withMessage("User  ID must be a string")
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userService.getUserById(value);
        if (!user)
            throw new Error("User  not found");
        return true;
    })),
    (0, express_validator_1.body)("staffId")
        .notEmpty()
        .withMessage("Staff ID is required")
        .isString()
        .withMessage("Staff ID must be a string")
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userService.getUserById(value);
        if (!user || user.role !== "ADMIN")
            throw new Error("Staff not found");
        return true;
    })),
    (0, express_validator_1.body)("date")
        .notEmpty()
        .withMessage("Date is required")
        .isString()
        .withMessage("Date must be a string")
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Date must be in YYYY-MM-DD format"),
    (0, express_validator_1.body)("time")
        .notEmpty()
        .withMessage("Time is required")
        .isString()
        .withMessage("Time must be a string")
        .matches(/^\d{2}:\d{2}$/)
        .withMessage("Time must be in HH:MM format")
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
        const isAvailable = yield bookingService.checkSlotAvailability(req.body.staffId, req.body.date, value);
        if (!isAvailable)
            throw new Error("Slot is not available");
        return true;
    })),
]);
exports.updateBooking = (0, express_validator_1.checkExact)([
    (0, express_validator_1.body)("date")
        .notEmpty()
        .withMessage("Date is required")
        .isString()
        .withMessage("Date must be a string")
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Date must be in YYYY-MM-DD format"),
    (0, express_validator_1.body)("time")
        .notEmpty()
        .withMessage("Time is required")
        .isString()
        .withMessage("Time must be a string")
        .matches(/^\d{2}:\d{2}$/)
        .withMessage("Time must be in HH:MM format")
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
        if (!req.params || !req.params.id) {
            throw new Error("Booking ID is required");
        }
        const booking = yield bookingService.getBookingById(req.params.id);
        if (!booking)
            throw new Error("Booking not found");
        const isAvailable = yield bookingService.checkSlotAvailability(booking.staffId, req.body.date, value);
        if (!isAvailable)
            throw new Error("Slot is not available");
        return true;
    })),
]);
