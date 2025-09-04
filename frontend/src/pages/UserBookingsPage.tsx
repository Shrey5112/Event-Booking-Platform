import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@/redux/store";
import { setBookings, updateBookingStatus } from "@/redux/bookingSlice";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import socket from "@/socket";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const UserBookingsPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.bookings.bookings);
  const loading = bookings.length === 0;

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/bookings/user", {
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
    socket.on("booking:update", (payload) => {
      console.log("📩 Booking update payload:", payload);
      console.log("📩 Payload status:", payload.status);
      dispatch(
        updateBookingStatus({
          id: payload.bookingId,
          status: payload.status,
        })
      );

      // console.log("===>", payload);

      if (payload.status === "confirmed") {
        toast.success("✅ Your booking has been confirmed!");
      } else if (payload.status === "cancelled") {
        toast.error("❌ Your booking has been cancelled by admin.");
      } else {
        toast.info("ℹ️ Your booking status has been updated.");
      }
    });

    socket.on("booking:adminFeed", (payload) => {
      toast.info(`📢 New booking created for event ${payload.eventId}`);
      fetchBookings();
    });

    return () => {
      socket.off("booking:update");
      socket.off("booking:adminFeed");
    };
  }, [dispatch]);

  const cancelBooking = async (bookingId: string) => {
  try {
    await axios.put(
      `http://localhost:3000/api/bookings/${bookingId}/cancel`,
      {},
      { withCredentials: true }
    );

    toast.success("❌ Booking cancelled successfully!");

    // Update Redux store immediately
    dispatch(
      updateBookingStatus({
        id: bookingId,
        status: "cancelled",
      })
    );
  } catch (err) {
    console.error("Error cancelling booking", err);
    toast.error("Failed to cancel booking.");
  }
};


  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;

  return (
    <div className="p-6 pt-20 ">
      <h1 className="text-2xl font-bold mb-3">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings available.</p>
      ) : (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {bookings.map((booking) => {
            const totalPrice = booking.tickets * booking.event.price;
            return (
              <Card key={booking.id} className="shadow-md rounded-xl py-1">
                <CardContent className="p-4 flex-col md:flex-row">
                  {booking.event.thumbnail && (
                    <img
                      src={booking.event.thumbnail}
                      alt={booking.event.title}
                      className="w-full h-60 object-cover rounded-lg shadow-sm mb-2"
                    />
                  )}
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold">User:</span>{" "}
                      {booking.user.name} ({booking.user.email})
                    </p>
                    <p>
                      <span className="font-semibold">Role:</span>{" "}
                      {booking.user.role}
                    </p>
                    <p>
                      <span className="font-semibold">Event:</span>{" "}
                      {booking.event.title}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(booking.event.date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {booking.event.location}
                    </p>
                    <p>
                      <span className="font-semibold">Price per Ticket:</span> ₹
                      {booking.event.price}
                    </p>
                    <p>
                      <span className="font-semibold">Available Tickets:</span>{" "}
                      {booking.event.availableTickets}
                    </p>
                    <p>
                      <span className="font-semibold">Tickets:</span>{" "}
                      {booking.tickets}
                    </p>
                    <p>
                      <span className="font-semibold">Total Price:</span> ₹
                      {totalPrice}
                    </p>
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

export default UserBookingsPage;
