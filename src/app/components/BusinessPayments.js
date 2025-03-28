"use client";
import { useState, useEffect } from "react";
import { approveTransaction, fetchBalance, fetchRequests, getCampaign, getStripeAccount } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function BusinessPayments() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [requests, setRequests] = useState([]);
  const [campaigns, setCampaigns] = useState({});
  const [formData, setFormData] = useState({ paymentMethod: "", email: "", confirmEmail: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const getBalance = async () => {
      try{ 
        setLoading(true)
      if (user.uid){
        const userBalance = await fetchBalance(user.uid);
        setBalance(userBalance);
      }
    } catch (error) { 
      throw error; 
    } finally { 
      setLoading(false); 
    }
  }
    
    const getRequests = async () => {
        if (user.uid){
            const requestedTransfers = await fetchRequests(user.uid);
            const filtererRequests = requestedTransfers.filter((request) => request.status !== "pending" )
            setRequests(filtererRequests);
        }
    }
  
    getRequests();
    getBalance();
  }, [user]);

  useEffect(() => {
    if (!requests.length) return;
  
    const fetchCampaigns = async () => {
      const campaignData = {};
      for (const request of requests) {
        if (request.businessId && request.campaignId) {
          const campaign = await getCampaign(request.businessId, request.campaignId);
          campaignData[request.id] = campaign?.campaignName || "Unknown";
        }
      }
      setCampaigns(campaignData);
    };
  
    fetchCampaigns();
  }, [requests]); 
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleApproveRequest = async (request) => {
    let confirm;
    if (typeof window !== "undefined") { 
      confirm = window.confirm("Are you sure you want to make this transfer?");
    }

    if (confirm){
    try {
      setLoading(true);
      const businessStripeAccountId = await getStripeAccount(request.businessId);
      const affiliateStripeAccountId = await getStripeAccount(request.affiliateId);
      const response = await fetch("/api/transfer-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.id,
          affiliateId: request.affiliateId,
          businessId: request.businessId,
          amount: request.amount,
          businessStripeAccountId: businessStripeAccountId, 
          affiliateStripeAccountId: affiliateStripeAccountId,
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await approveTransaction(request.id, request.affiliateId, request.businessId, request.amount);
        setLoading(false);
        alert("Transfer request approved!");
      } else {
        throw new Error(result.message || "Transfer failed");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  };  

  const handleDeposit = async (e) => {
    e.preventDefault();

    router.push('/deposit');
  }

  if (loading) return <p className="text-black text-center">Loading...</p>;

  return (
    <div className="text-black">
      <h1 className="text-2xl md:text-3xl text-headings font-bold mt-4">Payment</h1>
      <p className="text-md md:text-xl mb-4">Manage your payment methods and view transaction history.</p>

      <section className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex justify-between items-center ">
          <div className="mb-6 space-y-2 col-span-1 bg-accent p-6 rounded-lg">
            <p className="text-sm">Current Balance</p>
            <p className="text-2xl font-bold">${balance?.currentBalance?.toFixed(2) || 0}</p>
          </div>
        </div>
        <div>
        <button onClick={handleDeposit} className="bg-secondary text-white py-2 px-6 text-md md:text-xl rounded-md mb-4">
              Deposit
            </button>
        </div>
      </section>

      {/* <div className="flex flex-col space-y-6 justify-center">
        <h2 className="text-secondary font-semibold text-xl">Payment Method</h2>
        <form  className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {["PayPal", "Venmo", "Check"].map((method) => (
              <div key={method} className="flex items-center">
                <input
                  type="radio"
                  id={method.toLowerCase()}
                  value={method}
                  name="paymentMethod"
                  checked={formData.paymentMethod === method}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor={method.toLowerCase()}>{method}</label>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="block text-md font-semibold">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent text-sm md:text-md rounded-2xl placeholder-gray-700"
              placeholder="user@email.com"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="confirmEmail" className="block text-md font-semibold">Confirm Email Address</label>
            <input
              type="email"
              id="confirmEmail"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              placeholder="user@email.com"
              className="w-full p-4 sm:p-6 bg-accent text-sm md:text-md rounded-2xl placeholder-gray-700"
              required
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        </form>
      </div> */}

      <div className="my-8 md:my-4 space-y-3">
        <h2 className="text-secondary font-semibold text-xl">Requests</h2>
        <div className="flex flex-wrap gap-2 md:gap-4">
          {["all", "completed", "requested", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-full text-sm md:text-md ${selectedTab === tab ? "bg-secondary text-white" : "bg-white border border-secondary hover:bg-secondary hover:text-white text-black"}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex flex-col space-y-6 justify-center">
        <div className="my-4 overflow-x-auto">
        <table className="min-w-full table-auto border-separate border-spacing-3">
        <thead>
        <tr className="border-b text-sm md:text-lg">
        <th className="px-4 py-2 text-left bg-accent rounded">Date</th>
        <th className="px-4 py-2 text-left bg-accent rounded">Amount</th>
        <th className="px-4 py-2 text-left bg-accent rounded">Affiliate Email</th>
        <th className="px-4 py-2 text-left bg-accent rounded">Campaign/Product</th>
        <th className="px-4 py-2 text-left bg-accent rounded">Status</th>
        <th className="px-4 py-2 text-left bg-accent rounded">Action</th>
      </tr>
    </thead>
    <tbody>
      {requests.length > 0 ? (
        requests
        .filter((request) => selectedTab === "all" || request.status === selectedTab)
        .map((request) => (
          <tr key={request.id} className="border-b text-sm md:text-lg">
            <td className="px-4 py-2">{new Date(request.date.seconds * 1000).toLocaleDateString()}</td>
            <td className="px-4 py-2">${request.amount.toFixed(2)}</td>
            <td className="px-4 py-2">{request.email}</td>
            <td className="px-4 py-2">{campaigns[request.id] || "Loading..."}</td>
            <td className={`px-4 py-2 font-semibold ${request.status === "pending" ? "text-yellow-500" : request.status === "completed" ? "text-green-500" : "text-red-500"}`}>
              {request.status}
            </td>
            <td className="px-4 py-2">
                <button
                  onClick={() => handleApproveRequest(request)}
                  className={`py-1 px-3 rounded-md ${
                    request.status === "completed"
                      ? "bg-gray-400 text-white"
                      : "bg-secondary text-white"
                  }`}
                  disabled = {request.status === "completed" }
                >
                  {loading ? "Transferring..." : request.status === "completed" ? "Approved" : 'Approve' }
                </button>
            </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-md md:text-lg text-gray-500">No pending requests</td>
            </tr>
          )}
    </tbody>
  </table>
  </div>
</div>

      </div>
    </div>
  );
}
