import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700">✅ Payment Successful!</h1>
      <p className="mt-4 text-lg text-gray-700">
        Thank you! Your payment has been processed successfully.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default PaymentSuccess;
