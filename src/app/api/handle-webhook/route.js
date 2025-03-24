import { NextResponse } from "next/server";
import { db } from "@/app/firebase/config";
import { collection, doc, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { orderValue, utm_campaign } = await req.json();

    if (!orderValue || !utm_campaign) {
        return NextResponse.json({ error: "Missing orderValue or utm_campaign" }, { status: 400 });
      }

      const utmRef = doc(collection(db, "utms"), utm_campaign);
      const snapshot = await getDoc(utmRef);
  
      if (!snapshot.exists()) {
        return NextResponse.json({ error: "No UTMs found for campaign" }, { status: 404 });
      }

      const { utm_product, utm_content, utm_commission_rate } = snapshot.data();

      if (!utm_product || !utm_content || !utm_commission_rate) {
        return NextResponse.json({ error: "Incomplete UTM data" }, { status: 400 });
      }
  
      const webhookURL = `https://addictiveaffiliates.com/api/track-conversion`;
    
      const response = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderValue,
          commissionRate: utm_commission_rate,
          affiliateId: utm_content,
          productId: utm_product,
          campaignId: utm_campaign
        })
      });
  
      if (!response.ok) {
        throw new Error(`Webhook error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return NextResponse.json({ message: "Webhook forwarded", data });
    } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
