import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts"; // protects routes
import { isAdmin } from "../middleware/admin.middleware.ts";
import { singleUpload } from "../middleware/multer.ts";

const router = Router();

// Events
router.post("/", authMiddleware, isAdmin, singleUpload, createEvent); // Create new event (protected)
router.get("/", getEvents); // Get all events
router.get("/:id", getEventById); // Get single event by ID
router.put("/:id", authMiddleware, isAdmin, singleUpload, updateEvent); // Update event (protected)
router.delete("/:id", authMiddleware, isAdmin, deleteEvent); // Delete event (protected)

export default router;
