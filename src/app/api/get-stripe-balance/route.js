import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { accountId } = await req.json();

    if (!accountId) {
      return NextResponse.json({ error: "Missing accountId" }, { status: 400 });
    }

    const balance = await stripe.balance.retrieve({ stripeAccount: accountId });

    return NextResponse.json(balance);
  } catch (error) {
    console.error("Error fetching Stripe balance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}