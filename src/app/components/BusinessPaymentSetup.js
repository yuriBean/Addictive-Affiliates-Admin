"use client";
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const MIN_DEPOSIT = 10; 

const BusinessPaymentSetup = () => {
    const [formData, setFormData] = useState({
        paymentMethod: "",
        depositAmount: MIN_DEPOSIT,
    });

    const { user } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        if (formData.depositAmount < MIN_DEPOSIT) {
            alert(`Minimum deposit is $${MIN_DEPOSIT}`);
            return;
        }

        try {
            const response = await axios.post("/api/create-payment-session", {
                userId: user.uid,
                email: user.email,
                depositAmount: formData.depositAmount,
                paymentMethod: formData.paymentMethod,
            });

            if (response.data?.session?.url) {
                window.location.href = response.data.session.url;
            }
        } catch (error) {
            console.error("Error initiating Stripe payment:", error);
            alert("Payment failed. Please try again.");
        }
    };

    return (
        <AuthLayout width={"max-w-lg"}>
            <h1 className="text-3xl font-bold text-primary mb-4">DEPOSIT FUNDS</h1>
            <hr className="mb-6 border-2 rounded-full border-black" />

            <form onSubmit={handleSubmit} className="text-black">
                <div className="mb-4">
                    <label className="block text-sm font-medium">Pay With:</label>
                    <div className="mt-1 space-x-5">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Card"
                                checked={formData.paymentMethod === "Card"}
                                onChange={handleChange}
                                className="mr-2"
                                required
                            />
                            Card
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Bank"
                                checked={formData.paymentMethod === "Bank"}
                                onChange={handleChange}
                                className="mr-2"
                                required
                            />
                            Bank
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium" htmlFor="depositAmount">
                        Deposit Amount ($)
                    </label>
                    <input
                        type="number"
                        name="depositAmount"
                        id="depositAmount"
                        min={MIN_DEPOSIT}
                        className="w-full mt-1 p-2 border border-black rounded-md bg-transparent"
                        value={formData.depositAmount}
                        onChange={handleChange}
                        required
                    />
                    <small className="text-gray-600">Minimum deposit: ${MIN_DEPOSIT}</small>
                </div>

                <button type="submit" className="w-full py-2 mt-4 bg-secondary text-white rounded hover:bg-purple-800">
                    Proceed to Payment
                </button>
            </form>
        </AuthLayout>
    );
};

export default BusinessPaymentSetup;
