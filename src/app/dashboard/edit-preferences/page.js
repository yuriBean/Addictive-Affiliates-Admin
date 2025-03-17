"use client";
import Preferences from "@/app/components/Preferences";
import { Suspense } from "react";

export default function EditPreferencesPage() {
 
  return (
    <Suspense fallback={<p>Loading...</p>}>
    <div className="text-black">
      <h1 className="text-3xl text-headings font-bold mt-4">Edit Preferences</h1>
      <Preferences />
    </div>
    </Suspense>
  );
}
