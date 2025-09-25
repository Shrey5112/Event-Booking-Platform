import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export interface SocketUser {
  id: string;
  role: "user" | "admin";
}

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  // Optional: namespaces if you want /bookings only
  const nsp = io.of("/bookings");

  nsp.use((socket, next) => {
    try {
      // Support either query token or cookie (from your login cookie)
      // console.log("socket", socket);
      // console.log("nxt", next);
      const token =
        // (socket.handshake.auth?.token as string) ||
        extractTokenFromCookie(socket.handshake.headers.cookie || "");
      // console.log("token", token);

      if (!token) return next(new Error("No auth token"));

      const payload = jwt.verify(token, JWT_SECRET) as {
        id: string;
        role: "user" | "admin";
      };
      (socket as any).user = payload; // attach for later
      // Join a private room per-user
      socket.join(`user:${payload.id}`);
      // Admins can also join an admin room if needed
      if (payload.role === "admin") socket.join("admins");
      next();
    } catch (e) {
      next(new Error("Unauthorized"));
    }
  });

  nsp.on("connection", (socket) => {
    const user = (socket as any).user as SocketUser;
    // Optional hello event
    socket.emit("connected", { ok: true, userId: user.id });
    socket.on("disconnect", () => {
      console.log(`❌ User ${user.id} disconnected`);
    });
  });

  // Helper to emit from controllers
  const emitBookingUpdate = (payload: {
    userId: string; // booking.user
    bookingId: string;
    status: "pending" | "confirmed" | "cancelled";
    eventId: string;
    action: "created" | "updated";
  }) => {
    nsp.to(`user:${payload.userId}`).emit("booking:update", payload);
    nsp.to("admins").emit("booking:adminFeed", payload);
  };

  return { io, nsp, emitBookingUpdate };
};

function extractTokenFromCookie(cookieHeader: string) {
  // cookie header like: "token=eyJ...; other=..."
  // console.log("cookieHeader", cookieHeader);
  const m = cookieHeader
    .split(";")
    .map((s) => s.trim())
    .find((c) => c.startsWith("token="));
  return m ? m.replace("token=", "") : null;
}
