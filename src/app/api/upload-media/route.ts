import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;
    const mediaType = formData.get("mediaType") as string | null;

    if (!file || !userId || !mediaType) {
      return NextResponse.json({ error: "Missing file, userId, or mediaType" }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Ensure bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === "media");
    if (!bucketExists) {
      const { error: bucketError } = await supabaseAdmin.storage.createBucket("media", {
        public: true,
        allowedMimeTypes: ["video/webm", "audio/webm", "video/mp4", "audio/mp4", "audio/mpeg", "video/quicktime"],
        fileSizeLimit: 52428800, // 50MB
      });
      if (bucketError) {
        console.error("Bucket creation error:", bucketError.message);
        return NextResponse.json({ error: "Could not create storage bucket" }, { status: 500 });
      }
    }

    const ext = "webm";
    const path = `testimonies/${userId}/${Date.now()}.${ext}`;
    const contentType = mediaType === "video" ? "video/webm" : "audio/webm";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("media")
      .upload(path, buffer, { contentType, upsert: false });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage.from("media").getPublicUrl(path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
