"use client";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveUserPreferences } from "../firebase/firestoreService";

const Preferences = ({ onNext }) => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const { user } = useAuth();

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

  const handleSubmit = async () => {
    if (!user) return;
    try {
      await saveUserPreferences(user.uid, selectedPreferences);
      onNext();
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } 
  };

  return (
      <div className="max-w-4xl mx-auto py-8 px-0 md:px-4 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-6">
          PRODUCT CATEGORIES
        </h1>
        <p className="text-center mb-6 text-sm text-gray-600">
        Select the categories that best represent the products your business offers to help connect with the right affiliates.        
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {preferences.map((preference) => (
            <div
              key={preference}
              onClick={() => togglePreference(preference)}
              className={`p-4 py-8 md:py-10 border rounded-md cursor-pointer text-center flex items-center justify-center text-sm sm:text-lg font-medium transition-all duration-200 ${
                selectedPreferences.includes(preference)
                  ? "bg-secondary text-white"
                  : "bg-[#DFD9F1B0] text-gray-800"
              } hover:shadow-md`}
            >
              {preference}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="py-2 px-6 w-full max-w-7xl bg-secondary text-white rounded hover:bg-purple-800"
          >
            Set Preferences
          </button>
        </div>
      </div>
  );
};

export default Preferences;
