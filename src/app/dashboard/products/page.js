"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AffiliateProducts from "@/app/components/AffiliateProducts";
import BusinessProducts from "@/app/components/BusinessProducts";
import { getUser } from "@/app/firebase/firestoreService";

export default function ProductPage() { 
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
            <AffiliateProducts />
          ) : (
            <BusinessProducts />
          )}

    </>
  );
}
