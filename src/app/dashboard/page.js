"use client"
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { getUser } from "@/app/firebase/firestoreService";
import DashboardPage from "../components/AffiliateDashboard";
import BusinessDashboardPage from "../components/BusinessDashboard";

export default function Dashboard() {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (!user) return;

    const getUserRole = async () => {
      const fetchedUser = await getUser(user.uid);
      setUserRole(fetchedUser.role);
  }
     getUserRole();
     setLoading(false);
  }, [user]);

  if (loading) {
    return <div className="text-center text-black">Loading dashboard...</div>;
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
  