import express from "express";
import type { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import connectDB from "./config/db";
import { initSocket } from "./realtime/socket";

// Route imports
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import bookingRoutes from "./routes/booking.routes";

// Load env variables
dotenv.config();

const app: Application = express();

// Connect DB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// HTTP + Socket.io server
const httpServer = http.createServer(app);

// Initialize socket
const { emitBookingUpdate } = initSocket(httpServer);

declare global {
  // define your property here
  var emitBookingUpdate: (payload: {
    userId: string;
    bookingId: string;
    status: "pending" | "confirmed" | "cancelled";
    eventId: string;
    action: "created" | "updated";
  }) => void;
}

global.emitBookingUpdate = emitBookingUpdate;

// Start Server
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
