import express from "express";
import userRoutes from "./user/user.route";
import bookingRoutes from "./booking/booking.route";
import holidayRoutes from "./calendar/holiday.routes";

// routes
const router = express.Router();

router.use("/users", userRoutes);
router.use("/booking", bookingRoutes);
router.use("/holiday", holidayRoutes);

export default router;