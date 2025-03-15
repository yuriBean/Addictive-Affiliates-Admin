"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { updateBusinessDeposit } from "../firebase/firestoreService";
import axios from "axios";

const PaymentSuccess = () => {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) return;

        const verifyPaymentAndUpdateBalance = async () => {
            try {
                const sessionId = searchParams.get("session_id");
                if (!sessionId) {
                    setError("Invalid session ID.");
                    setLoading(false);
                    return;
                }

                const response = await axios.post("/api/verify-session", { sessionId });
                if (response.data.success) {
                    const amount = response.data.amount; 

                    const success = await updateBusinessDeposit(user.uid, amount);

                    if (success) {
                        setLoading(false);
                        setTimeout(() => {
                            router.push("/dashboard"); 
                        }, 3000);
                    } else {
                        setError("Failed to update balance.");
                    }
                } else {
                    setError(response.data.error || "Payment verification failed.");
                }
            } catch (err) {
                console.error("Payment Success Error:", err);
                setError("An error occurred while processing payment.");
            }
            setLoading(false);
        };

        verifyPaymentAndUpdateBalance();
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {loading ? (
                <h1 className="text-2xl font-bold text-green-600">Processing your payment...</h1>
            ) : error ? (
                <h1 className="text-2xl font-bold text-red-600">{error}</h1>
            ) : (
                <h1 className="text-2xl font-bold text-green-600">Payment Successful! Redirecting...</h1>
            )}
        </div>
    );
};

export default PaymentSuccess;
