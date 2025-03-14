"use client";
import { useEffect, useState } from "react";
import { updateUserPassword } from "@/app/firebase/auth";
import { useAuth } from "@/app/context/AuthContext";
import { updateUser, getUser } from "@/app/firebase/firestoreService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTiktok, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import Preferences from "@/app/components/Preferences";

export default function EditPreferencesPage() {
  const { user } = useAuth();
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
  return (
    <div className="text-black">
      <h1 className="text-3xl text-headings font-bold mt-4">Edit Preferences</h1>
      <Preferences />
    </div>
  );
}
