import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { userId, adminId } = await request.json();

    if (!userId || !adminId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the requester is admin
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", adminId)
      .single();

    if (!adminProfile || (adminProfile.role !== "admin" && adminProfile.role !== "assistant_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete profile data
    await supabase.from("profiles").delete().eq("id", userId);
    await supabase.from("daily_records").delete().eq("user_id", userId);
    await supabase.from("prayers").delete().eq("user_id", userId);
    await supabase.from("testimonies").delete().eq("user_id", userId);

    // Delete from Supabase Auth (permanently removes login credentials)
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
