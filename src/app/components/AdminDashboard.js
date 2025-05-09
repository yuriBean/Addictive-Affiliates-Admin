"use client"
import { faDownload } from "@fortawesome/fontawesome-free-solid";
import { faMoneyBill, faMousePointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { getTotalConversions, getTotalRevenue, getTotalClicks, getTotalAffiliates, getTotalBusinesses, getPendingPayouts, getTopCampaigns, getTopProducts } from "@/app/firebase/adminServices";
import Link from "next/link";
import TopCampaignsTable from "./TopCampaignsTable";
import TopProductsTable from "./TopProductsTable";

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
    if (!user) return null;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          totalConversions,
          totalRevenue,
          totalClicks,
          totalAffiliates,
          totalBusinesses,
          pendingPayouts,
          topCampaigns,
          topProducts
        ] = await Promise.all([
          getTotalConversions(),
          getTotalRevenue(),
          getTotalClicks(),
          getTotalAffiliates(),
          getTotalBusinesses(),
          getPendingPayouts(),
          getTopCampaigns(),
          getTopProducts()
        ]);
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
            <Link href={'/dashboard/users'}>
            <div className="mb-6 space-y-2 col-span-1 bg-accent p-6 rounded-lg">
            <p className="text-sm">Total Businesses</p>
            <p className="text-2xl font-bold">{stats.businesses}</p>
              </div></Link>
            <Link href={'/dashboard/users'}>
              <div className="mb-6 space-y-2 col-span-1 bg-accent p-6 rounded-lg">
              <p className="text-sm">Total Affiliates</p>
                <p className="text-2xl font-bold">{stats.affiliates}</p>
              </div>
              </Link>
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
    
        <TopCampaignsTable campaigns={stats.topCampaigns} />
        <TopProductsTable products={stats.topProducts} />

      </div>
    );
  }