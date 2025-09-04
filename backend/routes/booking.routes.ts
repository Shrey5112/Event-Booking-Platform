import { Router } from "express";
import { createBooking, getUserBookings, cancelBooking, confirmBooking, getAllBookings } from "../controllers/booking.controller";
import { authMiddleware } from "../middleware/auth.middleware"; // ensures user is logged in
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

// Bookings
router.post("/:eventId", authMiddleware, createBooking);        // Create booking
router.get("/user", authMiddleware, getUserBookings);       // Get logged-in user's bookings
router.get("/all", authMiddleware, isAdmin, getAllBookings);   
router.put("/:id/cancel", authMiddleware, cancelBooking); // Cancel booking
router.put("/:id/confirm", authMiddleware, isAdmin, confirmBooking); //Confirm booking

export default router;
