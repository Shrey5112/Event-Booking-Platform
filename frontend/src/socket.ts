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

// import { io } from "socket.io-client";
// import { useSelector } from "react-redux";

// import { type RootState } from "../src/redux/store.ts"; // adjust the import path as needed

// const { user } = useSelector((state: RootState) => state.user);

// const socket = io("http://localhost:3000/bookings", {
//   auth: user ?? {}, // ensure auth is always an object
// });

// export default socket;