"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight, faEdit, faTrash, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { deleteCampaign, getAllUserCampaigns, updateCampaignStatus } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";

export default function BuinessCampaigns() {

  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(null);
  const campaignsPerPage = 5;

  useEffect(() => {
    if (!user) return; 
  
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const campaignList = await getAllUserCampaigns(user.uid);
        setCampaigns(campaignList);
      } catch (err) {
        setError("Failed to fetch campaigns.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCampaigns();
  }, [user]);
  
  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = campaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const toggleCampaignStatus = async (campaignId, isActive) => {
    if (toggling) return; 
    setToggling(campaignId);
  
    try {
      await updateCampaignStatus(user.uid, campaignId, !isActive);
  
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === campaignId ? { ...campaign, isActive: !isActive } : campaign
        )
      );
  
    } catch (err) {
      console.error("Failed to update campaign status", err);
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (campaignId) =>{
    try {
      await deleteCampaign(user.uid, campaignId);
  
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId));
  
    } catch (err) {
      console.error("Failed to delete campaign.", err);
    }
  }
  
  return (
    <div className="text-black mx-auto max-w-screen">
      <h1 className="text-headings text-2xl md:text-3xl font-bold my-4">MANAGE YOUR CAMPAIGNS</h1>
      <div className="my-6 text-left md:text-right">
      <Link href="/dashboard/add-campaign" className="bg-secondary text-white p-3 md:p-4 text-sm md:text-md rounded-lg font-bold">Add Campaign</Link>
      </div>
      <div className="flex flex-col space-y-6 justify-center">
        <div className="my-4 overflow-x-auto">
          <table className="min-w-full table-auto mt-4 border-separate border-spacing-3">
            <thead>
              <tr className="border-b text-sm md:text-lg">
                <th className="px-4 py-2 text-left bg-accent rounded">Name</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Active</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Start Date</th>
                <th className="px-4 py-2 text-left bg-accent rounded">End Date</th>
                <th className="px-4 py-2 text-left bg-accent rounded">CR</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b text-sm md:text-lg">
                  <td className="px-4 py-2">
                  <Link href={`/dashboard/campaigns/${campaign.id}`} passHref>
                  {campaign.campaignName}
                  </Link>
                  </td>
                  <td className="px-4 py-2">
                    <FontAwesomeIcon
                      icon={campaign.isActive ? faToggleOn : faToggleOff}
                      className={`cursor-pointer text-4xl ${
                        toggling === campaign.id ? "opacity-50 cursor-not-allowed" : "text-secondary"
                      }`}
                      onClick={() =>
                        toggling === null && toggleCampaignStatus(campaign.id, campaign.isActive)
                      }
                    />
                  </td>
                  <td className="px-4 py-2">{campaign.startDate}</td>
                  <td className="px-4 py-2">{campaign.endDate === "" ? "Ongoing" : campaign.endDate}</td>
                  <td className="px-4 py-2">{campaign.CR}</td>
                  <td className="px-4 py-2 flex justify-around">
                  <Link href={`/dashboard/edit-campaign?id=${campaign.id}`} passHref>
                    <FontAwesomeIcon icon={faEdit} className="cursor-pointer" />
                  </Link>
                    <FontAwesomeIcon icon={faTrash} className="cursor-pointer text-red-500" onClick={() => handleDelete(campaign.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className="p-2 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`p-2 rounded-lg ${
                  currentPage === index + 1 ? "bg-secondary text-white" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="p-2 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}