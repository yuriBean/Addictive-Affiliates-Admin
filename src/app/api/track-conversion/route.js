import { recordConversion } from "@/app/firebase/firestoreService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { linkId, orderValue, commissionRate } = await req.json();

    if (!linkId || !orderValue || !commissionRate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await recordConversion(linkId, orderValue, commissionRate);

    return NextResponse.json({ message: "Conversion recorded successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error tracking conversion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}