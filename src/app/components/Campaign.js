"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { getCampaign, getCampaignById, getProductsByCampaign, getUser } from "@/app/firebase/firestoreService";

export default function Campaign() {
    const { user } = useAuth();
    const { campaignId: campaignId } = useParams();
    const [userRole, setUserRole] = useState('');
    const [campaign, setCampaign] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      if (!user) return;

      const fetchUser = async () => {
        try{
          setLoading(true);
          const fetchedUser = await getUser(user.uid);
          if (fetchedUser.role === "business"){
            setUserRole("business")
          } else {
            setUserRole("affiliate")
          }
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
        }
      }


      fetchUser();
    }, [user]);
  
    useEffect(() => {
        if (!user || !campaignId) return;
        const fetchData = async () => {
          try {
            setLoading(true);
            const [campaignData, productList] = await Promise.all([
              userRole === "business" ? getCampaign(user.uid, campaignId) : getCampaignById(campaignId),
              getProductsByCampaign(campaignId)
            ]);
            setCampaign(campaignData);
            setProducts(productList || []);
          } catch (err) {
            setError("Failed to fetch campaign or products.");
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
      
        fetchData();
      }, [user, campaignId, userRole]);
    
      if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
      }
    
      if (!campaign) {
        return <p className="text-center text-gray-500">{error || "Campaign not found."}</p>;
      }
    
  return (
    <div className="text-black mx-auto max-w-screen">
      <h1 className="text-headings text-2xl md:text-3xl font-bold my-4">{campaign.campaignName}</h1>
      <div className="flex flex-col space-y-6 justify-center">
      

        <div className="my-4 overflow-x-auto">
        <h2 className="text-lg text-secondary">Products</h2>

          <table className="min-w-full table-auto border-separate border-spacing-3">
            <thead>
              <tr className="border-b text-sm md:text-lg">
                <th className="px-4 py-2 text-left bg-accent rounded">Product Name</th>
                <th className="px-4 py-2 text-left bg-accent rounded" title="Commission Rate / Price Per Action">CR/Price</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Clicks</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products
                .filter((product) => product.isActive)
                .map((product) => (
                  <tr key={product.id} className="border-b text-sm md:text-lg">
                    <td className="px-4 py-2">
                    <Link href={`/dashboard/product?productId=${product.id}&campaignId=${product.assignedCampaign}`} title={product.productName}>
                      {product.productName.length > 20 ? product.productName.slice(0, 25) + "..." : product.productName}
                      </Link>
                    </td>
                    {product?.paymentType === "ppcv" ? (
                          <td className="px-4 py-2">
                                {product?.commissionRate}%
                          </td>
                        ) : (
                          <td className="px-4 py-2">
                                ${product?.pricePerAction}
                          </td>
                        )}
                    <td className="px-4 py-2">{product.clicks ?? "N/A"}</td>
                    <td className="px-4 py-2">
                      {product.revenue ? product.revenue : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="my-4">
          <h2 className="text-lg text-secondary">Campaign Type</h2>
          <p className="mt-3 ">{campaign.paymentType === "ppc" ? "Pay per click" : campaign.paymentType === "ppcv" ? "Pay per conversion" : `Pay per join (Whatsapp groups only)`}</p>
        </div>

        {campaign.paymentType === "ppcv" ? (
        <div className="my-4">
          <h2 className="text-lg text-secondary">Commission Rate</h2>
          <p className="mt-3 ">{campaign.commissionRate ?? "N/A"}%</p>
        </div>
        ) : (
          <div className="my-4">
          <h2 className="text-lg text-secondary">Pay Per Action</h2>
          <p className="mt-3">
                ${campaign?.pricePerAction}
          </p>
        </div>
        )}

        <div className="my-4">
          <h2 className="text-lg text-secondary">Campaign Duration</h2>
          <p className="mt-3  space-x-4">
            <span className="text-gray-500 md:text-md text-sm">{campaign.startDate ?? "N/A"}</span> <span>to</span> <span className="text-gray-500 md:text-md text-sm">{campaign.endDate ? (<>{campaign.endDate}</>) : "Ongoing"}</span>
          </p>
        </div>

        <div className="my-4">
          <h2 className="text-lg text-secondary">Description</h2>
          <p className="mt-3">{campaign.description ?? "No description available."}</p>
        </div>

        {/* <div className="my-6">
          <h2 className="text-lg text-secondary">Affiliate Link</h2>
          <div className="flex space-x-0 space-y-2 md:space-x-6 justify-between md:flex-row flex-col">
          <p className="text-gray-600 mt-2 w-full">
            {affiliateLink ? affiliateLink.link : "Generate a link to start tracking"}
          </p>
          <div className="flex text-sm md:text-lg md:flex-row justify-start md:justify-end items-center w-full gap-4">
          <button 
            className="bg-secondary p-4 py-2 text-white rounded"
            onClick={handleGenerateLink}
            disabled={generatingLink}
          >
            {generatingLink ? "Generating..." : "Generate Link"}
          </button>
          <button
            className=" bg-accent text-secondary p-4 py-2 rounded"
            onClick={handleCopyLink}
          >
            Copy Link
          </button>
          </div>
          </div>
        </div> */}

      </div>
    </div>
  );
}
