"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, getAffiliateAccount, getAffiliateLinksByUserId } from "@/app/firebase/firestoreService";

export default function User() {
  const { userId } = useParams();

  const [userData, setUserData] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [linksData, setLinksData] = useState([]);
  const [aggregatedStats, setAggregatedStats] = useState({
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [user, account, links] = await Promise.all([
          getUser(userId),
          getAffiliateAccount(userId),
          getAffiliateLinksByUserId(userId)
        ]);

        setUserData(user);
        setAccountData(account);
        setLinksData(links || []);

        // Aggregate stats from links
        const stats = links.reduce(
          (acc, link) => {
            acc.totalClicks += link.clicks || 0;
            acc.totalConversions += link.conversions || 0;
            acc.totalRevenue += link.revenue || 0;
            return acc;
          },
          { totalClicks: 0, totalConversions: 0, totalRevenue: 0 }
        );

        setAggregatedStats(stats);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user or affiliate data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="text-black mx-auto max-w-screen">
      <h1 className="text-headings text-2xl md:text-3xl font-bold my-4">Affiliate Overview</h1>

      {userData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary mb-2">User Info</h2>
          <table className="table-auto w-full border-spacing-3 border-separate text-sm">
            <tbody>
              {Object.entries(userData).map(([key, value]) => (
                <tr key={key} className="border-b">
                  <td className="font-medium capitalize px-4 py-2">{key}</td>
                  <td className="px-4 py-2">{JSON.stringify(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {accountData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary mb-2">Account Balance</h2>
          <table className="table-auto w-full border-spacing-3 border-separate text-sm">
            <tbody>
              <tr>
                <td className="px-4 py-2 font-medium">Current Balance</td>
                <td className="px-4 py-2">${accountData.currentBalance}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Lifetime Earnings</td>
                <td className="px-4 py-2">${accountData.lifetimeEarnings}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-secondary mb-2">Affiliate Link Stats</h2>
        <table className="table-auto w-full border-spacing-3 border-separate text-sm">
          <tbody>
            <tr>
              <td className="px-4 py-2 font-medium">Total Clicks</td>
              <td className="px-4 py-2">{aggregatedStats.totalClicks}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Total Conversions</td>
              <td className="px-4 py-2">{aggregatedStats.totalConversions}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Total Revenue</td>
              <td className="px-4 py-2">${aggregatedStats.totalRevenue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
