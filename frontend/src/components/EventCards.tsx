import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeEvent, setEvents } from "../redux/eventSlice";
import { type RootState } from "../redux/store";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const EventCard = ({ event }: { event: any }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { events } = useSelector((state: RootState) => state.events);

  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(event);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  // keep editEvent in sync when dialog opens
  const handleOpen = (value: boolean) => {
    setOpen(value);
    if (value) {
      setEditEvent(event); // refresh event data when opening
      setThumbnail(null); // reset file selection
    }
  };

  // ✅ Delete event
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/events/${event._id}`,
        { withCredentials: true }
      );
      dispatch(removeEvent(event._id));
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  // ✅ Update event (with thumbnail upload)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editEvent.title);
      formData.append("description", editEvent.description);
      formData.append("date", editEvent.date);
      formData.append("location", editEvent.location);
      formData.append("price", String(editEvent.price));
      formData.append("availableTickets", String(editEvent.availableTickets));
      if (thumbnail) formData.append("file", thumbnail);

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/events/${event._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updated = events.map((ev) =>
        ev._id === event._id ? res.data.event : ev
      );

      dispatch(setEvents(updated));
      setOpen(false);
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition gap-3">
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle>{event.title}</CardTitle>
          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()}
          </p>
        </div>

        {user?.role === "admin" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 cursor-pointer">
                <BsThreeDotsVertical />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleOpen(true)}>
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent>
        {/* ✅ Thumbnail Preview */}
        {event.thumbnail && (
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-40 object-cover rounded-md mb-3"
          />
        )} 
        <p className="mb-2">{event.description}</p>
        <p className="font-medium">📍 {event.location}</p>
        <p className="font-semibold text-green-600 mt-2">₹{event.price}</p>
        <p className="text-sm mt-1">
          🎟️ Available Tickets:{" "}
          <span className="font-semibold">{event.availableTickets}</span>
        </p>
        <Link
          to={`/event/${event._id}`}
          className="text-blue-500 hover:underline mt-3 block"
        >
          View Details
        </Link>
      </CardContent>

      {/* ✅ Edit Dialog */}
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-3">
            <Input
              type="text"
              placeholder="Title"
              value={editEvent.title}
              onChange={(e) =>
                setEditEvent({ ...editEvent, title: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Description"
              value={editEvent.description}
              onChange={(e) =>
                setEditEvent({ ...editEvent, description: e.target.value })
              }
              required
            />
            <Input
              type="date"
              value={
                editEvent.date
                  ? new Date(editEvent.date).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEditEvent({ ...editEvent, date: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Location"
              value={editEvent.location}
              onChange={(e) =>
                setEditEvent({ ...editEvent, location: e.target.value })
              }
              required
            />
            <Input
              type="number"
              placeholder="Price"
              value={editEvent.price}
              onChange={(e) =>
                setEditEvent({ ...editEvent, price: Number(e.target.value) })
              }
              required
            />
            <Input
              type="number"
              placeholder="Available Tickets"
              value={editEvent.availableTickets}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  availableTickets: Number(e.target.value),
                })
              }
              required
            />

            {/* ✅ Thumbnail Upload */}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setThumbnail(e.target.files ? e.target.files[0] : null)
              }
            />

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EventCard;
