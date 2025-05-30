"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { editCampaign, editProduct, getAffiliateLink, getCampaign, getProduct, updateAffiliateLinkStats } from "@/app/firebase/firestoreService";

export default function Track() {
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
        
        const productData = await getProduct(linkData.productId, linkData.campaignId);
        await editProduct(linkData.campaignId, linkData.productId, {
          clicks: (productData.clicks || 0) + 1
        });
        
        const campaignDoc = await getCampaign(linkData.businessId, linkData.campaignId);
        await editCampaign(linkData.businessId, linkData.campaignId, {
          clicks: (campaignDoc.clicks || 0) + 1
        });
        
        if (productData && ["ppc", "ppj"].includes(productData.paymentType)) {
          await fetch("/api/track-conversion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              campaignId: linkData.campaignId,
              affiliateId: linkData.affiliateId,
              productId: linkData.productId,
              paymentType: productData.paymentType,
              pricePerAction: productData.pricePerAction,
            }),
          });
        }

        if (typeof window !== "undefined" && linkData) {
        if (linkData.productUrl) {
          window.location.href = linkData.productUrl; 
        } else if (linkData.productId) {
          router.push(`/dashboard/product?productId=${linkData.productId}&campaignId=${linkData.campaignId}`);
        } else {
          router.push(`/dashboard/campaigns/${linkData.campaignId}`);
        }}

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