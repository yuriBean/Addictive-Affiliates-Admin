"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons"; 
import { editProduct, getAllUserCampaigns, getProduct } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import EditProduct from "@/app/components/EditProduct";

export default function EditProductPage() {

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditProduct />
    </Suspense>
  );
}
