import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { accountId, amount } = await req.json();

    if (!accountId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const amountInCents = Math.round(amount * 100);

    const bankAccounts = await stripe.accounts.listExternalAccounts(accountId, {
      object: "bank_account",
    });


    if (!bankAccounts.data.length) {
      return NextResponse.json(
        { error: "No bank account linked. Please add one in Stripe." },
        { status: 400 }
      );
    }

    const payout = await stripe.payouts.create(
      {
        amount: amountInCents,
        currency: "usd",
        method: "standard", 
      },
      {
        stripeAccount: accountId, 
      }
    );


    if (!["pending", "paid"].includes(payout.status)) {
      return NextResponse.json({ error: "Payout failed" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, payout });
  } catch (error) {
    console.error("Stripe payout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
