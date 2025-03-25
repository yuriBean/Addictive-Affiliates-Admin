"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { editCampaign, getCampaign, getUser } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";

export default function EditCampaign() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const router = useRouter();

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
    userId: user?.uid,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !campaignId) return;

    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const campaignData = await getCampaign(user.uid, campaignId);
        if (campaignData) {
          setFormData({
            ...campaignData,
            ongoing: campaignData.endDate === "", 
          });
        }
      } catch (err) {
        setErrorMessage("Failed to load campaign data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

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
    fetchCampaign();
  }, [user, campaignId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: name === "commissionRate" || name === "pricePerAction" ? Number(value) : value,
      };
  
      if (name === "paymentType" && value !== "ppcv") {
        updatedData.commissionRate = "";
      }
  
      return updatedData;
    });
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
    if (formData.paymentType === "ppcv" && (isNaN(formData.pricePerAction) || formData.pricePerAction <= 0)) {
      return "Price per conversion must be a positive number.";
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
      setErrorMessage("You must be logged in to edit a campaign.");
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
      await editCampaign(user.uid, campaignId, formData);
      alert("Campaign updated successfully!");
      router.push("/dashboard/campaigns");
    } catch (error) {
      setErrorMessage("Failed to update campaign. Please try again.");
      console.error(error);
    }
  };

  const handleToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      ongoing: !prevData.ongoing,
      endDate: !prevData.ongoing ? "" : prevData.endDate, 
    }));
  };

  if (loading) return <p className="text-black text-center">Loading...</p>;

  return (
    <div className="text-black">
      <h1 className="text-2xl md:text-3xl text-headings font-bold my-4">EDIT CAMPAIGN</h1>

      <div className="flex flex-col space-y-6 justify-center">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
          <small>Campaign Name</small>
            <input
              type="text"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
              className="w-full p-4 bg-accent rounded-md"
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
            />
          </div>

          <div>
          <small>Price Per Action</small>
            <input
              type="number"
              name="pricePerAction"
              value={formData.pricePerAction}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Price Per Click/Join"
              required
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

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-secondary text-white py-2 px-6 text-md md:text-xl rounded mt-4"
            >
              {loading ? "Updating..." : "Update Campaign"}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
