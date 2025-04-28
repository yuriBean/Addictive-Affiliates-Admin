"use client";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { addProduct, getAllUserCampaigns, getUser } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { uploadMediaFiles } from "./UploadImage";
import { getAllCampaigns } from "../firebase/adminServices";

export default function AddProductForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [productId] = useState(uuidv4());
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [otherFiles, setOtherFiles] = useState([]);
  const MAX_TOTAL_SIZE = 1 * 1024 * 1024 * 1024; 
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    paymentType: "ppcv",
    price: "",
    productUrl: "",
    description: "",
    pricePerAction: "",
    assignedCampaign: "",
    assignedCampaignName: "",
    userId: "",
    isActive: false,
    media: [],
    files: [],
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (!user) return;
    
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const campaignList = await getAllCampaigns();
        setCampaigns(campaignList);
        if (!campaignList.length > 0){
          setErrorMessage("Create a campaign before adding products.");
        }
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
        pricePerAction: selectedCampaign ? selectedCampaign.pricePerAction : "", 
        userId: selectedCampaign ? selectedCampaign.userId : "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  const handleMediaSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
  
    let newImageFiles = [...imageFiles];
    let newOtherFiles = [...otherFiles];
    let newVideoFile = videoFile;
  
    for (const file of files) {
      const fileType = file.type;
  
      if (fileType.startsWith("image/")) {
        if (newImageFiles.length >= 5) {
          setErrorMessage("You can upload up to 5 images only.");
          return;
        }
        newImageFiles.push(file);
      } else if (fileType.startsWith("video/")) {
        if (newVideoFile) {
          setErrorMessage("Only 1 video is allowed.");
          return;
        }
        newVideoFile = file;
      } else {
        if (newOtherFiles.length >= 2) {
          setErrorMessage("You can upload up to 2 additional files only.");
          return;
        }
        newOtherFiles.push(file);
      }
    }
  
    const totalSize = [...newImageFiles, ...newOtherFiles, newVideoFile ? [newVideoFile] : []]
      .flat()
      .reduce((acc, curr) => acc + curr.size, 0);
  
    if (totalSize > MAX_TOTAL_SIZE) {
      setErrorMessage("Total upload size cannot exceed 1GB.");
      return;
    }
  
    setImageFiles(newImageFiles);
    setVideoFile(newVideoFile);
    setOtherFiles(newOtherFiles);
    setErrorMessage("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };  

  const validateForm = () => {
    if (!formData.productName.trim()) return setErrorMessage("Product name is required.");
    if (!formData.category) return setErrorMessage("Category is required.");
    if (!formData.assignedCampaign) return setErrorMessage("Campaign selection is required.");
    if (!formData.productUrl.trim()) return setErrorMessage("Product URL is required.");
    if (!formData.description.trim()) return setErrorMessage("Description is required.");
    
    if (formData.paymentType === "ppcv" || formData.paymentType === "ppc"){
      if (!formData.price || isNaN(formData.price) || formData.price <= 0) return setErrorMessage("Price must be a positive number.");
    }

    if (formData.paymentType === "ppj" && !formData.productUrl.trim().startsWith("https://chat.whatsapp.com/")) {
      setErrorMessage("For Pay Per Join campaigns, the Product URL must be a WhatsApp group join link.");
      return false;
    }
    
    return "";
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== indexToRemove));
  };

  const handleRemoveOtherFile = (indexToRemove) => {
    setOtherFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };  

  const handleSubmit = async (event) => {
  
    event.preventDefault();
    if (!user) {
      setErrorMessage("You must be logged in to add a product.");
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
      const mediaFiles = [...imageFiles];
      if (videoFile) mediaFiles.push(videoFile);

      const otherUploadedFiles = [...otherFiles];


      const uploadedMedia = mediaFiles.length > 0
      ? await uploadMediaFiles(mediaFiles, user.uid, formData.assignedCampaign, productId)
      : [];
    
      const uploadedFiles = otherUploadedFiles.length > 0
      ? await uploadMediaFiles(otherUploadedFiles, user.uid, formData.assignedCampaign, productId)
      : [];
            
      const finalFormData = {
        ...formData,
        id: productId,
        media: uploadedMedia,
        files: uploadedFiles,
      };

      await addProduct(formData.assignedCampaign, formData);
      alert("Product added successfully!");

      setFormData({
        productName: "",
        category: "",
        paymentType: "ppcv",
        price: "",
        productUrl: "",
        description: "",
        assignedCampaign: "",
        assignedCampaignName: "",
        userId: "", 
        pricePerAction: "",
        isActive: false,
        media: [],
        files: [],
        });
        setImageFiles([]);
        setVideoFile(null);
        setOtherFiles([]);

      router.push("/dashboard/products");
    } catch (error) {
      setErrorMessage("Failed to add product. Try again.");
      console.error("Error adding product:", error);
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
      {!campaigns.length > 0 && <p className="text-red-500 text-sm my-4">Create a campaign before adding products.</p>} 
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
            .filter((campaign) => campaign.paymentType === formData.paymentType && campaign.status === "active")
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
        
        <label className="w-full h-32 md:h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            onChange={handleMediaSelect}
            className="hidden"
          />
          <FontAwesomeIcon icon={faUpload} className="text-2xl md:text-4xl" />
          <p className="text-gray-600 mt-2">Click or drag images here</p>
        </label>
        <div className="flex flex-wrap gap-2 mt-4">
            {imageFiles.map((file, index) => (
              <div key={`img-${index}`} className="relative w-24 h-24">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected image ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}

            {videoFile && (
              <div key="video" className="relative w-24 h-24">
                <video
                  src={URL.createObjectURL(videoFile)}
                  className="w-full h-full object-cover rounded-md"
                  controls
                />
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {otherFiles.map((file, index) => (
              <div key={`file-${index}`} className="relative w-24 h-24 flex flex-col items-center justify-center bg-gray-300 rounded-md p-2 text-xs text-center">
                <span className="truncate w-20">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOtherFile(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="flex justify-start gap-3">
            <button type="submit" className="bg-secondary text-white py-2 px-6 text-sm md:text-xl rounded mt-4" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
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