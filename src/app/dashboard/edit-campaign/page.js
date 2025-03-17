"use client";
import { Suspense } from "react";
import EditCampaign from "@/app/components/EditCampaign";

export default function EditCampaignPage() {

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditCampaign />
    </Suspense>
  );
}
