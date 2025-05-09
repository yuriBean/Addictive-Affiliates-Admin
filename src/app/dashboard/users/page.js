"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { deleteUser, getAllUsers, getUserCampaignsAndProducts, getAffiliateStats } from "../../firebase/adminServices";
import { useAuth } from "@/app/context/AuthContext";
import UserTable from "@/app/components/UserTable";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentPageAffiliates, setCurrentPageAffiliates] = useState(1);
  const [currentPageBusinesses, setCurrentPageBusinesses] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 5;

  useEffect(() => {
    if (!user) return;

    const fetchUsersWithCounts = async () => {
      try {
        setLoading(true);
        const usersList = await getAllUsers();

        const usersWithStats = await Promise.all(
          usersList.map(async (singleUser) => {
            if (singleUser.role === 'affiliate') {
              const affiliateStats = await getAffiliateStats(singleUser.userId);
              return { ...singleUser, ...affiliateStats };
            } 
            const { totalCampaigns, totalProducts } = await getUserCampaignsAndProducts(singleUser.userId);
            return { ...singleUser, totalCampaigns, totalProducts };
          })
        );
        setUsers(usersWithStats);
      } catch (err) {
        setError("Failed to fetch users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithCounts();
  }, [user]);

  const filteredUsers = users.filter((user) =>
    user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const affiliates = filteredUsers.filter((user) => user.role === 'affiliate');
  const businesses = filteredUsers.filter((user) => user.role === 'business');

  const totalPagesAffiliates = Math.ceil(affiliates.length / usersPerPage);
  const indexOfLastAffiliate = currentPageAffiliates * usersPerPage;
  const indexOfFirstAffiliate = indexOfLastAffiliate - usersPerPage;
  const currentAffiliates = affiliates.slice(indexOfFirstAffiliate, indexOfLastAffiliate);

  const totalPagesBusinesses = Math.ceil(businesses.length / usersPerPage);
  const indexOfLastBusiness = currentPageBusinesses * usersPerPage;
  const indexOfFirstBusiness = indexOfLastBusiness - usersPerPage;
  const currentBusinesses = businesses.slice(indexOfFirstBusiness, indexOfLastBusiness);

  if (loading) {
    return <div className="text-center text-black">Loading...</div>;
  }
  if (error) return <p className="text-red-500">{error}</p>;

  const handleDelete = async (userId) => {
    try {
      if (typeof window !== "undefined") {
        const isConfirmed = window.confirm("Are you sure you want to delete?");

        if (isConfirmed) {
          await deleteUser(userId);
          setUsers((prev) => prev.filter((user) => user.userId !== userId));
        }
      }
    } catch (err) {
      console.error("Failed to delete user.", err);
    }
  };

  const handleDisable = async (userId, isDisabled) => {
    try {
      if (typeof window !== "undefined") {
        const confirmationMessage = isDisabled
          ? "Are you sure you want to enable this user?"
          : "Are you sure you want to disable this user?";

        const isConfirmed = window.confirm(confirmationMessage);

        if (isConfirmed) {
          const res = await fetch(isDisabled ? "/api/enable-user" : "/api/disable-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          setUsers((prev) =>
            prev.map((user) =>
              user.userId === userId ? { ...user, disabled: !isDisabled } : user
            )
          );

          alert(isDisabled ? "User enabled successfully!" : "User disabled successfully!");
        }
      }
    } catch (err) {
      console.error("Failed to update user status.", err);
      alert("Failed to update user status.");
    }
  };

  return (
    <div className="text-black mx-auto max-w-screen">
      <h1 className="text-headings text-2xl md:text-3xl font-bold my-4">MANAGE USERS</h1>
      <div className="flex flex-col space-y-6 justify-center">
        <div className="flex items-center space-x-4 mb-4">
          <label className="text-md font-semibold">Search by name or role:</label>
          <input
            type="text"
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="my-4 overflow-x-auto">
          <h2 className="text-xl font-semibold">Affiliates</h2>
          <UserTable users={currentAffiliates} handleDelete={handleDelete} handleDisable={handleDisable} />
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className="p-2 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentPageAffiliates((prev) => Math.max(prev - 1, 1))}
              disabled={currentPageAffiliates === 1}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            {[...Array(totalPagesAffiliates)].map((_, index) => (
              <button
                key={index}
                className={`p-2 rounded-lg ${currentPageAffiliates === index + 1 ? "bg-secondary text-white" : ""}`}
                onClick={() => setCurrentPageAffiliates(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="p-2 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentPageAffiliates((prev) => Math.min(prev + 1, totalPagesAffiliates))}
              disabled={currentPageAffiliates === totalPagesAffiliates}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
        </div>

        <div className="my-4 overflow-x-auto">
          <h2 className="text-xl font-semibold">Businesses</h2>
          <UserTable users={currentBusinesses} handleDelete={handleDelete} handleDisable={handleDisable} />
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className="p-2 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentPageBusinesses((prev) => Math.max(prev - 1, 1))}
              disabled={currentPageBusinesses === 1}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            {[...Array(totalPagesBusinesses)].map((_, index) => (
              <button
                key={index}
                className={`p-2 rounded-lg ${currentPageBusinesses === index + 1 ? "bg-secondary text-white" : ""}`}
                onClick={() => setCurrentPageBusinesses(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="p-2 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentPageBusinesses((prev) => Math.min(prev + 1, totalPagesBusinesses))}
              disabled={currentPageBusinesses === totalPagesBusinesses}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
