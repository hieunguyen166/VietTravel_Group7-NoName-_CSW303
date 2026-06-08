import express from "express";
import {
    changeBookingStatus, checkAvailabilityOfCar, createBooking,
    getBookedDates,
    getOwnerBookings,
    getUserBookingHistory,
    getUserBookings
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar)
bookingRouter.post('/create', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/owner', protect, getOwnerBookings)
bookingRouter.post('/change-status', protect, changeBookingStatus)
bookingRouter.get('/user-history/:userId', protect, getUserBookingHistory);
bookingRouter.get('/test-dates/:carId', getBookedDates);

export default bookingRouter;