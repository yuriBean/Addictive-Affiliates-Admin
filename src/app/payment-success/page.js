"use client";
import { Suspense } from "react";
import PaymentSuccess from "../components/PaymentSuccess";

export default function PaymentSuccessPage() {

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <PaymentSuccess />
        </Suspense>
    );
}