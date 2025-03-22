"use client"
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { getUser } from "@/app/firebase/firestoreService";
import DashboardPage from "../components/AffiliateDashboard";
import BusinessDashboardPage from "../components/BusinessDashboard";

export default function Dashboard() {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (!user) return;

    const getUserRole = async () => {
      setLoading(true);
      try {
        const fetchedUser = await getUser(user.uid);
        setUserRole(fetchedUser.role);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }
    
     getUserRole();
  }, [user]);

  if (loading) {
    return <div className="text-center text-black">Loading...</div>;
  }

    return (
      <>
      {userRole === "affiliate" ? (
        <DashboardPage />
      ) : (
        <BusinessDashboardPage />
      )}
      </>
    );
  }
  