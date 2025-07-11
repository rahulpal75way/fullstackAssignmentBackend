"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const HolidaySchema = new Schema({
    date: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/,
    },
    userId: { type: String, required: true },
    reason: { type: String, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("holiday", HolidaySchema);
