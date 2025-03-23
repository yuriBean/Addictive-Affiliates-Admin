import { recordConversion } from "@/app/firebase/firestoreService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {

    //temp for Shmuel
    // const { campaignId, affiliateId, productId, orderValue, commissionRate } = await req.json();
    const { searchParams } = new URL(req.url);
    const orderValue = parseFloat(searchParams.get("orderValue"));
    const commissionRate = parseFloat(searchParams.get("commissionRate"));
    const affiliateId = searchParams.get("affiliateId");
    const productId = searchParams.get("productId");
    const campaignId = searchParams.get("campaignId");

    if (!campaignId || !affiliateId || !productId || !orderValue || !commissionRate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conversionId = await recordConversion(campaignId, affiliateId, productId, orderValue, commissionRate);

    return NextResponse.json({
      success: true,
      message: "Conversion recorded successfully",
      conversionId: conversionId, 
    }, { status: 200 });
  } catch (error) {
    console.error("Error tracking conversion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}