import { Link } from "react-router-dom";

const PaymentCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-700">❌ Payment Failed / Cancelled</h1>
      <p className="mt-4 text-lg text-gray-700">
        Oops! Something went wrong, or you cancelled the payment.
      </p>
      <Link
        to="/payment"
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
      >
        Try Again
      </Link>
    </div>
  );
};

export default PaymentCancel;
