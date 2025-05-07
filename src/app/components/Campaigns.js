"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight, faTrash, faToggleOn, faToggleOff, faCheck, faCross, faX } from "@fortawesome/free-solid-svg-icons";
import { deleteCampaign, updateCampaignPaymentStatus, getUser } from "@/app/firebase/firestoreService";
import { updateCampaignStatus } from "../firebase/adminServices";
import { useAuth } from "@/app/context/AuthContext";
import { getAllCampaigns } from "../firebase/adminServices";

export default function Campaigns() {

  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(null);
  const campaignsPerPage = 5;
  const [userEmails, setUserEmails] = useState({});

  useEffect(() => {
    if (!user) return; 
  
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const campaignList = await getAllCampaigns(user.uid);
        setCampaigns(campaignList);
        const emails = {};
        for (const campaign of campaignList) {
          const user = await getUser(campaign.userId);
          emails[campaign.userId] = user.email;
        }
        setUserEmails(emails);
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

  if (loading) {
    return <div className="text-center text-black">Loading...</div>;
  }  
  if (error) return <p className="text-red-500">{error}</p>;

  const toggleCampaignStatus = async (userId, campaignId, isActive) => {
    if (toggling) return; 
    setToggling(campaignId);
  
    try {
      await updateCampaignStatus(userId, campaignId, !isActive);
  
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

  const handleDelete = async (userId, campaignId) => {
    try {
      if (typeof window !== "undefined") {
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        
        if (isConfirmed) {
          await deleteCampaign(userId, campaignId);
          setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId));
        }
      }
    } catch (err) {
      console.error("Failed to delete campaign.", err);
    }
  };
    
  const handleApprovalChange = async (userId, campaignId, action) => {
    try {
      if (typeof window !== "undefined") {
        let confirmMessage = "";
  
        if (action === "approve") {
          confirmMessage = "Approve this campaign?";
        } else if (action === "disapprove") {
          confirmMessage = "Are you sure you want to disapprove this campaign?";
        }
  
        const isConfirmed = window.confirm(confirmMessage);
  
        if (isConfirmed) {
          if (action === "approve") {
            await updateCampaignStatus(userId, campaignId, true, "pending_payment");
            setCampaigns((prev) =>
              prev.map((campaign) =>
                campaign.id === campaignId
                  ? { ...campaign, status: "pending_payment", isActive: true }
                  : campaign
              )
            );
          } else if (action === "disapprove") {
            await updateCampaignStatus(userId, campaignId, false, "pending_approval"); 
            setCampaigns((prev) =>
              prev.map((campaign) =>
                campaign.id === campaignId
                  ? { ...campaign, status: "pending_approval", isActive: false }
                  : campaign
              )
            );
          }
        }
      }
    } catch (err) {
      console.error("Failed to update campaign status.", err);
    }
  };    
  
  return (
    <div className="text-black mx-auto max-w-screen">
      <h1 className="text-headings text-2xl md:text-3xl font-bold my-4">MANAGE CAMPAIGNS</h1>
      <div className="my-6 text-left md:text-right">
      <Link href="/dashboard/add-campaign" className="bg-secondary text-white p-3 md:p-4 text-sm md:text-md rounded-lg font-bold">Add Campaign</Link>
      </div>
      <div className="flex flex-col space-y-6 justify-center">
        <div className="my-4 overflow-x-auto">
          <table className="min-w-full table-auto mt-4 border-separate border-spacing-3">
            <thead>
              <tr className="border-b text-sm md:text-lg">
                <th className="px-4 py-2 text-left bg-accent rounded">Name</th>
                <th className="px-4 py-2 text-left bg-accent rounded">User</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Active</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Start Date</th>
                <th className="px-4 py-2 text-left bg-accent rounded">End Date</th>
                <th className="px-4 py-2 text-left bg-accent rounded">CR</th>
                {/* <th className="px-4 py-2 text-left bg-accent rounded">Status</th> */}
                <th className="px-4 py-2 text-left bg-accent rounded">Action</th>
              </tr>
            </thead>
            <tbody>
            {currentCampaigns.length > 0 ? (
              <>
              {currentCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b text-sm md:text-lg">
                  <td className="px-4 py-2">
                  <Link href={`/dashboard/campaigns/${campaign.id}`} passHref>
                  {campaign.campaignName}
                  </Link>
                  </td>
                  <td className="px-4 py-2">
                  {userEmails[campaign.userId] || "N/A"} 
                  </td>
                  <td className="px-4 py-2">
                  <FontAwesomeIcon
                    icon={campaign.isActive ? faToggleOn : faToggleOff}
                    className={`text-4xl ${
                      campaign.isDisapproved
                        ? "opacity-50 cursor-not-allowed" 
                        : toggling === campaign.id
                        ? "opacity-50 cursor-not-allowed"
                        : "text-secondary cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!campaign.isDisapproved && toggling === null) {
                        toggleCampaignStatus(campaign.userId, campaign.id, campaign.isActive);
                      }
                    }}
                  />
                  </td>
                  <td className="px-4 py-2">
                    {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "Ongoing"}
                  </td>
                  <td className="px-4 py-2">{campaign.commissionRate || 0 }%</td>
                  <td className="px-4 py-2">{campaign.status }</td>
                  <td className="px-4 py-2 flex justify-around items-center">
                  {/*<FontAwesomeIcon
                    icon={campaign.status === "pending_approval" ? faCheck : faX}
                    className="cursor-pointer"
                    title={campaign.status === "pending_approval" ? "Approve" : "Disapprove"}
                    onClick={() => handleApprovalChange(campaign.userId, campaign.id, campaign.status === "pending_approval" ? "approve" : "disapprove")}
                  />*/}
                    <FontAwesomeIcon icon={faTrash} title="Delete" className="cursor-pointer text-red-500" onClick={() => handleDelete(campaign.userId, campaign.id)} />
                  </td>
                </tr>
              ))}
              </>
            ) : (
              <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No campaigns to show</td>
                </tr>            
              )}
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