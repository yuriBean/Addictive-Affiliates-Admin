"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { editCampaign, getCampaign } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import { Suspense } from "react";

export default function EditCampaign() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const router = useRouter();

  const [formData, setFormData] = useState({
    campaignName: "",
    products: "",
    commissionRate: "",
    description: "",
    startDate: "",
    endDate: "",
    isActive: false,
    ongoing: false,
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

    fetchCampaign();
  }, [user, campaignId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage("You must be logged in to edit a campaign.");
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

  if (loading) return <p>Loading campaign data...</p>;

  return (
    <div className="text-black">
      <h1 className="text-3xl text-headings font-bold my-4">EDIT CAMPAIGN</h1>

      <div className="flex flex-col space-y-6 justify-center">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
            <select
              name="products"
              value={formData.products}
              onChange={handleChange}
              className="w-full p-4 bg-accent rounded-md"
              required
            >
              <option>Select Products</option>
              <option>Product 1</option>
              <option>Product 2</option>
              <option>Product 3</option>
              <option>Product 4</option>
              <option>Product 5</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              name="commissionRate"
              value={formData.commissionRate}
              onChange={handleChange}
              className="w-full p-4 bg-accent rounded-md"
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
              className="w-full p-4 bg-accent rounded-md"
              placeholder="Description"
              required
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Campaign Duration</h2>
            <div className="flex justify-end">
              <FontAwesomeIcon
                icon={formData.ongoing ? faToggleOn : faToggleOff}
                className="cursor-pointer text-4xl text-secondary"
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
              className="w-full p-4 bg-accent rounded-md"
              required
            />
          </div>

          {!formData.ongoing && (
            <div className="flex flex-col space-y-2">
              <label className="text-xs">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-4 bg-accent rounded-md"
                required
              />
            </div>
          )}

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-secondary text-white py-2 px-6 text-xl rounded mt-4"
            >
              {loading ? "Updating..." : "Update Campaign"}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
