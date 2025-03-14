"use client";
import { useRouter } from "next/navigation";

const PaymentCancel = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-red-600">Payment Failed or Canceled</h1>
            <p className="mt-2 text-gray-600">Your payment was not completed. You can try again.</p>
            <button
                className="mt-4 px-6 py-2 bg-secondary text-white rounded hover:bg-purple-800"
                onClick={() => router.push("/business-payment")}
            >
                Try Again
            </button>
        </div>
    );
};

export default PaymentCancel;
