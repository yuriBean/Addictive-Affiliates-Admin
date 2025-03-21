import { recordConversion } from "@/app/firebase/firestoreService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { campaignId, affiliateId, orderValue, commissionRate } = await req.json();

    if (!campaignId || !affiliateId || !orderValue || !commissionRate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conversionId = await recordConversion(campaignId, affiliateId, orderValue, commissionRate);

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