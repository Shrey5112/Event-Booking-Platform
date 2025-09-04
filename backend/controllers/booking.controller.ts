import type { Request, Response } from "express";
import Booking from "../models/booking.model";
import type { IBooking } from "../models/booking.model.ts";
import Event from "../models/event.model";

// ✅ Create Booking
export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { tickets } = req.body; // ✅ extract tickets from request
    const userId = (req as any).user.id; // from auth middleware

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (tickets > event.availableTickets) {
      res.status(400).json({ message: "Not enough tickets available" });
      return;
    }

    const booking: IBooking = await Booking.create({
      user: userId,
      event: eventId,
      tickets,
      status: "pending",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("event", "title date location price thumbnail")
      .populate("user", "name email role");

    // 🔥 Emit socket event
    if (global.emitBookingUpdate) {
      global.emitBookingUpdate({
        userId,
        bookingId: booking._id.toString(),
        status: booking.status,
        eventId: eventId,
        action: "created",
      });
    }

    res
      .status(201)
      .json({ message: "Booking created", booking: populatedBooking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get User Bookings (exclude deleted events)
export const getUserBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const bookings = await Booking.find({ user: userId })
      .populate("event", "title date location price availableTickets thumbnail")
      .populate("user", "name email role");

    // ✅ filter out bookings with deleted events
    const result = bookings
      .filter((b) => b.event)
      .map((b) => {
        const eventData = b.event as any;
        return {
          ...b.toObject(),
          totalPrice: b.tickets * (eventData.price ?? 0),
          event: eventData,
        };
      });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Users' Bookings (Admin)
export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookings = await Booking.find()
      .populate("event", "title date location price availableTickets thumbnail")
      .populate("user", "name email role");

    // ✅ filter out bookings with deleted events
    const result = bookings
      .filter((b) => b.event)
      .map((b) => {
        const eventData = b.event as any;
        return {
          ...b.toObject(),
          totalPrice: b.tickets * (eventData.price ?? 0),
          event: eventData,
        };
      });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Cancel Booking
export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    ).populate("event user");

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // 🔥 Emit socket event
    if (global.emitBookingUpdate) {
      global.emitBookingUpdate({
        userId: booking.user?._id?.toString() || booking.user.toString(),
        bookingId: booking._id.toString(),
        status: booking.status,
        eventId: booking.event?._id?.toString() || booking.event.toString(),
        action: "updated",
      });
    }

    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Confirm Booking
export const confirmBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // find booking with event + user populated
    const booking = await Booking.findById(id).populate("event user");
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    if (booking.status === "confirmed") {
      res.status(400).json({ message: "Already confirmed" });
      return;
    }

    const event = await Event.findById(booking.event._id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (event.availableTickets < booking.tickets) {
      res.status(400).json({ message: "Not enough tickets available" });
      return;
    }

    // ✅ reduce available tickets
    event.availableTickets -= booking.tickets;
    await event.save();

    // ✅ update booking status
    booking.status = "confirmed";
    await booking.save();

    // 🔥 Emit socket event
    if (global.emitBookingUpdate) {
      global.emitBookingUpdate({
        userId: booking.user?._id?.toString() || booking.user.toString(),
        bookingId: booking._id.toString(),
        status: booking.status,
        eventId: booking.event._id.toString(),
        action: "updated",
      });
    }

    res.json({ message: "Booking confirmed", booking });
  } catch (error: any) {
    res.status(500).json({ message: "Error confirming booking", error: error.message });
  }
};
