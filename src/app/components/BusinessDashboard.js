"use client"
import { faDownload, faUsers } from "@fortawesome/fontawesome-free-solid";
import { faMousePointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { getAffiliateStats, getAllUserCampaigns } from "@/app/firebase/firestoreService";
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";

export default function BusinessDashboardPage() {
  const {user} = useAuth();
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const affiliateStats = await getAffiliateStats(user.uid);
        const campaignList = await getAllUserCampaigns(user.uid);
        setCampaigns(campaignList);    
        setStats(affiliateStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="text-center text-black">Loading...</div>;
  }

  const campaignPerformanceData = stats?.topCampaigns.map((campaign) => ({
    name: campaign.campaignName,
    revenue: campaign.revenue,
    clicks: campaign.clicks,
  }));


  const productPerformanceData = stats?.topCampaigns.map((product) => ({
    name: product.campaignName,
    conversions: product.conversions,
  })) || [];

    return (
      <div className="text-black">
        <h1 className="text-2xl md:text-3xl text-headings font-bold mb-8">Dashboard</h1>
  
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 flex justify-between items-center ">
            <div className="mb-6 space-y-2 col-span-1 bg-accent p-6 rounded-lg">
            <p className="text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2) || "0.00"}</p>
              </div>
              <div className="mb-6 space-y-2 col-span-1 bg-accent p-6 rounded-lg">
              <p className="text-sm">Active Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
            </div>

            <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-accent">
              <FontAwesomeIcon icon={faMousePointer} className="text-lg"/>
              <p className="text-xl font-bold mt-2">Clicks</p>
              <p className="text-sm text-gray-500">{stats?.totalClicks || 0}</p>
            </div>
            <div className="p-6 rounded-lg bg-accent">
              <FontAwesomeIcon icon={faDownload} className="text-lg"/>
              <p className="text-xl font-bold mt-2">Conversions</p>
              <p className="text-sm text-gray-500">{stats?.totalConversions || 0}</p>
            </div>
            <div className="p-6 rounded-lg bg-accent">
            <FontAwesomeIcon icon={faUsers} className="text-lg"/>
            <p className="text-xl font-bold mt-2">Conversion Rate</p>
            <p className="text-sm text-gray-500">
                {stats?.totalClicks > 0 
                  ? ((stats.totalConversions / stats.totalClicks) * 100).toFixed(1) + "%" 
                  : "0%"}
              </p>
            </div>
          </div>
        </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
              <div className="mb-6 col-span-1">
                <h3 className="text-lg font-normal">Campaign Performance</h3>
                <div className="h-60 bg-white border border-gray-400 rounded-lg mt-2 p-4 flex items-center justify-center">
                {campaignPerformanceData?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={campaignPerformanceData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">No data available</p>
                )}
                </div>
              </div>

              <div className="mb-6 col-span-1">
                <h3 className="text-lg font-normal">Product Performance</h3>
                <div className="h-60 bg-white border border-gray-400 rounded-lg mt-2 p-4 flex items-center justify-center">
                {productPerformanceData?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={productPerformanceData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="conversions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
                 ) : (
                  <p className="text-gray-500">No data available</p>
                )}
                </div>
              </div>
            </div>

        </section>
    
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Your Top Campaigns</h2>
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
                        ${campaign.revenue.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-5 border-b">{campaign.conversions}</td>
                    <td className="p-5 border-b">{campaign.clicks}</td>
                    <td className="p-5 border-b">{campaign.conversionRate}%</td>
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