import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import EventDetails from "./pages/EventDetails";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import UserBookingsPage from "./pages/UserBookingsPage";
import ThemeProvider from "./components/ThemeProvider";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  // Load Stripe once
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
      <Router>
        <Elements stripe={stripePromise}>
        <Toaster richColors position="bottom-right" />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar /> <Home />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Navbar />
                <Register />
              </>
            }
          />
          <Route
            path="/event/:id"
            element={
              <>
                <Navbar />
                <EventDetails />
              </>
            }
          />
          <Route
            path="/all/booking"
            element={
              <>
                <Navbar />
                <AdminBookingsPage />
              </>
            }
          />
          <Route
            path="/user/booking"
            element={
              <>
                <Navbar />
                <UserBookingsPage />
              </>
            }
          />
          <Route
            path="/event/:id/payment"
            element={
              <>
                <Navbar />
               
      <PaymentPage />
              </>
            }
          />
          <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCancel />} />
        </Routes>
        </Elements>
      </Router>
      </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
