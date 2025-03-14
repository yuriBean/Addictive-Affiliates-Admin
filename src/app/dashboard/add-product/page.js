"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AddProductForm from "@/app/components/AddProductForm";
import CsvUploadForm from "@/app/components/CsvUploadForm";
import { getUser } from "@/app/firebase/firestoreService";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const { user } = useAuth();
  const [mode, setMode] = useState("manual"); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    
    const fetchUserRole = async () => {
      setLoading(true);
      try {
        const fetchedUser = await getUser(user.uid);
          if (fetchedUser.role === "affiliate") {
            router.push("/dashboard/products");
          }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
  
    fetchUserRole();
  }, [user]);

  if (loading) return <p className="text-black text-center">Loading...</p>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl text-headings font-bold mb-4">ADD PRODUCT</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMode("manual")}
          className={`py-2 px-6 text-lg rounded ${
            mode === "manual" ? "bg-secondary text-white" : "bg-gray-300 text-black"
          }`}
        >
          Add Manually
        </button>

        <button
          onClick={() => setMode("csv")}
          className={`py-2 px-6 text-lg rounded ${
            mode === "csv" ? "bg-secondary text-white" : "bg-gray-300 text-black"
          }`}
        >
          Upload CSV
        </button>
      </div>

      {mode === "manual" ? (
        <AddProductForm />
      ) : (
        <CsvUploadForm />
      )}
    </div>
  );
}
