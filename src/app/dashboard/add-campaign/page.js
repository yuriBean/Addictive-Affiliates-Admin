"use client";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { addCampaign, getStripeAccount, getUser } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUsersByRole } from "@/app/firebase/adminServices";

export default function AddCampaign() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    campaignName: "",
    commissionRate: "",
    description: "",
    startDate: "",
    endDate: "",
    paymentType: "ppcv",
    pricePerAction:"",
    isActive: false,
    ongoing: false,
    userId: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [businessUsers, setBusinessUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const fetchBusinesses = async () => {
    try{
      setLoading(true);
      const businesses = await getUsersByRole("business");
      console.log(businesses);
      setBusinessUsers(businesses);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

    fetchUserRole();
    checkStripeAccount();
    fetchBusinesses();
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
          setErrorMessage("Please complete your Stripe onboarding before proceeding.");
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
      [name]: name === "commissionRate" || name === "pricePerAction" ? Number(value) : value,
    }));
  };  

  const handleUserSelect = (event) => {
    const selectedUid = event.target.value;
    const user = businessUsers.find(business => business.userId === selectedUid);
    setSelectedUser(user || null);
  };
    
  const handleToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      ongoing: !prevData.ongoing,
      endDate: !prevData.ongoing ? "" : prevData.endDate,
    }));
  };

  const validateForm = () => {
    if (!formData.campaignName.trim()) return "Campaign name is required.";
    if (!formData.description.trim()) return "Description is required.";
    if(formData.paymentType === "ppcv"){
      if (isNaN(formData.commissionRate) || formData.commissionRate < 1 || formData.commissionRate > 100) {
        return "Commission rate must be between 1 and 100.";
      }}
      
    if (formData.paymentType === "ppc" && (isNaN(formData.pricePerAction) || formData.pricePerAction <= 0)) {
      return "Price per click must be a positive number.";
    } 

    if (formData.paymentType === "ppj" && (isNaN(formData.pricePerAction) || formData.pricePerAction <= 0)) {
      return "Price per join must be a positive number.";
    }
  
    if (!formData.startDate) return "Start date is required.";
    if (!formData.ongoing && !formData.endDate) return "End date is required.";
    if (!formData.ongoing && formData.endDate <= formData.startDate) return "End date must be after start date.";
  
    return "";
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage("You must be logged in to add a campaign.");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const campaignData = {
        ...formData,
        pricePerAction: formData.pricePerAction, 
        userId: selectedUser.userId,
      };

      const campaignId = await addCampaign(selectedUser.userId, campaignData);
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
        <small>Assign User</small>
        {businessUsers.length > 0 && (
          <select
            onChange={handleUserSelect}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            required
          >
            <option value="">Select a user</option>
            {businessUsers
            .map((business) => (
              <option key={business.userId} value={business.userId}>
                {business.businessName} ({business.email})
              </option>
            ))}
          </select>
        )}

        {selectedUser && (
          <p className="text-sm mt-2">Selected User: {selectedUser.businessName}</p>
        )}
      </div>


          <div>
          <small>Campaign Name</small>
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
          <small>Payment Type</small>
          <div className="flex md:flex-row flex-col gap-4 my-3">
            <label className="flex items-center">
              <input type="radio" name="paymentType" value="ppc" checked={formData.paymentType === "ppc"} onChange={handleChange} className="mr-2" />
              Pay Per Click
            </label>
            <label className="flex items-center">
              <input type="radio" name="paymentType" value="ppcv" checked={formData.paymentType === "ppcv"} onChange={handleChange} className="mr-2" />
              Pay Per Conversion
            </label>
            <label className="flex items-center">
              <input type="radio" name="paymentType" value="ppj" checked={formData.paymentType === "ppj"} onChange={handleChange} className="mr-2" />
              <div>Pay Per Join <small className=" p-1">(For WhatsApp Group Only)</small></div>
            </label>
          </div>
        </div>

        <div className="overflow-hidden transition-all duration-300 ease-in-out" 
            style={{ maxHeight: formData.paymentType === "ppj" || formData.paymentType === "ppc" ? "0px" : "100px", opacity: formData.paymentType === "ppj" || formData.paymentType === "ppc" ? 0 : 1 }}>       
          <small>Commission Rate</small>
            <input
              type="number"
              name="commissionRate"
              value={formData.paymentType === "ppcv" ? formData.commissionRate : ""}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Commission Rate"
              min={0}
              max={100}
              required = {formData.paymentType === "ppcv"}
              disabled={formData.paymentType === "ppc" || formData.paymentType === "ppj"}
            />
          </div>

          <div className="overflow-hidden transition-all duration-300 ease-in-out" 
            style={{ maxHeight: formData.paymentType === "ppcv" ? "0px" : "100px", opacity: formData.paymentType === "ppcv" ? 0 : 1 }}>       
          <small>Price Per Action</small>
            <input
              type="number"
              name="pricePerAction"
              value={formData.pricePerAction}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Price Per Click/Join"
              required = {formData.paymentType === "ppc" || formData.paymentType === "ppj"}
              disabled={formData.paymentType === "ppcv"}
            />
          </div>

          <div>
          <small>Description</small>
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
