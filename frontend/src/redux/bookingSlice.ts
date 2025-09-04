import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface Booking {
  id: string;
  status: "confirmed" | "pending" | "cancelled"; 
  tickets: number;
  user: { name: string; email: string, role: string };
  event: { title: string; date: string; location: string; price: number, availableTickets: number, thumbnail?: string};
}

interface BookingState {
  bookings: Booking[];
}

const initialState: BookingState = {
  bookings: [],
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
  },
});

export const { setBookings, addBooking, updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
