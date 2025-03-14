"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getAllUserCampaigns, bulkAddProducts } from "@/app/firebase/firestoreService";

export default function CsvUploadForm() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchCampaigns = async () => {
      try {
        const campaignList = await getAllUserCampaigns(user.uid);
        setCampaigns(campaignList);
      } catch (err) {
        setErrorMessage("Failed to fetch campaigns.");
        console.error(err);
      }
    };

    fetchCampaigns();
  }, [user]);

  const handleCampaignChange = (event) => {
    setSelectedCampaign(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleCsvSubmit = async () => {
    if (!selectedCampaign) {
      setErrorMessage("Please select a campaign first.");
      return;
    }
    if (!csvFile) {
      setErrorMessage("Please upload a CSV file.");
      return;
    }

    try {
      setErrorMessage("");
      const text = await csvFile.text();
      const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

      const headers = lines[0].split(",");
      if (headers.length !== 4 || headers[0] !== "Product Name" || headers[1] !== "Category" || headers[2] !== "Price" || headers[3] !== "Description") {
        setErrorMessage("Invalid CSV format. Please follow the provided format.");
        return;
      }

      const products = lines.slice(1).map((line) => {
        const [productName, category, price, description] = line.split(",");
        return {
          productName: productName.trim(),
          category: category.trim(),
          price: price.trim(),
          description: description.trim(),
          assignedCampaign: selectedCampaign,
          assignedCampaignName: campaigns.find((c) => c.id === selectedCampaign)?.campaignName || "",
          userId: user.uid,
          isActive: false,
          images: [],
        };
      });

      await bulkAddProducts(selectedCampaign, products);
      alert("Products uploaded successfully!");
      setCsvFile(null);
      setSelectedCampaign("");
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setErrorMessage("Failed to upload products. Please try again.");
    }
  };

  return (
    <div className="border border-gray-400 p-6 rounded-md bg-gray-100">
      <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>

      <label className="block mb-2 text-lg font-medium">Select Campaign:</label>
      <select
        value={selectedCampaign}
        onChange={handleCampaignChange}
        className="w-full p-4 bg-white border border-gray-400 rounded-md"
        required
      >
        <option value="">Select a Campaign</option>
        {campaigns.map((campaign) => (
          <option key={campaign.id} value={campaign.id}>
            {campaign.campaignName}
          </option>
        ))}
      </select>

      <div className="bg-gray-200 p-4 rounded-md mt-4">
        <h3 className="text-lg font-semibold">CSV Format:</h3>
        <p className="text-sm text-gray-700">Ensure your CSV file follows this format:</p>
        <pre className="bg-gray-300 p-2 mt-2 rounded-md text-sm">
          Product Name,Category,Price,Description{"\n"}
          Sample Product,Electronics,99.99,A great product{"\n"}
          Another Item,Home,49.99,Useful and affordable
        </pre>
      </div>

      <input type="file" accept=".csv" onChange={handleFileUpload} className="mt-4 p-2 border border-gray-300 rounded w-full" />

      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

      <button onClick={handleCsvSubmit} className="mt-4 bg-secondary text-white py-2 px-6 text-lg rounded">
        Upload
      </button>
    </div>
  );
}