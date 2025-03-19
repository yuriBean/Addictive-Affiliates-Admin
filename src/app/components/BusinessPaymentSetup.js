"use client";
import React, { useEffect, useState } from "react";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../context/AuthContext";
import { saveStripeAccount, getStripeAccount } from "../firebase/firestoreService";
import axios from "axios";

const MIN_DEPOSIT = 10; 

const BusinessPaymentSetup = () => {
    const [formData, setFormData] = useState({
        paymentMethod: "",
        depositAmount: MIN_DEPOSIT,
    });

    const { user } = useAuth();
    const [stripeAccountId, setStripeAccountId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    useEffect(() => {
        const checkStripeAccount = async () => {
            if (!user) return;
            try {
                const accountId = await getStripeAccount(user.uid);
                if (accountId) {
                    setStripeAccountId(accountId);
                }
            } catch (error) {
                console.error("Error fetching Stripe account:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkStripeAccount();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!formData.paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        if (formData.depositAmount < MIN_DEPOSIT) {
            alert(`Minimum deposit is $${MIN_DEPOSIT}`);
            return;
        }

        try {

            let accountId = stripeAccountId;

            if (!accountId) {
                const accountResponse = await axios.post("/api/create-stripe-account", {
                    userId: user.uid,
                    email: user.email,
                });

                accountId = accountResponse.data?.account?.id;
                const onboardingUrl = accountResponse.data?.onboardingUrl;

                if (accountId) {
                    setStripeAccountId(accountId);
                    await saveStripeAccount(user.uid, accountId);
            
                    if (onboardingUrl) {
                        if (typeof window !== "undefined") {
                            window.open(onboardingUrl, "_blank");
                          }
                        return;
                    }
                } else {
                    throw new Error("Failed to create Stripe account.");
                }        
            }

            const onboardingCompleted = await axios.post("/api/check-onboarding-status", {
                accountId
              });
          
              if (!onboardingCompleted.data.success) {
                  alert("Please complete your Stripe onboarding before proceeding.");
                  setIsLoading(false);
                  return;
              }          
            
            const response = await axios.post("/api/create-payment-session", {
                userId: user.uid,
                email: user.email,
                depositAmount: formData.depositAmount,
                paymentMethod: formData.paymentMethod,
                stripeAccountId: accountId,
            });

            if (typeof window !== "undefined" && response.data?.session?.url) {
                window.location.href = response.data.session.url;
              }              
        } catch (error) {
            console.error("Error initiating Stripe payment:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <AuthLayout width={"max-w-lg"}>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">DEPOSIT FUNDS</h1>
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
