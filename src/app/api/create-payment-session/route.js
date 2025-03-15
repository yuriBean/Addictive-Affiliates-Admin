import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { userId, email, depositAmount, paymentMethod, stripeAccountId } = await req.json();

        if (!userId || !depositAmount || depositAmount < 10 || !stripeAccountId) {
            return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Business Deposit (${paymentMethod})`,
                        },
                        unit_amount: depositAmount * 100, 
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            payment_intent_data: {
                transfer_data: {
                    destination: stripeAccountId, 
                    amount: depositAmount * 100, 
                },
            },            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-cancel`,
            metadata: { userId, depositAmount, paymentMethod },
        });

        return NextResponse.json({ session }, { status: 200 });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: "Stripe session creation failed" }, { status: 500 });
    }
}
