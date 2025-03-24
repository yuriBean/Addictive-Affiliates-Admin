import { NextResponse } from "next/server";

let storedUTMs = {};

export async function OPTIONS() {
    return NextResponse.json({}, { 
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }

export async function POST(req) {
  try {
    const { utm_source, utm_medium, utm_campaign, utm_product, utm_content, utm_commission_rate, utm_affiliate_network } = await req.json();

    storedUTMs = { utm_source, utm_medium, utm_campaign, utm_product, utm_content, utm_commission_rate, utm_affiliate_network };

    return NextResponse.json({ message: "UTMs stored", storedUTMs });
  } catch (error) {
    console.error("Error storing UTMs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json(storedUTMs);
  } catch (error) {
    console.error("Error retrieving UTMs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}