"use client";
import { useState, useEffect } from "react";
import AffiliateCampaigns from '@/app/components/AffiliateCampaigns'
import { getUser } from "@/app/firebase/firestoreService";
import BusinessCampaigns from '@/app/components/BusinessCampaigns'
import { useAuth } from "@/app/context/AuthContext";

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
    {userRole === "affiliate" ? (
      <AffiliateCampaigns />
    ) : (
      <BusinessCampaigns />
    )}
    </>
);
}
