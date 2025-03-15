import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const { accountId } = await req.json();

    if (!accountId) {
        return NextResponse.json({ error: "Missing account ID" }, { status: 400 });
    }

    try {
        const account = await stripe.accounts.retrieve(accountId);

        if (account.charges_enabled && account.payouts_enabled) {
        return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return res.status(200).json({ success: false });
        }
    } catch (error) {
        console.error("Error fetching Stripe account status:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}