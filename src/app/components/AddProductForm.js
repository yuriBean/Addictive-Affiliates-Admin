"use client";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { addProduct, getAllUserCampaigns, getUser } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    price: "",
    productUrl: "",
    description: "",
    assignedCampaign: "",
    assignedCampaignName: "",
    userId: user?.uid || "",
    isActive: false,
    images: [],
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const campaignList = await getAllUserCampaigns(user.uid);
        setCampaigns(campaignList);
      } catch (err) {
        setErrorMessage("Failed to fetch campaigns.");
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
    fetchCampaigns();
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "assignedCampaign") {
      const selectedCampaign = campaigns.find((campaign) => campaign.id === value);
      setFormData((prevData) => ({
        ...prevData,
        assignedCampaign: value,
        assignedCampaignName: selectedCampaign ? selectedCampaign.campaignName : "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage("You must be logged in to add a product.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await addProduct(formData.assignedCampaign, formData);
      alert("Product added successfully!");

      setFormData({
        productName: "",
        category: "",
        price: "",
        productUrl: "",
        description: "",
        assignedCampaign: "",
        assignedCampaignName: "",
        userId: user.uid, 
        isActive: false,
        images: [],
      });

      router.push("/dashboard/products");
    } catch (error) {
      setErrorMessage("Failed to add product. Try again.");
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-black text-center">Loading...</p>;

  return (
    <div className="text-black">
      <div className="flex flex-col space-y-6 justify-center">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm md:text-md">
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            placeholder="Product Name"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            required
          >
            <option value="">Select Category</option>
            <option>category 1</option>
            <option>category 2</option>
            <option>category 3</option>
          </select>

          <select
            name="assignedCampaign"
            value={formData.assignedCampaign}
            onChange={handleChange}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            required
          >
            <option value="">Select Campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.campaignName}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            placeholder="Price"
            required
          />

          <input
            type="text"
            name="productUrl"
            value={formData.productUrl}
            onChange={handleChange}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            placeholder="Product URL"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            placeholder="Description"
            required
          />

          <label className="w-64 h-32 md:h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            <FontAwesomeIcon icon={faUpload} className="text-2xl md:text-4xl" />
            <p className="text-gray-600 mt-2">Click or drag images here</p>
          </label>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="flex justify-start">
            <button type="submit" className="bg-secondary text-white py-2 px-6 text-sm md:text-xl rounded mt-4" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
    
      </div>
    </div>
  );
}