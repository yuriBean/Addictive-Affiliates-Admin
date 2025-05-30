"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getAllUserCampaigns, bulkAddProducts } from "@/app/firebase/firestoreService";

export default function CsvUploadForm() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [paymentType, setPaymentType] = useState("ppcv");
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

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
    setSelectedCampaign(""); 
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "text/csv") {
      setErrorMessage("Invalid file type. Please upload a CSV file.");
      setCsvFile(null);
      return;
    }
    setCsvFile(file);
    setErrorMessage("");
  };

  const validateCsvData = (lines) => {
    const headers = lines[0].split(",");
    if (
      headers.length !== 5 ||
      headers[0].trim() !== "Product Name" ||
      headers[1].trim() !== "Category" ||
      headers[2].trim() !== "Product Url" ||
      headers[3].trim() !== "Price" ||
      headers[4].trim() !== "Description"
    ) {
      return "Invalid CSV format. Please follow the required structure.";
    }

    const products = lines.slice(1).map((line, index) => {
      const values = line.split(",").map((v) => v.trim());
      if (values.length !== 5) return { error: `Row ${index + 2} has missing columns.` };

      const [productName, category, productUrl, price, description] = values;
      if (!productName || !category || !productUrl || !price || !description) {
        return { error: `Row ${index + 2} contains empty fields.` };
      }

      if (isNaN(price) || Number(price) <= 0) {
        return { error: `Row ${index + 2} has an invalid price.` };
      }

      const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlRegex.test(productUrl)) {
        return { error: `Row ${index + 2} has an invalid Product Url.` };
      }

      return {
        productName,
        category,
        paymentType,
        price,
        productUrl,
        description,
        assignedCampaign: selectedCampaign,
        assignedCampaignName: campaigns.find((c) => c.id === selectedCampaign)?.campaignName || "",
        userId: user.uid,
        isActive: false,
        images: [],
      };
    });

    const errors = products.filter((p) => p.error);
    return errors.length ? errors.map((e) => e.error).join("\n") : products;
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
      const validationResult = validateCsvData(lines);

      if (typeof validationResult === "string") {
        setErrorMessage(validationResult);
        return;
      }

      await bulkAddProducts(selectedCampaign, validationResult);
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

      <div>
          <small>Payment Type</small>
          <div className="flex md:flex-row flex-col gap-4 my-3">
            <label className="flex items-center">
            <input type="radio" name="paymentType" value="ppc" checked={paymentType === "ppc"} onChange={handlePaymentTypeChange} className="mr-2" />
              Pay Per Click
            </label>
            <label className="flex items-center">
            <input type="radio" name="paymentType" value="ppcv" checked={paymentType === "ppcv"} onChange={handlePaymentTypeChange} className="mr-2" />
            Pay Per Conversion
          </label>
          <label className="flex items-center">
            <input type="radio" name="paymentType" value="ppj" checked={paymentType === "ppj"} onChange={handlePaymentTypeChange} className="mr-2" />
              <div>Pay Per Join <small className=" p-1">(For WhatsApp Group Only)</small></div>
            </label>
          </div>
        </div>

      <label className="block mb-2 text-sm md:text-lg font-medium">Select Campaign:</label>
      <select
        value={selectedCampaign}
        onChange={handleCampaignChange}
        className="w-full p-2 md:p-4 bg-white border text-md border-gray-400 rounded-md"
        required
      >
        <option className="text-sm" value="">Select a Campaign</option>
        {campaigns
        .filter((campaign) => campaign.paymentType === paymentType)
        .map((campaign) => (
          <option className="text-sm" key={campaign.id} value={campaign.id}>
                {campaign.campaignName} -- Pay Per Action: ${campaign.pricePerAction}
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