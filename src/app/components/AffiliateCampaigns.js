"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCampaigns } from "@/app/firebase/firestoreService";

export default function AffiliateCampaigns() {
  const [search, setSearch] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const loadCampaigns = async () => {
      const data = await getAllCampaigns();
      setCampaigns(data);
    };
    loadCampaigns();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredCampaigns([]);
      return;
    }
    const results = campaigns.filter((campaign) =>
      campaign.campaignName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCampaigns(results);
  };

  return (
    <div className="p-6 text-black">
      <div className="mb-6 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search campaigns..."
          className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-purple-700 transition"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {search ? (
        <section>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <Link href={`/dashboard/campaigns/${campaign.id}`} key={campaign.id} className="p-4 bg-[#E3E3E3] shadow-lg rounded-lg">
                  <img src={campaign.image} alt={campaign.campaignName} className="w-full h-40 object-cover rounded-lg" />
                  <h3 className="text-lg font-bold mt-3">{campaign.campaignName}</h3>
                  <p className="text-gray-600 mt-1">Commission Rate: {campaign.commissionRate}</p>
                  </Link>
              ))
            ) : (
              <p className="text-gray-500">No campaigns found.</p>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Link href={`/dashboard/campaigns/${campaign.id}`} key={campaign.id} className="p-4 bg-[#E3E3E3] shadow-lg rounded-lg">
                  <img src={campaign.image} alt={campaign.campaignName} className="w-full h-40 object-cover rounded-lg" />
                  <h3 className="text-lg font-bold mt-3">{campaign.campaignName}</h3>
                  <p className="text-gray-600 mt-1">Commission Rate: {campaign.commissionRate}</p>
                  </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Link href={`/dashboard/campaigns/${campaign.id}`} key={campaign.id} className="p-4 bg-[#E3E3E3] shadow-lg rounded-lg">
                  <img src={campaign.image} alt={campaign.campaignName} className="w-full h-40 object-cover rounded-lg" />
                  <h3 className="text-lg font-bold mt-3">{campaign.campaignName}</h3>
                  <p className="text-gray-600 mt-1">Commission Rate: {campaign.commissionRate}</p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
