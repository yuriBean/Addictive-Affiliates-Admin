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
    paymentType: "ppcv",
    price: "",
    pricePerAction: "",
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
  const categories = [
    "Travel", "Technology", "Health", "Fashion",
    "Music", "Art", "Gaming", "Cooking",
    "Sports", "Finance", "Education", "Nature",
    "Photography", "Fitness", "Food", "Movies",
    "Books", "History", "Science", "Lifestyle",
    "Other",
  ];

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
      const selectedCampaign = campaigns.find((campaign) => campaign.id === value);
  
      setFormData((prevData) => ({
        ...prevData,
        assignedCampaign: value,
        assignedCampaignName: selectedCampaign ? selectedCampaign.campaignName : "",
        pricePerAction: selectedCampaign ? selectedCampaign.pricePerAction : "", 
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

  const validateForm = () => {
    if (!formData.productName.trim()) return setErrorMessage("Product name is required.");
    if (!formData.category) return setErrorMessage("Category is required.");
    if (!formData.assignedCampaign) return setErrorMessage("Campaign selection is required.");
    if (!formData.productUrl.trim()) return setErrorMessage("Product URL is required.");
    if (!formData.description.trim()) return setErrorMessage("Description is required.");
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) return setErrorMessage("Price must be a positive number.");

    if (formData.paymentType === "ppj" && !formData.productUrl.startsWith("https://chat.whatsapp.com/")) {
      return setErrorMessage("For Pay Per Join campaigns, the Product URL must be a WhatsApp group join link.");
    }
  
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage("You must be logged in to update a product.");
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
      await editProduct(campaignId, productId, formData);
      setFormData({
        productName: "",
        category: "",
        paymentType: "ppcv",
        price: "",
        pricePerAction: "",
        productUrl: "",
        description: "",
        assignedCampaign: "",
        assignedCampaignName: "",
        userId: user.uid, 
        isActive: false,
        images: [],
      });
      alert("Product updated successfully!");
      router.push("/dashboard/products");
    } catch (error) {
      setErrorMessage("Failed to update product. Try again.");
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/products");
  }

  if (loading) return <p className="text-black text-center">Loading...</p>;

  return (
    <div className="text-black">
      <h1 className="text-2xl md:text-3xl text-headings font-bold my-4">EDIT PRODUCT</h1>

      <div className="flex flex-col space-y-6 justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm md:text-md">
      <div>
        <small>Product Name</small>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            placeholder="Product Name"
            required
          />
        </div>

      <div>
        <small>Category</small>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
            ))}
          </select>
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
        
        <div>
        <small>Campaign</small>
        <select
            name="assignedCampaign"
            value={formData.assignedCampaign}
            onChange={handleChange}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            required
          >
            <option value="">Select Campaign</option>
            {campaigns
            .filter((campaign) => campaign.paymentType === formData.paymentType)
            .map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.campaignName} -- Pay Per Action: ${campaign.pricePerAction}
              </option>
            ))}
          </select>
            </div>

            <div className="overflow-hidden transition-all duration-300 ease-in-out" 
            style={{ maxHeight: formData.paymentType === "ppj" ? "0px" : "100px", opacity: formData.paymentType === "ppj" ? 0 : 1 }}>       
          <small>Price</small>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Price"
              required = {formData.paymentType === "ppcv" || formData.paymentType === "ppc"}
            />
          </div>

        <div>
        <small>Product URL</small>
          <input
            type="text"
            name="productUrl"
            value={formData.productUrl}
            onChange={handleChange}
            className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
            placeholder="Product URL"
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

          <div className="flex justify-start gap-3">
            <button
              type="submit"
              className="bg-secondary text-white py-2 px-6 text-sm md:text-xl rounded mt-4"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className="bg-red-500 text-white py-2 px-6 text-sm md:text-xl rounded mt-4"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}
