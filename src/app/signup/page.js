"use client";
import React, { useEffect, useState } from "react";
import SignUpForm from "../components/AffiliateSignupForm";
import ConnectSocial from "../components/ConnectSocial";
import Preferences from "../components/Preferences";
import AuthLayout from "../components/AuthLayout";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const SignUpPage = () => {
  const {user} = useAuth();
  const [step, setStep] = useState(1); 
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);

  useEffect (() => {
    if (user) {
      router.push ("/dashboard");
    }
    setLoading(false);

  }, [user]);

  useEffect(() => {

    if (step === 4) {
      router.push("/dashboard");
    }
  }, [step, router]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }
  
  return (
    <div>
        {step === 1 && <SignUpForm onNext={handleNext} />}
        {step === 2 && <ConnectSocial onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <AuthLayout width={'max-w-screen md:mx-10'}>
        <div className="max-w-4xl mx-auto py-8 px-0 md:px-4 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-6">
          SET YOUR PREFERENCES
        </h1>
        <p className="text-center mb-6 text-sm text-gray-600">
          Choose your preferences to personalize campaigns and connect with opportunities that align with your interests.
        </p>
        <Preferences onBack={handleBack} onNext={handleNext} />
        </div>
        </AuthLayout>}
    </div>
  );
};

export default SignUpPage;
