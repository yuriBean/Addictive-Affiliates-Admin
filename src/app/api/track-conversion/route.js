import { recordConversion } from "@/app/firebase/firestoreService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {

    const { campaignId, affiliateId, productId, orderValue, commissionRate, paymentType, pricePerAction } = await req.json();

    if (!campaignId || !affiliateId || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conversionId = await recordConversion(campaignId, affiliateId, productId, orderValue, commissionRate, paymentType, pricePerAction);

    return NextResponse.json({
      success: true,
      message: "Conversion recorded successfully",
      conversionId: conversionId, 
    }, { status: 200 });
  } catch (error) {
    console.error("Error tracking conversion:", error);
    return NextResponse.json({  success: false,  message: "Missing required fields." }, { status: 500 });
  }
}