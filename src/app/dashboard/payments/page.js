"use client";
import { useState, useEffect } from "react";
import { getUser } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import AffiliatePayments from "@/app/components/AffiliatePayments";
import BusinessPayments from "@/app/components/BusinessPayments";

export default function PaymentsPage() {
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
            <AffiliatePayments />
          ) : (
            <BusinessPayments />
          )}

    </>
  );
}
