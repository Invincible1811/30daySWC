import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { userId, mediaType } = await request.json();

    if (!userId || !mediaType) {
      return NextResponse.json({ error: "Missing userId or mediaType" }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Ensure bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some((b) => b.name === "media")) {
      await supabaseAdmin.storage.createBucket("media", {
        public: true,
        allowedMimeTypes: ["video/webm", "audio/webm", "video/mp4", "audio/mp4", "audio/mpeg", "video/quicktime"],
        fileSizeLimit: 524288000,
      });
    }

    const path = `testimonies/${userId}/${Date.now()}.webm`;

    // Generate a presigned upload URL valid for 5 minutes
    const { data, error } = await supabaseAdmin.storage
      .from("media")
      .createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Failed to create upload URL" }, { status: 500 });
    }

    // Get the public URL for reading back after upload
    const { data: urlData } = supabaseAdmin.storage.from("media").getPublicUrl(path);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path,
      publicUrl: urlData.publicUrl,
    });
  } catch (err) {
    console.error("upload-url error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
