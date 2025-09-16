import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEvents, addEvent } from "../redux/eventSlice";
import { type RootState } from "../redux/store";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventCard from "@/components/EventCards";
import { Loader } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const { events } = useSelector((state: RootState) => state.events);
  const { user } = useSelector((state: RootState) => state.user);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    availableTickets: "",
  });
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch events
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/events`, {
          withCredentials: true,
        });
        dispatch(setEvents(res.data));
      } catch (error) {
        console.error("Error fetching events", error);
      }
    })();
  }, [dispatch]);

  // ✅ Create Event (Admin Only)
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);
      formData.append("date", newEvent.date);
      formData.append("location", newEvent.location);
      formData.append("price", newEvent.price);
      formData.append("availableTickets", newEvent.availableTickets);
      if (thumbnail) formData.append("file", thumbnail); // ✅ Add thumbnail

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/events`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.event) {
        dispatch(addEvent(res.data.event));
      }

      setNewEvent({
        title: "",
        description: "",
        date: "",
        location: "",
        price: "",
        availableTickets: "",
      });
      setThumbnail(null);
    } catch (error) {
      console.error("Error creating event", error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-10">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">All Events</h1>

        {/* ✅ Show button only if admin */}
        {user?.role === "admin" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create New Event</Button>
            </DialogTrigger>
            <DialogContent className="xl:w-1/4 md:w-1/3 sm:w-1/2">
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  required
                />
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Location"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newEvent.price}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, price: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Available Tickets"
                  value={newEvent.availableTickets}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      availableTickets: e.target.value,
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

                {loading ? (
                    <Button disabled>
                      <Loader className="mr-2 w-4 h-4 animate-spin" /> Please
                      wait
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full">
                  Add Event
                </Button>
                  )}

                
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* ✅ Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Home;
