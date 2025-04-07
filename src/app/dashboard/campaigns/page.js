"use client";
import { useState, useEffect } from "react";
import { getUser } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import Campaigns from "@/app/components/Campaigns";

export default function CampaignsPage() {
  const {user} = useAuth();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (!user) return;

    const getUserRole = async () => {
      const fetchedUser = await getUser(user.uid);
      setUserRole(fetchedUser.role);
  }
     getUserRole();
  }, [user]);

  return (
    <>
    {userRole === "admin" && (
      <Campaigns />
    )}
    </>
);
}
