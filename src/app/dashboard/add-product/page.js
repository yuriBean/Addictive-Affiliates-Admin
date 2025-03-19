"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AddProductForm from "@/app/components/AddProductForm";
import CsvUploadForm from "@/app/components/CsvUploadForm";
import { getStripeAccount, getUser } from "@/app/firebase/firestoreService";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AddProduct() {
  const { user } = useAuth();
  const [mode, setMode] = useState("manual"); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [stripeAccountId, setStripeAccountId] = useState(null);

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
  
    const checkStripeAccount = async () => {
      try {
          const accountId = await getStripeAccount(user?.uid);
          if (accountId) {
              setStripeAccountId(accountId);
          }
      } catch (error) {
          console.error("Error fetching Stripe account:", error);
      } finally {
          setLoading(false);
      }
  };

    fetchUserRole();
    checkStripeAccount();

  }, [user]);

  useEffect (()=>{
    if (!user) return;

    const checkAccount = async () => {
      if (!stripeAccountId) return;
      
      try{
        setLoading(true);
        let accountId = stripeAccountId;
        const onboardingCompleted = await axios.post("/api/check-onboarding-status", {
        accountId
      });
  
      if (!onboardingCompleted.data.success) {
          alert("Please complete your Stripe onboarding before proceeding.");
          setLoading(false);
          return;
      } 
    }
      catch(error) {
        throw error;
      }
      finally {
        setLoading(false)
      }
    }

    checkAccount();

  }, [user, stripeAccountId]);

  if (loading) return <p className="text-black text-center">Loading...</p>;

  return (
    <div className="text-black">
      <h1 className="text-2xl md:text-3xl text-headings font-bold mb-4">ADD PRODUCT</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMode("manual")}
          className={`py-2 px-6 text-sm md:text-lg rounded ${
            mode === "manual" ? "bg-secondary text-white" : "bg-gray-300 text-black"
          }`}
        >
          Add Manually
        </button>

        <button
          onClick={() => setMode("csv")}
          className={`py-2 px-6 text-sm md:text-lg rounded ${
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
