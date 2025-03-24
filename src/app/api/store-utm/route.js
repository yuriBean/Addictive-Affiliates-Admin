import { NextResponse } from "next/server";
import { db } from "@/app/firebase/config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

let storedUTMs = {};

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  
  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    const { utm_source, utm_medium, utm_campaign, utm_product, utm_content, utm_commission_rate, utm_affiliate_network } = await req.json();

    storedUTMs = { utm_source, utm_medium, utm_campaign, utm_product, utm_content, utm_commission_rate, utm_affiliate_network };

    const utmRef = doc(collection(db, "utms"), utm_campaign);
    await setDoc(utmRef, storedUTMs, { merge: true });


    return NextResponse.json({ message: "UTMs stored", storedUTMs }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error storing UTMs:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function GET() {
    try {
        const { searchParams } = new URL(req.url);
        const campaignId = searchParams.get("utm_campaign");
    
        if (!campaignId) {
          return NextResponse.json({ error: "Missing campaignId" }, { status: 400 });
        }
    
        const utmRef = doc(collection(db, "utms"), campaignId);
        const snapshot = await getDoc(utmRef);
    
        if (!snapshot.exists()) {
          return NextResponse.json({ error: "No UTMs found" }, { status: 404 });
        }
    
        return NextResponse.json(snapshot.data(), {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          }
        });  
    } catch (error) {
    console.error("Error retrieving UTMs:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}