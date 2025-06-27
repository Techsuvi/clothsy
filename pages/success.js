// pages/success.js
import Link from "next/link";
import { RiCheckboxCircleFill } from "react-icons/ri";

export default function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-center px-4">
      <RiCheckboxCircleFill className="text-blue-600 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Payment Successful!</h1>
      <p className="text-gray-700 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
      <Link href="/">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow">
          Go to Home
        </button>
      </Link>
    </div>
  );
}
