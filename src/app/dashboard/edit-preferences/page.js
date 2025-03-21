"use client";
import Preferences from "@/app/components/Preferences";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function EditPreferencesPage() {

  const router = useRouter();
  const handleEdit = () => {
    router.push('/dashboard/profile');
  }
 
  return (
    <Suspense fallback={<p>Loading...</p>}>
    <div className="text-black">
      <h1 className="text-2xl md:text-3xl text-headings font-bold mt-4">Edit Preferences</h1>
      <div className="bg-accent rounded-xl p-4 my-5">
      <Preferences onEdit = {handleEdit}/>
      </div>
    </div>
    </Suspense>
  );
}
