"use client";
import React, { useEffect, useState } from "react";
import BusinessSignUpForm from "../components/BusinessSignUpForm";
import Preferences from "../components/Preferences";
import AuthLayout from "../components/AuthLayout";
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
        <Preferences onBack={handleBack} onNext={handleNext} />
        </AuthLayout>}
    </div>
  );
};

export default SignUpPage;
