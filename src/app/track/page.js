"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAffiliateLink, updateAffiliateLinkStats } from "@/app/firebase/firestoreService";

export default function TrackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const linkId = searchParams.get("linkId");

  useEffect(() => {
    const handleRedirect = async () => {
      if (!linkId) {
        router.push("/");
        return;
      }

      try {
        const linkData = await getAffiliateLink(linkId);
        
        await updateAffiliateLinkStats(linkId, {
          clicks: (linkData.clicks || 0) + 1
        });

        if (linkData.productUrl) {
          window.location.href = linkData.productUrl; 
        } else if (linkData.productId) {
          router.push(`/dashboard/product?productId=${linkData.productId}&campaignId=${linkData.campaignId}`);
        } else {
          router.push(`/dashboard/campaigns/${linkData.campaignId}`);
        }

      } catch (error) {
        console.error("Error processing affiliate link:", error);
        router.push("/");
      }
    };

    handleRedirect();
  }, [linkId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Redirecting...</p>
    </div>
  );
}