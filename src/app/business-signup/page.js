"use client";
import React, { useState } from "react";
import BusinessSignUpForm from "../components/BusinessSignUpForm";
import Preferences from "../components/Preferences";
import AuthLayout from "../components/AuthLayout";
import BusinessPaymentSetup from "../components/BusinessPaymentSetup";

const SignUpPage = () => {
  const [step, setStep] = useState(1); 

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);

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
        {step === 3 && <BusinessPaymentSetup onBack={handleBack} />}
    </div>
  );
};

export default SignUpPage;
