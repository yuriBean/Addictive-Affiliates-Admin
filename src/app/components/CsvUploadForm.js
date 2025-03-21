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
      if (
        headers.length !== 5 ||
        headers[0].trim() !== "Product Name" ||
        headers[1].trim() !== "Category" ||
        headers[2].trim() !== "ProductUrl" ||
        headers[3].trim() !== "Price" ||
        headers[4].trim() !== "Description"
      ) {
        setErrorMessage("Invalid CSV format. Please follow the provided format.");
        return;
      }

      const products = lines.slice(1).map((line) => {
        const values = line.split(",");
        if (values.length !== 5) return null; 

        const [productName, category, productUrl, price, description] = values.map((v) => v.trim());
        return {
          productName,
          category,
          price,
          productUrl,
          description,
          assignedCampaign: selectedCampaign,
          assignedCampaignName: campaigns.find((c) => c.id === selectedCampaign)?.campaignName || "",
          userId: user.uid,
          isActive: false,
          images: [],
        };
      }).filter(Boolean);

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
    <div className="border border-gray-400 p-6 text-sm md:text-lg rounded-md bg-gray-100">
      {!campaigns.length > 0 && <p className="text-red-500 text-sm my-4">Create a campaign before adding products.</p>} 

      <label className="block mb-2 text-sm md:text-lg font-medium">Select Campaign:</label>
      <select
        value={selectedCampaign}
        onChange={handleCampaignChange}
        className="w-full p-2 md:p-4 bg-white border border-gray-400 rounded-md"
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
        <h3 className="text-md md:text-lg font-semibold">CSV Format:</h3>
        <p className="text-xs md:text-sm text-gray-700">Ensure your CSV file follows this format:</p>
        <pre className="bg-gray-300 p-2 mt-2 rounded-md text-sm overflow-auto">
          Product Name--Category--ProductUrl--Price--Description{"\n"}
          Sample Product--Electronics--url--99.99--A great product{"\n"}
        </pre>
      </div>

      <input type="file" accept=".csv" onChange={handleFileUpload} className="mt-4 p-2 border border-gray-300 rounded w-full" />

      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

      <button onClick={handleCsvSubmit} className="bg-secondary text-white py-2 px-6 text-sm md:text-xl rounded mt-4">
        Upload
      </button>
    </div>
  );
}