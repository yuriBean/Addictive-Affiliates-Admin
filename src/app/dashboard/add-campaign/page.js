"use client";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { addCampaign, getStripeAccount, getUser } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AddCampaign() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    campaignName: "",
    commissionRate: "",
    description: "",
    startDate: "",
    endDate: "",
    isActive: false,
    ongoing: false,
    userId: user?.uid,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [stripeAccountId, setStripeAccountId] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchUserRole = async () => {
      setLoading(true);
      try {
        const fetchedUser = await getUser(user?.uid);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "commissionRate" ? Number(value) : value,
    }));
  };

  const handleToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      ongoing: !prevData.ongoing,
      endDate: !prevData.ongoing ? "" : prevData.endDate,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage("You must be logged in to add a campaign.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const campaignId = await addCampaign(user.uid, formData);
      alert("Campaign added successfully!");

      router.push(`/dashboard/campaigns/${campaignId}`);
    } catch (error) {
      setErrorMessage("Failed to add campaign. Try again.");
      console.error("Error adding campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-black text-center">Loading...</p>;

  return (
    <div className="text-black">
      <h1 className="text-2xl md:text-3xl text-headings font-bold my-4">ADD CAMPAIGN</h1>

      <div className="flex flex-col space-y-6 justify-center">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Campaign Name"
              required
            />
          </div>

          <div>
            <input
              type="number"
              name="commissionRate"
              value={formData.commissionRate}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Commission Rate"
              required
            />
          </div>

          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Description"
              required
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Campaign Duration</h2>
            <div className="flex justify-start md:justify-end items-center space-x-3 my-3">
              <p className="text-sm md:text-lg">Ongoing</p>
              <FontAwesomeIcon
                icon={formData.ongoing ? faToggleOn : faToggleOff}
                className="cursor-pointer text-2xl md:text-4xl text-secondary"
                onClick={handleToggle}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              required
            />
          </div>

            <div className="overflow-hidden transition-all duration-300 ease-in-out" 
            style={{ maxHeight: formData.ongoing ? "0px" : "100px", opacity: formData.ongoing ? 0 : 1 }}>       
            <div className="flex flex-col space-y-2">
              <label className="text-xs">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-4 sm:p-6 bg-accent rounded-md"
                required = {!formData.ongoing}
              />
            </div>
            </div>

          <button
            type="submit"
            className="bg-secondary w-full py-2 text-white rounded"
            disabled={loading}
          >
            {loading ? "Adding Campaign..." : "Add Campaign"}
          </button>
          <p className="text-red-500">{errorMessage}</p>
        </form>
      </div>
    </div>
  );
}
