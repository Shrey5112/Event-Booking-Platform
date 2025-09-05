import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { setSelectedEvent } from "@/redux/eventSlice";
import { addBooking } from "@/redux/bookingSlice";

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const event = useSelector((state: RootState) => state.events.selectedEvent);
  const { user } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(1);

  // ✅ Fetch single event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/${id}`, {
          withCredentials: true,
        });
        dispatch(setSelectedEvent(res.data));
      } catch (err) {
        console.error("Error fetching event:", err);
        toast.error("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id, dispatch]);

  if (loading)
    return (
      <p className="text-center text-gray-500">Loading event details...</p>
    );
  if (!event)
    return <p className="text-center text-gray-500">Event not found</p>;

  // ✅ Calculate total price
  const totalPrice = tickets * event.price;

  // 🔥 Create booking
  const handleBooking = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/bookings/${event._id}`,
        { tickets }, // send tickets count
        { withCredentials: true }
      );

      const booking = res.data.booking;

      // ✅ Save booking in Redux (must match bookingSlice shape)
      dispatch(
        addBooking({
          id: booking._id,
          status: booking.status,
          tickets: booking.tickets,
          user: booking.user,
          event: {
            title: booking.event.title,
            date: booking.event.date,
            location: booking.event.location,
            price: booking.event.price,
            availableTickets: booking.event.availableTickets,
            thumbnail: booking.event.thumbnail,
          },
        })
      );

      // console.log(">>", booking);
      // console.log(">>", event);

      toast.success(
        `Booking Created for ${event.title}. Status: ${booking.status}`
      );
      setTickets(1);
    } catch (error: any) {
      console.error("Booking failed", error);

      if (error.response?.status === 401) {
        // 🔑 Not logged in → redirect
        toast.error("Please log in to continue");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create booking"
        );
      }
    }
  };

  return (
    <div className="p-6 pt-16 min-h-screen flex justify-center items-center">
      <Card className="shadow-xl rounded-2xl overflow-hidden w-130 px-6 gap-3 ">
        {/* ✅ Thumbnail */}
        {/* <div className="p"> */}
        {event.thumbnail && (
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-120 h-60 object-cover rounded-md"
          />
        )}
        {/* </div> */}

        <CardContent className="px-6 space-y-2">
          {/* Event Title */}
          <h3 className="text-3xl font-bold">{event.title}</h3>

          {/* Event Details */}
          <p className="">{event.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
              <span className="font-semibold">📅 Date:</span>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">📍 Location:</span>{" "}
              {event.location}
            </p>
            <p>
              <span className="font-semibold">💰 Price per Ticket:</span> ₹
              {event.price}
            </p>
            <p>
              <span className="font-semibold">🎟️ Available Tickets:</span>{" "}
              {event.availableTickets}
            </p>
          </div>

          {/* Tickets Selection */}
          {user?.role === "user" && (
            <div className="mt-2 border-t pt-2">
              <h2 className="text-xl font-semibold mb-4">
                Book Your Tickets 🎟️
              </h2>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={1}
                  max={event.availableTickets}
                  value={tickets}
                  onChange={(e) => setTickets(Number(e.target.value))}
                  className="w-24 p-2 border rounded-lg"
                />
                <p className="text-lg font-semibold text-green-700">
                  💰 Total Price: ₹{totalPrice}
                </p>
              </div>
              <Button
                onClick={handleBooking}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                disabled={
                  tickets > Number(event.availableTickets) || tickets < 1
                }
              >
                Confirm Booking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
