import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();

  // ✅ Get event details and tickets from Redux store
  const event = useSelector((state: RootState) => state.events.selectedEvent);
  const tickets = useSelector((state: RootState) => state.bookings.tickets);
  const { user } = useSelector((state: RootState) => state.user);
  const totalPrice = event ? event.price * tickets : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    // ✅ Create payment method using Stripe Elements
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: user?.name, // Replace with actual customer info if available
        email: user?.email,
      },
    });

    if (error) {
      console.error(error.message);
      return;
    }

    try {
      // ✅ Send payment request to backend
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/bookings/payment`, {
        amount: totalPrice * 100, // Convert to paise for INR
        currency: "inr",
        paymentMethodId: paymentMethod.id,
        customerName: user?.name, // Replace with actual customer info
        customerEmail: user?.email,
      });

      // ✅ Redirect based on backend response
      if (res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else {
        console.log("Payment Response:", res.data);
      }
    } catch (err: any) {
      console.error("Payment failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-semibold text-center">Payment</h2>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* ✅ Event Details */}
            {event && (
              <div className="p-3 border rounded-md">
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {event.location} • {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="mt-1 text-sm">
                  Tickets: {tickets} × ₹{event.price}
                </p>
                <p className="mt-2 font-semibold text-lg">
                  Total: ₹{totalPrice}
                </p>
              </div>
            )}

            {/* ✅ Card Inputs */}
            <div>
              <Label>Card Number</Label>
              <div className="border rounded-md p-2 mt-1">
                <CardNumberElement />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Expiry Date</Label>
                <div className="border rounded-md p-2 mt-1">
                  <CardExpiryElement />
                </div>
              </div>

              <div className="flex-1">
                <Label>CVC</Label>
                <div className="border rounded-md p-2 mt-1">
                  <CardCvcElement />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button type="submit" className="w-full mt-2">
              Pay ₹{totalPrice}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PaymentPage;
