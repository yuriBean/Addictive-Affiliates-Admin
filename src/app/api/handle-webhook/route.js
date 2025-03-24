import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderValue } = await req.json();

    if (!orderValue) {
      return NextResponse.json({ error: "Missing orderValue" }, { status: 400 });
    }

    const utmRes = await fetch("https://addictiveaffiliates.com/api/store-utm");
    const { utm_campaign, utm_product, utm_content, utm_commission_rate } = await utmRes.json();

    const webhookURL = `https://addictiveaffiliates.com/api/track-conversion?orderValue=${orderValue}&commissionRate=${utm_commission_rate}&affiliateId=${utm_content}&productId=${utm_product}&campaignId=${utm_campaign}`;

    const response = await fetch(webhookURL, { method: "POST" });
    const data = await response.json();

    return NextResponse.json({ message: "Webhook forwarded", data });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
