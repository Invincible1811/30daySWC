import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { reason } = await request.json();

    // Get user from auth header
    const authHeader = request.headers.get("cookie") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // For now, update the user's subscription status to cancelled
    // In production, you'd also cancel via Stripe API
    const { data: { user } } = await createClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { cookie: authHeader } } }
    ).auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update subscription status
    await supabase
      .from("profiles")
      .update({ subscription_status: "cancelled" })
      .eq("id", user.id);

    // Log cancellation reason
    await supabase
      .from("cancellation_reasons")
      .insert({ user_id: user.id, reason, cancelled_at: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });
  }
}
