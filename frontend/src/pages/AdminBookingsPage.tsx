import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@/redux/store";
import { setBookings } from "@/redux/bookingSlice";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import socket from "@/socket";

const AdminBookingsPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.bookings.bookings);
  const loading = bookings.length === 0;

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/bookings/all`, {
        withCredentials: true,
      });

      const normalized = res.data.map((b: any) => ({
        id: b._id,
        status: b.status,
        tickets: b.tickets,
        user: {
          name: b.user?.name || "",
          email: b.user?.email || "",
          role: b.user?.role || "",
        },
        event: {
          title: b.event?.title || "",
          date: b.event?.date || "",
          location: b.event?.location || "",
          price: b.event?.price ?? 0,
          availableTickets: b.event?.availableTickets || "",
          thumbnail: b.event?.thumbnail || "",
        },
      }));

      dispatch(setBookings(normalized.reverse()));
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  useEffect(() => {
    fetchBookings();

    // 🔥 Listen to socket events
    socket.on("booking:update", (payload) => {
      dispatch(
        setBookings(
          bookings.map((b) =>
            b.id === payload.bookingId ? { ...b, status: payload.status } : b
          )
        )
      );
    });

    socket.on("booking:adminFeed", (payload) => {
      toast.info(`New booking created for event ${payload.eventId}`);
      fetchBookings(); // or push into state directly
    });

    return () => {
      socket.off("booking:update");
      socket.off("booking:adminFeed");
    };
  }, [dispatch]);

  const confirmBooking = async (id: string) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/bookings/${id}/confirm`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);
    } catch (err) {
      console.error("Error confirming booking", err);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/bookings/${id}/cancel`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);
    } catch (err) {
      console.error("Error cancelling booking", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;

  return (
    <div className="p-6 pt-20">
      <h1 className="text-2xl font-bold mb-6">📋 Admin: Manage User Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings available.</p>
      ) : (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {bookings.map((booking) => {
            const totalPrice = booking.tickets * booking.event.price;
            return (
              <Card key={booking.id} className="shadow-md rounded-xl py-2">
                <CardContent className="p-4 flex-col md:flex-row md:items-center md:justify-between">
                  {booking.event.thumbnail && (
                    <img
                      src={booking.event.thumbnail}
                      alt={booking.event.title}
                      className="w-full h-60 object-cover rounded-lg shadow-sm mb-2"
                    />
                  )}
                  <div className="space-y-">
                    <p><span className="font-semibold">User:</span> {booking.user.name} ({booking.user.email})</p>
                    <p><span className="font-semibold">Role:</span> {booking.user.role}</p>
                    <p><span className="font-semibold">Event:</span> {booking.event.title}</p>
                    <p><span className="font-semibold">Date:</span> {new Date(booking.event.date).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Location:</span> {booking.event.location}</p>
                    <p><span className="font-semibold">Price per Ticket:</span> ₹{booking.event.price}</p>
                    <p><span className="font-semibold">Available Tickets:</span> {booking.event.availableTickets}</p>
                    <p><span className="font-semibold">Tickets:</span> {booking.tickets}</p>
                    <p><span className="font-semibold">Total Price:</span> ₹{totalPrice}</p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={
                          booking.status === "confirmed"
                            ? "text-green-600 font-bold"
                            : booking.status === "cancelled"
                            ? "text-red-600 font-bold"
                            : "text-yellow-600 font-bold"
                        }
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button
                      onClick={() => confirmBooking(booking.id)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={booking.status !== "pending"}
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => cancelBooking(booking.id)}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={booking.status !== "pending"}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
