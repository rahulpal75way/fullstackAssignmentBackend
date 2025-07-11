"use strict";
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
exports.getHolidaysByDate = exports.getHolidays = exports.getHolidayById = exports.removeHoliday = exports.addHoliday = void 0;
const holiday_schema_1 = __importDefault(require("./holiday.schema"));
const addHoliday = (_a) => __awaiter(void 0, [_a], void 0, function* ({ dates, reason, userId }) {
    const holidays = dates.map((date) => ({ date, reason }));
    const result = yield holiday_schema_1.default.insertMany(holidays);
    return result.map((doc) => doc.toJSON());
});
exports.addHoliday = addHoliday;
const removeHoliday = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield holiday_schema_1.default.deleteOne({ _id: id });
    return result;
});
exports.removeHoliday = removeHoliday;
const getHolidayById = (id, projection) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield holiday_schema_1.default.findById(id, projection).lean();
    return result;
});
exports.getHolidayById = getHolidayById;
const getHolidays = (userId, projection, options) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield holiday_schema_1.default.find({ userId }, projection, options).lean();
    return result;
});
exports.getHolidays = getHolidays;
const getHolidaysByDate = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield holiday_schema_1.default.findOne({ dates: date }).lean();
    return result;
});
exports.getHolidaysByDate = getHolidaysByDate;
