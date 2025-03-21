"use client"
import { faDownload, faUsers } from "@fortawesome/fontawesome-free-solid";
import { faArrowRight, faMousePointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { getAffiliateStats, fetchBalance, getEarningsByDate } from "@/app/firebase/firestoreService";
import Link from "next/link";
import { BarChart, Bar, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";

export default function AffiliateDashboard() {
  const {user} = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0.00);
  const [lifetimeEarnings, setLifetimeEarnings] = useState(0.00);
  const [earningsByDate, setEarningsByDate] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const affiliateStats = await getAffiliateStats(user.uid);
        const balance = await fetchBalance(user.uid);
        const data = await getEarningsByDate(user.uid);
        setCurrentBalance(balance.currentBalance);
        setLifetimeEarnings(balance.lifetimeEarnings);
        setEarningsByDate(data);
        setStats(affiliateStats);
      } catch (error) {
        console.error("Error fetching affiliate stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="text-center text-black">Loading...</div>;
  }

    return (
      <div className="text-black">
        <h1 className="text-2xl md:text-3xl text-headings font-bold mb-8">Dashboard</h1>
  
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Earnings</h2>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 flex justify-between items-center ">
            <div className="mb-6 space-y-2 col-span-1 bg-accent p-6 rounded-lg">
            <p className="text-sm">Current Balance</p>
            <p className="text-2xl font-bold">${currentBalance || 0}</p>
              </div>
              <div className="mb-6 space-y-2 col-span-1 bg-accent  p-6 rounded-lg">
              <p className="text-sm">Lifetime Earnings</p>
              <p className="text-2xl font-bold">${lifetimeEarnings || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-3">
              <div className="mb-6 col-span-1">
                <h3 className="text-lg font-normal">Earnings (USD)</h3>
                <div className="h-60 bg-white border border-gray-400 rounded-lg mt-2 p-4 flex items-center justify-center">
                    {stats?.topCampaigns?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.topCampaigns}>
                        <XAxis dataKey="campaignName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">No campaign earnings available</p>
                  )}
                </div>

              </div>
              <div className="mb-6 col-span-1">
                <h3 className="text-lg font-normal">Earnings by Date</h3>
                <div className="h-60 bg-white border border-gray-400 rounded-lg mt-2 p-4 flex items-center justify-center">
                {earningsByDate?.length > 0 ? (
                  
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsByDate}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No campaign earnings available</p>
              )}
              </div> 
              
              </div>
            </div>
        </section>
  
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Performance</h2>
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
  
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Top 5 Campaigns</h2>
          <div className="my-2 text-right">
              <Link href="/dashboard/campaigns" className="text-secondary font-bold">See More <FontAwesomeIcon icon={faArrowRight} /></Link>
            </div>
          <div className="bg-white p-4     rounded-lg border border-1 border-gray-300 shadow-lg">
          <div className="overflow-x-auto">
            <table className="md:min-w-full text-sm md:text-lg table-auto">
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
            {stats?.topCampaigns.length > 0 ? (
              <>
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
              </>) : (
                <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">No campaigns to show</td>
              </tr>               
              )}
            </tbody>
            </table>
            </div>
          </div>
        </section>
      </div>
    );
  }
  