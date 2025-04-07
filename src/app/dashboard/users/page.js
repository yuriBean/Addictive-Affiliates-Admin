"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight, faTrash, faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { deleteCampaign } from "@/app/firebase/firestoreService";
import { deleteUser, getAllUsers, getUserCampaignsAndProducts, updateCampaignStatus } from "../../firebase/adminServices";
import { useAuth } from "@/app/context/AuthContext";

export default function Users() {

  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const usersPerPage = 5;

  useEffect(() => {
    if (!user) return; 
  
    const fetchUsersWithCounts = async () => {
      try {
        setLoading(true);
        const usersList = await getAllUsers();
  
        const usersWithCounts = await Promise.all(
          usersList.map(async (singleUser) => {
            const { totalCampaigns, totalProducts } = await getUserCampaignsAndProducts(singleUser.userId);
            return { ...singleUser, totalCampaigns, totalProducts };
          })
        );
        setUsers(usersWithCounts);
      } catch (err) {
        setError("Failed to fetch users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsersWithCounts();
  
  }, [user]);
  
  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

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
      {/* <div className="my-6 text-left md:text-right">
      <Link href="/dashboard/add-campaign" className="bg-secondary text-white p-3 md:p-4 text-sm md:text-md rounded-lg font-bold">Add Campaign</Link>
      </div> */}
      <div className="flex flex-col space-y-6 justify-center">
        <div className="my-4 overflow-x-auto">
          <table className="min-w-full table-auto mt-4 border-separate border-spacing-3">
            <thead>
              <tr className="border-b text-sm md:text-lg">
                <th className="px-4 py-2 text-left bg-accent rounded">Name</th>
                <th className="px-4 py-2 text-left bg-accent rounded">ID</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Role</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Campaigns</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Products</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Action</th>
              </tr>
            </thead>
            <tbody>
            {currentUsers.length > 0 ? (
              <>
              {currentUsers?.map((user) => (
                <tr key={user.userId} className="border-b text-sm md:text-lg">
                  <td className="px-4 py-2">
                  <Link href={`/dashboard/campaigns/${user.id}`} passHref>
                  {user.role === "affiliate" ? user.firstName + " " +user.lastName : user.businessName}
                  </Link>
                  </td>
                  <td className="px-4 py-2">
                    {user.userId || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                  {user.role}
                  </td>
                  <td className="px-4 py-2">
                    {user.totalCampaigns || 0}
                  </td>
                  <td className="px-4 py-2">
                    {user.totalProducts || 0}
                  </td>
                  <td className="px-4 py-2 flex justify-around items-center">
                  <FontAwesomeIcon
                    icon={user.isDisapproved ? faCheck : faX}
                    className="cursor-pointer"
                    title={user.isDisapproved ? "Reapprove" : "Disapprove"}
                    onClick={() => handleDisable(user.userId, user.disabled)}
                  />
                    <FontAwesomeIcon icon={faTrash} title="Delete" className="cursor-pointer text-red-500" onClick={() => handleDelete(user.userId, user.id)} />
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