// pages/cancel.js
import Link from "next/link";
import { RiErrorWarningFill } from "react-icons/ri";

export default function Cancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <RiErrorWarningFill className="text-red-600 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-red-700 mb-2">Payment Cancelled</h1>
      <p className=" mb-6">You have cancelled the payment. No amount has been deducted.</p>
      <Link href="/checkout">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow">
          Retry Payment
        </button>
      </Link>
    </div>
  );
}
