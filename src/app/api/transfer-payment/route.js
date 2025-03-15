import Stripe from "stripe";
import { NextResponse } from "next/server";
import { approveTransaction, fetchBalance } from "@/app/firebase/firestoreService";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { requestId, affiliateId, businessId, amount, businessStripeAccountId, affiliateStripeAccountId } = await req.json();

    if (!requestId || !affiliateId || !businessId || !amount || !businessStripeAccountId || !affiliateStripeAccountId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const balance = await fetchBalance(businessId);

    if (balance < amount) {
      return NextResponse.json({ error: "Insufficient balance. Please deposit funds." }, { status: 400 });
    }

    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), 
      currency: "usd",
      destination: affiliateStripeAccountId, 
      transfer_group: `payment_${requestId}`, 
    });

    if (!transfer || transfer.status !== "succeeded") {
      return NextResponse.json({ error: "Stripe transfer failed" }, { status: 500 });
    }

    const success = await approveTransaction(requestId, affiliateId, businessId, amount);

    if (!success) {
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    return NextResponse.json({ message: "Transfer approved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing transfer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}