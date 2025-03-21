"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCampaigns } from "@/app/firebase/firestoreService";

export default function AffiliateCampaigns() {
  const [search, setSearch] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try{
        const data = await getAllCampaigns();
        const activeCampaigns = data.filter((campaign) => campaign.isActive);
        setCampaigns(activeCampaigns);
        } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
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

  if (loading) {
    return <div className="text-center text-black">Loading...</div>;
  }

  return (
    <div className="p-6 text-black">
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-center">
        <input
          type="text"
          placeholder="Search campaigns..."
          className="col-span-1 md:col-span-4 w-full text-sm md:text-md p-3 bg-gray-200 border border-accent rounded-lg shadow-sm focus:ring-2 focus:ring-accent outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="col-span-1 flex justify-end">
          <button
            className="w-full px-6 py-2 bg-secondary text-sm md:text-lg text-white rounded-lg hover:bg-purple-700 transition-all"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {search ? (
        <section>
          <h2 className="text-md md:text-xl font-semibold mb-4">Search Results</h2>
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
