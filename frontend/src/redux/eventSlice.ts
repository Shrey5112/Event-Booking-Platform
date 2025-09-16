import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string; // ✅ keep as string since it comes from backend JSON
  location: string;
  price: number;
  thumbnail: string,
  availableTickets: number;
}

interface EventState {
  events: any[];   // ✅ always array
  event: any | null;  // ✅ single event
  loading: boolean;
  error: string | null;
  selectedEvent: Event | null;
}

const initialState: EventState = {
  events: [],   // ✅ should be array
  event: null,  // ✅ for single event details
  loading: false,
  error: null,
  selectedEvent: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(
        (event) => event._id !== action.payload
      );
    },
  },
});

export const { setEvents, setSelectedEvent, addEvent, removeEvent } =
  eventSlice.actions;

export default eventSlice.reducer;
