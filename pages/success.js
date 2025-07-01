import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { RiCheckboxCircleFill } from "react-icons/ri";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const finalizeOrder = async () => {
      try {
        const res = await fetch("/api/finalize-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Order saved successfully!");
        } else {
          console.error("Failed to save order:", data.error);
        }
      } catch (err) {
        console.error("Error finalizing order:", err);
      }
    };

    if (sessionId) {
      finalizeOrder();
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-center px-4">
      <RiCheckboxCircleFill className="text-blue-600 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Payment Successful!</h1>
      <p className="text-gray-700 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
      <Link href="/User/orders">
        <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow">
          Go to Orders
        </button>
      </Link>
    </div>


 
  );
}
