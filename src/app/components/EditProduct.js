"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons"; 
import { editProduct, getAllUserCampaigns, getProduct, getUser } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";

export default function EditProduct() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId");
  const productId = searchParams.get("productId");
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
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    if (!user || !campaignId || !productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(productId, campaignId);
        if (productData) {
          setFormData((prevData) => ({
            ...prevData,
            ...productData,
          }));
        }
      } catch (err) {
        setErrorMessage("Failed to load product data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCampaigns = async () => {
      try {
        const campaignList = await getAllUserCampaigns(user.uid);
        setCampaigns(campaignList);
      } catch (err) {
        setErrorMessage("Failed to fetch campaigns.");
        console.error(err);
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
    fetchProduct();
  }, [user, campaignId, productId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "assignedCampaign") {
      const selectedCampaign = campaigns.find((c) => c.id === value);
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
      setErrorMessage("You must be logged in to update a product.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await editProduct(campaignId, productId, formData);
      alert("Product updated successfully!");
      router.push("/dashboard/products");
    } catch (error) {
      setErrorMessage("Failed to update product. Try again.");
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-black text-center">Loading...</p>;

  return (
    <div className="text-black">
      <h1 className="text-2xl md:text-3xl text-headings font-bold my-4">EDIT PRODUCT</h1>

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
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            required
          >
            <option value="">Select Category</option>
            <option value="category 1">Category 1</option>
            <option value="category 2">Category 2</option>
            <option value="category 3">Category 3</option>
            <option value="category 4">Category 4</option>
            <option value="category 5">Category 5</option>
          </select>

          <select
            id="assignedCampaign"
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
            id="price"
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
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            placeholder="Description"
            required
          />

          <div className="my-6">
            <h2 className="text-lg font-semibold my-3">Upload Product Images</h2>
            <label className="w-64 h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <FontAwesomeIcon icon={faUpload} className="text-4xl" />
              <p className="text-gray-600 mt-2">Click or drag images here</p>
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              {formData.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded ${index}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-secondary text-white py-2 px-6 text-sm md:text-xl rounded mt-4"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
