"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { contactUsForm } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import Sidebar from "../components/Sidebar";

export default function ContactPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phoneNo: "",
    message: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setErrorMessage("You must be logged in to submit the form.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await contactUsForm(user.uid, formData);
      alert("Contact form submitted successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        businessName: "",
        email: "",
        phoneNo: "",
        message: "",
      });

      router.push('/dashboard/campaigns');
      
    } catch (error) {
      setErrorMessage("Failed to submit form. Try again.");
      console.error("Error with contact form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
        
    {user && <Sidebar />}
    
    <div className="flex-grow p-8 md:p-12 overflow-auto">
    <div className="text-black">
    {!user && 
    <>
      <div className="flex justify-end items-center space-x-5 text-md md:text-lg">
        <a href="/" className="text-secondary hover:text-black transition-all duration-300">Home</a>
        <button className="bg-secondary p-4 py-2 text-white rounded-md">
          <a href="/login">Login</a>
          </button>
      </div>
    </>}
      <h1 className="text-2xl md:text-3xl text-headings font-bold mt-4">Contact Us</h1>
      <p className="text-md md:text-xl mb-4">Here is some information about us.</p>

      <div className="space-y-2 my-5">
        <h2 className="text-lg md:text-xl font-semibold">Our Phone No.</h2>
        <p className="text-md md:text-xl mb-4">+1 7325038255</p>
      </div>

      <p className="text-md md:text-xl my-4">Or you can email us your queries: admin@addictiveaffiliates.com</p>

      <div className="flex flex-col space-y-6 justify-center">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm md:text-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-y-0 md:gap-4 mb-4">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="First Name"
              required
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Last Name"
              required
            />
          </div>

          <div>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Business Name"
              required
            />
          </div>

          <div>
            <input
              type="text"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Phone No."
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              rows={4}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              required
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-secondary text-white py-2 px-6 text-md md:text-xl rounded mt-4"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>

  );
}
