import { NextResponse } from "next/server";

// TODO: Set up Stripe when you have an account
// 1. Install stripe: npm install stripe
// 2. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID to your .env.local
// 3. Uncomment the Stripe code below

// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST() {
  // Uncomment when Stripe is ready:
  /*
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-app.vercel.app"}/?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-app.vercel.app"}/?subscription=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
  */

  // Placeholder response until Stripe is configured
  return NextResponse.json({ error: "Payment system not yet configured. Contact admin." }, { status: 503 });
}
