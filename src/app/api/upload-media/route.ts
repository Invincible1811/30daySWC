import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// In-memory chunk store (resets on cold start, fine for serverless)
const chunkStore = new Map<string, { chunks: Uint8Array[]; total: number; mediaType: string; userId: string }>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureBucket(supabaseAdmin: SupabaseClient<any>) {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.some((b) => b.name === "media")) {
    await supabaseAdmin.storage.createBucket("media", {
      public: true,
      allowedMimeTypes: ["video/webm", "audio/webm", "video/mp4", "audio/mp4", "audio/mpeg", "video/quicktime", "video/x-matroska"],
      fileSizeLimit: 524288000, // 500MB
    });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;
    const mediaType = formData.get("mediaType") as string | null;
    const uploadId = formData.get("uploadId") as string | null;
    const chunkIndex = parseInt(formData.get("chunkIndex") as string ?? "0");
    const totalChunks = parseInt(formData.get("totalChunks") as string ?? "1");

    if (!file || !userId || !mediaType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const chunkBuffer = new Uint8Array(await file.arrayBuffer());

    // Single-chunk upload (small file)
    if (totalChunks === 1 || !uploadId) {
      await ensureBucket(supabaseAdmin);
      const path = `testimonies/${userId}/${Date.now()}.webm`;
      const contentType = mediaType === "video" ? "video/webm" : "audio/webm";
      const { error } = await supabaseAdmin.storage.from("media").upload(path, chunkBuffer, { contentType, upsert: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      const { data: urlData } = supabaseAdmin.storage.from("media").getPublicUrl(path);
      return NextResponse.json({ url: urlData.publicUrl });
    }

    // Multi-chunk upload: accumulate
    const key = uploadId;
    if (!chunkStore.has(key)) {
      chunkStore.set(key, { chunks: new Array(totalChunks), total: totalChunks, mediaType, userId });
    }
    const entry = chunkStore.get(key)!;
    entry.chunks[chunkIndex] = chunkBuffer;

    // Check if all chunks received
    const received = entry.chunks.filter(Boolean).length;
    if (received < totalChunks) {
      return NextResponse.json({ received, total: totalChunks });
    }

    // All chunks received — assemble
    const totalBytes = entry.chunks.reduce((s, c) => s + c.byteLength, 0);
    const assembled = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of entry.chunks) {
      assembled.set(chunk, offset);
      offset += chunk.byteLength;
    }
    chunkStore.delete(key);

    await ensureBucket(supabaseAdmin);
    const path = `testimonies/${entry.userId}/${Date.now()}.webm`;
    const contentType = entry.mediaType === "video" ? "video/webm" : "audio/webm";

    const { error: uploadError } = await supabaseAdmin.storage
      .from("media")
      .upload(path, assembled, { contentType, upsert: false });

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
