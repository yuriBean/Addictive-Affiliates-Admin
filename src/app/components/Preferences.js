"use client";
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";

const Preferences = ({ onNext }) => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const preferences = [
    "Travel", "Technology", "Health", "Fashion",
    "Music", "Art", "Gaming", "Cooking",
    "Sports", "Finance", "Education", "Nature",
    "Photography", "Fitness", "Food", "Movies",
    "Books", "History", "Science", "Lifestyle",
  ];

  const togglePreference = (preference) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((item) => item !== preference) 
        : [...prev, preference] 
    );
  };

  const handleSubmit = () => {
    console.log("Selected Preferences:", selectedPreferences);
    onNext();
  };

  return (
    // <AuthLayout width={'max-w-screen md:mx-10'}>
      <div className="max-w-4xl mx-auto py-10 px-6">
        {/* <h1 className="text-3xl font-bold text-center text-primary mb-6">
          SET YOUR PREFERENCES
        </h1>
        <p className="text-center mb-6 text-sm text-gray-600">
          Choose your preferences to personalize campaigns and connect with opportunities that align with your interests.
        </p> */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8 max-w-7xl">
          {preferences.map((preference) => (
            <div
              key={preference}
              onClick={() => togglePreference(preference)}
              className={`w-full h-24 border rounded cursor-pointer text-center flex items-center justify-center text-lg font-medium ${
                selectedPreferences.includes(preference)
                  ? "bg-secondary text-white"
                  : "bg-[#DFD9F1B0] text-gray-800"
              } hover:shadow-md`}
            >
              {preference}
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="py-2 px-6 w-full max-w-7xl bg-secondary text-white rounded hover:bg-purple-800"
          >
            Set Preferences
          </button>
        </div>
      </div>
    // </AuthLayout>
  );
};

export default Preferences;
