import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const accounts = await stripe.accounts.list({ limit: 100 });
    let totalBalance = 0;

    for (const account of accounts.data) {
      const balance = await stripe.balance.retrieve({ stripeAccount: account.id });
      totalBalance += (balance.available[0]?.amount || 0) / 100;
    }

    return NextResponse.json({ escrowBalance: totalBalance });
  } catch (error) {
    console.error("Error fetching escrow balance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
