import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;
  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;
        const customerId = session.customer as string;

        if (customerEmail) {
          // Find user by email and activate subscription
          const { data: users } = await supabaseAdmin.auth.admin.listUsers();
          const user = users?.users?.find((u: { email?: string }) => u.email === customerEmail);

          if (user) {
            await supabaseAdmin.from("profiles").update({
              subscription_status: "active",
              stripe_customer_id: customerId,
              trial_ends_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            }).eq("id", user.id);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        // Map Stripe status to app status
        let appStatus: string;
        if (status === "active" || status === "trialing") {
          appStatus = "active";
        } else if (status === "canceled" || status === "unpaid") {
          appStatus = "cancelled";
        } else if (status === "past_due") {
          appStatus = "expired";
        } else {
          appStatus = "active";
        }

        await supabaseAdmin.from("profiles").update({
          subscription_status: appStatus,
        }).eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabaseAdmin.from("profiles").update({
          subscription_status: "expired",
        }).eq("stripe_customer_id", customerId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabaseAdmin.from("profiles").update({
          subscription_status: "expired",
        }).eq("stripe_customer_id", customerId);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
