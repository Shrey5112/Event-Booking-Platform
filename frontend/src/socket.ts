// src/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/bookings", {
  withCredentials: true,
  // auth: (cb) => {
  //   // token is already in cookie (httpOnly), so just pass
  //   cb({}); 
  // },
});

export default socket;