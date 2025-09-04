import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { authMiddleware } from "../middleware/auth.middleware"; // protects routes
import { isAdmin } from "../middleware/admin.middleware";
import { singleUpload } from "../middleware/multer";

const router = Router();

// Events
router.post("/", authMiddleware, isAdmin, singleUpload, createEvent); // Create new event (protected)
router.get("/", getEvents); // Get all events
router.get("/:id", getEventById); // Get single event by ID
router.put("/:id", authMiddleware, isAdmin, singleUpload, updateEvent); // Update event (protected)
router.delete("/:id", authMiddleware, isAdmin, deleteEvent); // Delete event (protected)

export default router;
