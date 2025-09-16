import type { Request as ExpressRequest, Response } from "express";
import Event from "../models/event.model";
import type { IEvent } from "../models/event.model";
import cloudinary from "../utils/cloudinary"; // ✅ your cloudinary config file
import getDataUri from "../utils/dataUri"; // ✅ helper for file buffer → base64

// Extend Request type to include 'file' property
interface MulterRequest extends ExpressRequest {
  file?: Express.Multer.File;
}
type Request = MulterRequest;

// ✅ Create Event with thumbnail
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, date, location, price, availableTickets } = req.body;
    const userId = (req as any).user.id; // from auth middleware

    let thumbnailUrl = "";

    if (req.file) {
      const fileUri = getDataUri(req.file as any);
      if (fileUri) {
        const uploadRes = await cloudinary.uploader.upload(fileUri, {
          folder: "events", // ✅ keeps your Cloudinary organized
        });
        thumbnailUrl = uploadRes.secure_url;
      }
    }

    const event: IEvent = await Event.create({
      title,
      description,
      date,
      location,
      price,
      availableTickets,
      thumbnail: thumbnailUrl,
      createdBy: userId,
    });

    res.status(201).json({ message: "Event created", event });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Events
export const getEvents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single Event
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.status(200).json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Event (with optional thumbnail upload)
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, date, location, price, availableTickets } = req.body;

    let updateData: Partial<IEvent> = {
      title,
      description,
      date,
      location,
      price,
      availableTickets,
    };

    if (req.file) {
      const fileUri = getDataUri(req.file as any);
      if (fileUri) {
        const uploadRes = await cloudinary.uploader.upload(fileUri, {
          folder: "events",
        });
        updateData.thumbnail = uploadRes.secure_url;
      }
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.status(200).json({ message: "Event updated", event });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.status(200).json({ message: "Event deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
