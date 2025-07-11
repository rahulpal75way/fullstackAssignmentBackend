"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./user/user.route"));
const booking_route_1 = __importDefault(require("./booking/booking.route"));
const holiday_routes_1 = __importDefault(require("./calendar/holiday.routes"));
// routes
const router = express_1.default.Router();
router.use("/users", user_route_1.default);
router.use("/booking", booking_route_1.default);
router.use("/holiday", holiday_routes_1.default);
exports.default = router;
