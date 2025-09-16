import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Booking {
  id: string;
  status: "confirmed" | "pending" | "cancelled";
  tickets: number;
  user: { name: string; email: string; role: string };
  event: {
    title: string;
    date: string;
    location: string;
    price: number;
    availableTickets: number;
    thumbnail?: string;
  };
}

interface BookingState {
  bookings: Booking[];
  tickets: number; // added global tickets
}

const initialState: BookingState = {
  bookings: [],
  tickets: 1, // default 1
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBookingStatus: (
      state,
      action: PayloadAction<{ id: string; status: Booking["status"] }>
    ) => {
      const booking = state.bookings.find((b) => b.id === action.payload.id);
      if (booking) {
        booking.status = action.payload.status;
      }
    },
    setTickets: (state, action: PayloadAction<number>) => {
      state.tickets = action.payload;
    },
  },
});

export const { setBookings, addBooking, updateBookingStatus, setTickets } =
  bookingSlice.actions;
export default bookingSlice.reducer;
