"use client";
import React, { useEffect, useState } from "react";
import BusinessSignUpForm from "../components/BusinessSignUpForm";
import Preferences from "../components/Preferences";
import AuthLayout from "../components/AuthLayout";
import BusinessPaymentSetup from "../components/BusinessPaymentSetup";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [step, setStep] = useState(1); 
  const router = useRouter();
  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);

  useEffect(() => {
    if (step === 3) {
      router.push("/deposit");
    }
  }, [step, router]);

  return (
    <div>
        {step === 1 && <BusinessSignUpForm onNext={handleNext} />}
        {step === 2 && <AuthLayout width={'max-w-screen md:mx-10'}>
        <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          PRODUCT CATEGORIES
        </h1>
        <p className="text-center mb-6 text-sm text-gray-600">
        Select the categories that best represent the products your business offers to help connect with the right affiliates.        
        </p>
        <Preferences onBack={handleBack} onNext={handleNext} />
        </div>
        </AuthLayout>}
    </div>
  );
};

export default SignUpPage;
