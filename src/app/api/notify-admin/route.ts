import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ADMIN_EMAIL = "barniehbernard@gmail.com";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Save to notify_emails table
    await supabaseAdmin
      .from("notify_emails")
      .upsert({ email: email.trim().toLowerCase() }, { onConflict: "email" });

    // Send email to admin via Supabase Edge Function or direct SMTP
    // Using Supabase's built-in email via Auth admin (sends a magic link style email)
    // Instead, we'll store a notification record for the admin
    await supabaseAdmin.from("admin_alerts").insert({
      type: "notify_signup",
      message: `${email} wants to be notified when applications open.`,
      email: email.trim().toLowerCase(),
      read: false,
    });

    // Also try sending via Resend/email if configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Soul-Winning App <notifications@30dayswc.com>",
          to: [ADMIN_EMAIL],
          subject: "New Notify Me Signup",
          html: `<p><strong>${email}</strong> just clicked "Notify Me" and wants to be notified when scholarship applications open.</p><p>View all signups in your <a href="https://www.30dayswc.com">Admin Dashboard → Notifications tab</a>.</p>`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notify admin error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
