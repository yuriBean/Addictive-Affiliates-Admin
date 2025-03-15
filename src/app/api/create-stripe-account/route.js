import Stripe from "stripe";
import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {

    const { userId, email } = await req.json();
    if (!userId || !email ) {
        return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }

    try {
        const account = await stripe.accounts.create({
            type: "express",  
            email,
            country: "US",  
            capabilities: {
                transfers: { requested: true },
            },
            metadata: { userId },
        });

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/retry-onboarding`,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments`, 
            type: "account_onboarding",
        });

        return NextResponse.json({ account: account, onboardingUrl: accountLink.url }, { status: 200 });
    } catch (error) {
        console.error("Stripe account creation failed:", error);
        return NextResponse.json({ error: "Stripe account creation failed" }, { status: 500 });
    }
}