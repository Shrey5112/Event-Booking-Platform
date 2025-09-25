// src/socket.ts
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SOCKET_URL}/bookings`, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;