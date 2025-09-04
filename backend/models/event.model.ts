import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  createdBy: mongoose.Types.ObjectId; // user who created event
  availableTickets: number;
  thumbnail: String,
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    price: {
      type: Number,
      default: 0, // free events possible
    },
    thumbnail: {
      type: String,
      default: "",
    },
    availableTickets: {
      type: Number,
      required: [true, "Number of tickets is required"],
      min: [0, "Available tickets cannot be negative"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>("Event", EventSchema);
