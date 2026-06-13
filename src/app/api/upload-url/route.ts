import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  // Debug endpoint — lets us verify env vars are set on Vercel
  return NextResponse.json({
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    urlPrefix: supabaseUrl?.slice(0, 30) || "MISSING",
  });
}

export async function POST(request: Request) {
  try {
    // Guard: fail fast with clear message if env vars missing
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("MISSING ENV VARS — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set on Vercel");
      return NextResponse.json({ error: "Server misconfigured: missing Supabase credentials" }, { status: 500 });
    }

    // mimeType is the actual browser-reported type (e.g. video/mp4 on iOS, video/webm on Android)
    const { userId, mediaType, mimeType: clientMime } = await request.json();

    if (!userId || !mediaType) {
      return NextResponse.json({ error: "Missing userId or mediaType" }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Ensure bucket exists with all mobile-relevant MIME types
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some((b) => b.name === "media")) {
      await supabaseAdmin.storage.createBucket("media", {
        public: true,
        allowedMimeTypes: [
          "video/webm", "video/mp4", "video/quicktime", "video/x-matroska",
          "audio/webm", "audio/mp4", "audio/mpeg", "audio/ogg", "audio/wav",
        ],
        fileSizeLimit: 524288000,
      });
    }

    // Derive file extension from actual MIME type (iOS records mp4, Android records webm)
    const ext = clientMime?.includes("mp4") || clientMime?.includes("quicktime") ? "mp4" : "webm";
    const path = `testimonies/${userId}/${Date.now()}.${ext}`;

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
