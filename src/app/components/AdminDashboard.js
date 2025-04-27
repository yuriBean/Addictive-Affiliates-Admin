"use client"
import { faDownload } from "@fortawesome/fontawesome-free-solid";
import { faMoneyBill, faMousePointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { getTotalConversions, getTotalRevenue, getTotalClicks, getTotalAffiliates, getTotalBusinesses, getPendingPayouts, getTopCampaigns, getTopProducts } from "@/app/firebase/adminServices";
import Link from "next/link";

export default function AdminDashboardPage() {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    clicks: "",
    conversions: "",
    revenue: "ppcv",
    affiliates: "",
    businesses: "",
    payouts: "",
    topCampaigns: [],
    topProducts: [],
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const totalConversions = await getTotalConversions();
        const totalRevenue = await getTotalRevenue();
        const totalClicks = await getTotalClicks();
        const totalAffiliates = await getTotalAffiliates();
        const totalBusinesses = await getTotalBusinesses();
        const pendingPayouts = await getPendingPayouts();
        const topCampaigns = await getTopCampaigns();
        const topProducts = await getTopProducts();
        setStats(() => ({
          conversions: totalConversions,
          revenue: totalRevenue,
          clicks: totalClicks,
          affiliates: totalAffiliates,
          businesses: totalBusinesses,
          payouts: pendingPayouts,
          topCampaigns: topCampaigns,
          topProducts: topProducts,
        }));    

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="text-center text-black">Loading...</div>;
  }

    return (
      <div className="text-black">
        <h1 className="text-2xl md:text-3xl text-headings font-bold mb-8">Admin Dashboard</h1>
  
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 flex justify-between items-center ">
            <div className="mb-6 space-y-2 col-span-1 bg-accent p-6 rounded-lg">
            <p className="text-sm">Total Businesses</p>
            <p className="text-2xl font-bold">{stats.businesses}</p>
              </div>
              <div className="mb-6 space-y-2 col-span-1 bg-accent p-6 rounded-lg">
              <p className="text-sm">Total Affiliates</p>
                <p className="text-2xl font-bold">{stats.affiliates}</p>
              </div>
            </div>

            <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-accent">
              <FontAwesomeIcon icon={faMousePointer} className="text-lg"/>
              <p className="text-xl font-bold mt-2">Total Clicks</p>
              <p className="text-sm text-gray-500">{stats.clicks}</p>
            </div>
            <div className="p-6 rounded-lg bg-accent">
              <FontAwesomeIcon icon={faDownload} className="text-lg"/>
              <p className="text-xl font-bold mt-2">Total Conversions</p>
              <p className="text-sm text-gray-500">{stats.conversions}</p>
            </div>
            <div className="p-6 rounded-lg bg-accent">
            <FontAwesomeIcon icon={faMoneyBill} className="text-lg"/>
            <p className="text-xl font-bold mt-2">Total Revenue</p>
            <p className="text-sm text-gray-500">
            ${parseFloat(stats?.revenue)?.toFixed(2)}
            </p>
            </div>
          </div>
        </section>

        </section>
    
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Top Campaigns</h2>
          <div className="my-6 text-left md:text-right">
              <Link href="/dashboard/add-campaign" className="bg-secondary text-white p-3 md:p-4 text-sm md:text-md rounded-lg font-bold">Add Campaign</Link>
            </div>
          <div className="bg-white p-6 rounded-lg border border-1 border-gray-300 shadow-lg">
          <div className="overflow-x-auto">
            <table className="md:min-w-full table-auto">
              <thead>
                <tr className="text-left border-b border-1 border-gray-200">
                  <th className="p-5 border-b">Campaign Name</th>
                  <th className="p-5 border-b">Revenue</th>
                  <th className="p-5 border-b">Conversions</th>
                  <th className="p-5 border-b">Clicks</th>
                  <th className="p-5 border-b">CR</th>
                </tr>
              </thead>
              
              <tbody className="text-gray-500">
                {stats?.topCampaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="p-5 border-b text-black">{campaign.campaignName}</td>
                    <td className="p-2 border-b text-black">
                      <span className="bg-[#E8EDF2] rounded-md p-2 px-4 font-semibold">
                        ${campaign?.revenue?.toFixed(2) || 0.00}
                      </span>
                    </td>
                    <td className="p-5 border-b">{campaign.conversions || 0}</td>
                    <td className="p-5 border-b">{campaign.clicks || 0}</td>
                    <td className="p-5 border-b">{campaign.conversionRate || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>
          <div className="my-6 text-left md:text-right">
              <Link href="/dashboard/add-product" className="bg-secondary text-white p-3 md:p-4 text-sm md:text-md rounded-lg font-bold">Add Product</Link>
            </div>
          <div className="bg-white p-6 rounded-lg border border-1 border-gray-300 shadow-lg">
          <div className="overflow-x-auto">
            <table className="md:min-w-full table-auto">
              <thead>
                <tr className="text-left border-b border-1 border-gray-200">
                  <th className="p-5 border-b">Product Name</th>
                  <th className="p-5 border-b">Revenue</th>
                  <th className="p-5 border-b">Conversions</th>
                  <th className="p-5 border-b">Clicks</th>
                  <th className="p-5 border-b">CR</th>
                </tr>
              </thead>
              <tbody className="text-gray-500">
                {stats?.topProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="p-5 border-b text-black">{product.productName}</td>
                    <td className="p-2 border-b text-black">
                      <span className="bg-[#E8EDF2] rounded-md p-2 px-4 font-semibold">
                        ${product?.revenue?.toFixed(2) || 0.00}
                      </span>
                    </td>
                    <td className="p-5 border-b">{product.conversions || 0}</td>
                    <td className="p-5 border-b">{product.clicks || 0}</td>
                    <td className="p-5 border-b">{product.conversionRate || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </section>

      </div>
    );
  }