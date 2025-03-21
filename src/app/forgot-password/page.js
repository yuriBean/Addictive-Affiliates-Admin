"use client";
import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { forgotPassword } from "../firebase/auth";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (event) => {
    setEmail(event.target.value);
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true)
    try {
      await forgotPassword(email);
      setError("Password reset link sent. Check your email.");
      setEmailSent(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
    console.log("Password reset link sent to:", email); 
  };

  return (
    <AuthLayout width={'max-w-xl'}>
        <Link href="/login" className="text-black mb-5 flex space-x-3 text-sm md:text-lg items-center">
                <FontAwesomeIcon icon={faArrowLeft} />
                <p>Back to Login</p>
        </Link>
            
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">
          Forgot Your Password?
        </h1>
        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 mb-6">
            Don’t worry, happens to all of us. Enter your email below to recover your password
            </p>
            <div>
              <label htmlFor="email" className="block text-sm text-black font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full mt-1 p-2 text-sm md:text-md border border-secondary rounded"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-secondary text-white rounded hover:bg-purple-800"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          {error && <p className="text-red-500">{error}</p>}

          </form>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              We’ve sent a password reset link to your email. Please check your inbox.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2 bg-primary text-white text-sm md:text-lg rounded hover:bg-purple-800"
            >
              Back to Login
            </button>
          </div>
        )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
