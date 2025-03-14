import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { sessionId } = await req.json();

        if (!sessionId) {
            return NextResponse.json({ success: false, error: "Session ID is required." }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session || session.payment_status !== "paid") {
            return NextResponse.json({ success: false, error: "Payment not verified." }, { status: 400 });
        }

        return NextResponse.json({ 
            success: true, 
            amount: session.amount_total / 100, 
            currency: session.currency 
        });
    } catch (error) {
        console.error("Stripe verification error:", error);
        return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
    }
}
