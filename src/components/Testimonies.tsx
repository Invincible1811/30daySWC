"use client";

import { useApp } from "@/lib/store";
import { Heart, MessageCircle, Share2, Plus, X, Send, Camera, Shield, Video, Mic, Eye, EyeOff, Square, Circle, Loader2, Trash2 } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function Testimonies() {
  const { testimonies, addTestimony, deleteTestimony, likeTestimony, addCommentToTestimony, userName } = useApp();
  const { user, profile, isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [shareAnonymously, setShareAnonymously] = useState(false);
  const [permissionGiven, setPermissionGiven] = useState(false);

  // Recording state: "none" → "preview" (camera open, not recording) → "recording" → "done"
  const [recordMode, setRecordMode] = useState<"none" | "video" | "audio">("none");
  const [recordStage, setRecordStage] = useState<"none" | "preview" | "recording" | "done">("none");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [blurVideo, setBlurVideo] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Ref callback — reliably attaches the stream as soon as the <video> is in the DOM
  const videoRefCallback = useCallback((node: HTMLVideoElement | null) => {
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch(() => {});
      videoElRef.current = node;
    }
  }, []);

  // Step 1: Open camera/mic preview (not recording yet)
  const openPreview = useCallback(async (mode: "video" | "audio") => {
    try {
      const constraints = mode === "video"
        ? { video: { facingMode: "user", width: 640, height: 480 }, audio: true }
        : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setRecordMode(mode);
      setRecordStage("preview");
    } catch {
      alert("Could not access your camera/microphone. Please check permissions.");
    }
  }, []);

  // Step 2: User presses Start Recording
  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    let recordStream = streamRef.current;

    // If video + blur, pipe through canvas to bake the blur into the recording
    if (recordMode === "video" && blurVideo && videoElRef.current) {
      const video = videoElRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      canvasRef.current = canvas;
      const ctx = canvas.getContext("2d")!;

      const supportsFilter = typeof ctx.filter !== "undefined" && ctx.filter !== undefined;

      const draw = () => {
        if (supportsFilter) {
          // Desktop / modern browsers
          ctx.filter = "blur(20px)";
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        } else {
          // iOS Safari fallback: draw multiple times with shadow blur
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.filter = "none";
          ctx.shadowBlur = 40;
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          // Draw scaled-up and cropped to spread blur pixels
          for (let i = 0; i < 6; i++) {
            ctx.globalAlpha = 0.35;
            ctx.drawImage(video, -8 + i * 3, -8 + i * 3, canvas.width + 16, canvas.height + 16);
          }
          ctx.globalAlpha = 1;
          ctx.restore();
        }
        animFrameRef.current = requestAnimationFrame(draw);
      };

      // captureStream is required - if not supported (some iOS), warn and skip canvas
      if (typeof (canvas as HTMLCanvasElement & { captureStream?: () => MediaStream }).captureStream === "function") {
        draw();
        const canvasStream = canvas.captureStream(30);
        streamRef.current.getAudioTracks().forEach(t => canvasStream.addTrack(t));
        recordStream = canvasStream;
      }
      // else: iOS doesn't support captureStream, blur is CSS-only (preview only)
    }

    // Pick the best supported MIME type — iOS Safari only supports mp4, Android/Chrome prefer webm
    const getMimeType = (kind: "video" | "audio") => {
      const candidates = kind === "video"
        ? ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"]
        : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mpeg"];
      return candidates.find(t => MediaRecorder.isTypeSupported(t)) ?? "";
    };
    const mimeType = getMimeType(recordMode === "video" ? "video" : "audio");
    const recorder = new MediaRecorder(recordStream, mimeType ? { mimeType } : {});
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      cancelAnimationFrame(animFrameRef.current);
      // Use the actual MIME type the recorder used (critical for iOS which records mp4 not webm)
      const type = recorder.mimeType || (recordMode === "video" ? "video/mp4" : "audio/mp4");
      const blob = new Blob(chunksRef.current, { type });
      setRecordedBlob(blob);
      setRecordedUrl(URL.createObjectURL(blob));
      // Stop stream after recording is done
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };

    recorder.start();
    setRecordStage("recording");
    setRecordingTime(0);
    setLimitReached(false);
    const maxSeconds = recordMode === "video" ? 120 : 600; // 2min video, 10min audio
    timerRef.current = setInterval(() => {
      setRecordingTime(t => {
        if (t + 1 >= maxSeconds) {
          // Auto-stop at limit
          mediaRecorderRef.current?.stop();
          if (timerRef.current) clearInterval(timerRef.current);
          setRecordStage("done");
          setLimitReached(true);
        }
        return t + 1;
      });
    }, 1000);
  }, [recordMode, blurVideo]);

  // Step 3: Stop recording
  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecordStage("done");
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Cancel / clear everything (revoke=true means user cancelled, don't revoke on submit)
  const clearRecording = useCallback((revoke = true) => {
    if (revoke && recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordMode("none");
    setRecordStage("none");
    setRecordingTime(0);
    setBlurVideo(false);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [recordedUrl]);

  // Upload media via presigned URL: server issues the URL (tiny request), browser uploads directly
  // to Supabase — completely bypasses Vercel's 4.5MB body limit and 10s timeout.
  const uploadFailReason = useRef<string>("");

  const uploadMedia = useCallback(async (blob: Blob, mode: "video" | "audio"): Promise<string | null> => {
    uploadFailReason.current = "";
    if (!user) {
      uploadFailReason.current = "No user logged in";
      return null;
    }
    try {
      setUploadProgress(10);

      // Strip codec params: "video/webm;codecs=vp8,opus" → "video/webm"
      const baseMime = (blob.type || "").split(";")[0].trim();

      // Step 1: ask server for a presigned upload URL (sends only userId + mediaType, no file)
      const urlRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, mediaType: mode, mimeType: baseMime }),
      });

      if (!urlRes.ok) {
        const errText = await urlRes.text();
        uploadFailReason.current = `Server error (${urlRes.status}): ${errText}`;
        return null;
      }

      const urlJson = await urlRes.json();
      const { signedUrl, publicUrl } = urlJson;
      setUploadProgress(20);

      // Tick progress from 20→90 while upload is in flight
      let ticked = 20;
      const ticker = setInterval(() => {
        ticked = Math.min(ticked + 3, 88);
        setUploadProgress(ticked);
      }, 400);

      // Step 2: PUT the file directly to Supabase from the browser
      if (!blob || blob.size === 0) {
        clearInterval(ticker);
        uploadFailReason.current = "Recording is empty (0 bytes)";
        return null;
      }

      // Use base MIME (without codecs) — Supabase rejects MIME types with codec params
      const ext = urlJson.path?.endsWith(".mp4") ? "mp4" : "webm";
      const contentType = baseMime || (ext === "mp4"
        ? (mode === "video" ? "video/mp4" : "audio/mp4")
        : (mode === "video" ? "video/webm" : "audio/webm"));

      // Use XHR for the PUT — better iOS/mobile blob support + real progress events
      const xhrResult = await new Promise<{ status: number; body: string }>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round(20 + (e.loaded / e.total) * 75);
            setUploadProgress(pct);
          }
        };
        xhr.onload = () => resolve({ status: xhr.status, body: xhr.responseText?.slice(0, 300) || "" });
        xhr.onerror = () => resolve({ status: -1, body: "Network error" });
        xhr.ontimeout = () => resolve({ status: -2, body: "Timeout" });
        xhr.send(blob);
      });

      clearInterval(ticker);

      // Supabase returns 200 on success
      if (xhrResult.status >= 200 && xhrResult.status < 300) {
        setUploadProgress(100);
        return publicUrl ?? null;
      }

      uploadFailReason.current = `Supabase returned ${xhrResult.status}: ${xhrResult.body}`;
      return null;
    } catch (err) {
      uploadFailReason.current = `Exception: ${err}`;
      return null;
    }
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;


  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let finalMediaUrl: string | null = null;
    let uploadFailed = false;

    if (recordedBlob && recordMode !== "none") {
      setUploading(true);
      setUploadProgress(0);
      finalMediaUrl = await uploadMedia(recordedBlob, recordMode);
      setUploading(false);
      setUploadProgress(0);

      if (!finalMediaUrl && recordedUrl) {
        // Upload failed — use the local blob URL so at least this user sees it
        finalMediaUrl = recordedUrl;
        uploadFailed = true;
      }
    }

    addTestimony({
      author: shareAnonymously ? "Anonymous" : userName,
      authorAvatar: shareAnonymously ? undefined : (profile?.avatar_url || undefined),
      title,
      content,
      date: new Date().toISOString().split("T")[0],
      ...(finalMediaUrl ? { mediaUrl: finalMediaUrl, mediaType: recordMode as "video" | "audio" } : {}),
    });

    if (uploadFailed) {
      alert(`Upload issue: ${uploadFailReason.current || "Unknown error"}. Your testimony was saved locally but the recording may not be visible to others.`);
    }

    setTitle("");
    setContent("");
    setPhotoPreview(null);
    setShareAnonymously(false);
    setPermissionGiven(false);
    clearRecording(false); // don't revoke — blob URL is used in the feed
    setShowForm(false);
  };

  const handleComment = (testimonyId: string) => {
    if (!commentText.trim()) return;
    addCommentToTestimony(testimonyId, {
      author: userName,
      content: commentText,
      date: new Date().toISOString().split("T")[0],
    });
    setCommentText("");
    setCommentingId(null);
  };

  const handleShare = async (testimony: { title: string; content: string; author: string }) => {
    const text = `${testimony.title}\n\n${testimony.content}\n\n— ${testimony.author}\n\nShared from Soul-Winning App`;
    if (navigator.share) {
      try {
        await navigator.share({ title: testimony.title, text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      alert("Testimony copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Testimonies</h2>
          <p className="text-grey mt-1">Share and celebrate what God is doing through evangelism</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} /> Share Testimony
        </button>
      </div>

      {/* Testimonies Feed */}
      <div className="space-y-4">
        {testimonies.map(t => (
          <div key={t.id} className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {t.authorAvatar ? (
                    <img src={t.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                      {t.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-dark text-sm">{t.author}</p>
                    <p className="text-xs text-grey">{t.date}</p>
                  </div>
                </div>
                {(isAdmin || t.author === userName || t.author === profile?.full_name) && (
                  <button
                    onClick={() => { if (confirm("Delete this testimony?")) deleteTestimony(t.id); }}
                    className="p-2 rounded-full hover:bg-red-50 text-grey hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <h3 className="font-bold text-dark text-lg mb-2">{t.title}</h3>
              <p className="text-grey-dark text-sm leading-relaxed">{t.content}</p>
              {t.mediaUrl && t.mediaType === "video" && (
                <div className="mt-3 rounded-xl overflow-hidden bg-black">
                  <video
                    src={t.mediaUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full max-h-64 object-contain"
                  />
                </div>
              )}
              {t.mediaUrl && t.mediaType === "audio" && (
                <div className="mt-3 bg-grey-light/50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mic size={18} className="text-primary" />
                  </div>
                  <audio src={t.mediaUrl} controls preload="metadata" className="w-full" />
                </div>
              )}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-grey-light">
                <button
                  onClick={() => likeTestimony(t.id)}
                  className="flex items-center gap-1.5 text-sm text-grey hover:text-danger transition-colors"
                >
                  <Heart size={16} /> {t.likes}
                </button>
                <button
                  onClick={() => setCommentingId(commentingId === t.id ? null : t.id)}
                  className="flex items-center gap-1.5 text-sm text-grey hover:text-primary transition-colors"
                >
                  <MessageCircle size={16} /> {t.comments.length}
                </button>
                <button
                  onClick={() => handleShare(t)}
                  className="flex items-center gap-1.5 text-sm text-grey hover:text-primary transition-colors"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>

              {t.comments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {t.comments.map(c => (
                    <div key={c.id} className="bg-grey-light/50 rounded-lg p-3 ml-6">
                      <p className="text-xs font-medium text-dark">{c.author}</p>
                      <p className="text-xs text-grey-dark mt-0.5">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {commentingId === t.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 rounded-lg border border-grey-light text-sm focus:outline-none focus:border-primary"
                    onKeyDown={e => e.key === "Enter" && handleComment(t.id)}
                  />
                  <button onClick={() => handleComment(t.id)} className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark">
                    <Send size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Share Testimony Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full animate-pop-in shadow-2xl">
            <div className="p-5 border-b border-grey-light flex items-center justify-between">
              <h3 className="text-lg font-bold text-dark">Share Your Testimony</h3>
              <button onClick={() => setShowForm(false)} className="text-grey hover:text-dark">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Testimony title..."
                className="w-full px-4 py-3 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary"
                required
              />
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Share what God has done through your evangelism..."
                className="w-full px-4 py-3 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary resize-none h-32"
                required
              />

              {/* Media Options */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-grey-dark">Add Media (optional)</p>
                {recordStage === "none" && (
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold text-grey-dark cursor-pointer hover:text-primary bg-grey-light/60 hover:bg-primary/10 rounded-xl py-2.5 transition-colors">
                      <Camera size={14} /> Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </label>
                    <button type="button" onClick={() => openPreview("video")}
                      className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold text-grey-dark hover:text-primary bg-grey-light/60 hover:bg-primary/10 rounded-xl py-2.5 transition-colors">
                      <Video size={14} /> Video
                    </button>
                    <button type="button" onClick={() => openPreview("audio")}
                      className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold text-grey-dark hover:text-primary bg-grey-light/60 hover:bg-primary/10 rounded-xl py-2.5 transition-colors">
                      <Mic size={14} /> Audio
                    </button>
                  </div>
                )}

                {/* Photo preview */}
                {photoPreview && (
                  <div className="relative inline-block">
                    <img src={photoPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                    <button type="button" onClick={() => setPhotoPreview(null)} className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center">
                      <X size={10} />
                    </button>
                  </div>
                )}

                {/* Preview stage — camera/mic open but NOT recording yet */}
                {recordStage === "preview" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    {recordMode === "video" && (
                      <div className="relative rounded-lg overflow-hidden mb-3 bg-black">
                        <video ref={videoRefCallback} muted playsInline className={`w-full h-40 object-cover ${blurVideo ? "blur-xl" : ""}`} />
                        <button type="button" onClick={() => setBlurVideo(!blurVideo)}
                          className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                          {blurVideo ? <><EyeOff size={11} /> Blurred</> : <><Eye size={11} /> Visible</>}
                        </button>
                      </div>
                    )}
                    {recordMode === "audio" && (
                      <div className="flex items-center justify-center gap-3 mb-3 py-4">
                        <Mic size={28} className="text-primary" />
                        <span className="text-sm font-semibold text-dark">Microphone ready</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => clearRecording()}
                        className="text-xs text-grey-dark font-semibold hover:text-dark transition-colors">
                        Cancel
                      </button>
                      <button type="button" onClick={startRecording}
                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors">
                        <Circle size={12} fill="white" /> Start Recording
                      </button>
                    </div>
                  </div>
                )}

                {/* Recording in progress */}
                {recordStage === "recording" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    {recordMode === "video" && (
                      <div className="relative rounded-lg overflow-hidden mb-3 bg-black">
                        <video ref={videoRefCallback} muted playsInline className={`w-full h-40 object-cover ${blurVideo ? "blur-xl" : ""}`} />
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" /> REC
                        </div>
                        <button type="button" onClick={() => setBlurVideo(!blurVideo)}
                          className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                          {blurVideo ? <><EyeOff size={11} /> Blurred</> : <><Eye size={11} /> Visible</>}
                        </button>
                      </div>
                    )}
                    {recordMode === "audio" && (
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <Mic size={24} className="text-red-500" />
                        <span className="text-sm font-bold text-dark">Recording audio...</span>
                      </div>
                    )}
                    {/* Time progress bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-mono font-bold text-red-600 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          {formatTime(recordingTime)}
                        </span>
                        <span className="text-xs text-grey-dark">
                          {recordMode === "video" ? "max 2:00" : "max 10:00"}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((recordingTime / (recordMode === "video" ? 120 : 600)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <button type="button" onClick={stopRecording}
                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
                        <Square size={12} fill="white" /> Stop
                      </button>
                    </div>
                  </div>
                )}

                {/* Limit reached banner */}
                {limitReached && recordStage === "done" && (
                  <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-2.5 flex items-center gap-2 text-amber-800 text-xs font-semibold">
                    ⏱ {recordMode === "video" ? "2-minute" : "10-minute"} limit reached — recording stopped automatically.
                  </div>
                )}

                {/* Recorded preview */}
                {recordStage === "done" && recordedUrl && (
                  <div className="bg-grey-light/50 rounded-xl p-3 space-y-2">
                    {recordMode === "video" ? (
                      <div className="relative rounded-lg overflow-hidden bg-black">
                        <video src={recordedUrl} controls playsInline className={`w-full h-40 object-cover ${blurVideo ? "blur-xl" : ""}`} />
                        <button type="button" onClick={() => setBlurVideo(!blurVideo)}
                          className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                          {blurVideo ? <><EyeOff size={11} /> Blurred</> : <><Eye size={11} /> Clear</>}
                        </button>
                      </div>
                    ) : (
                      <audio src={recordedUrl} controls className="w-full" />
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-grey-dark">{recordMode === "video" ? "Video" : "Audio"} • {formatTime(recordingTime)}</span>
                      <button type="button" onClick={() => clearRecording()}
                        className="text-xs text-danger font-semibold flex items-center gap-1 hover:text-red-700 transition-colors">
                        <X size={12} /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Privacy Options */}
              <div className="bg-grey-light/50 rounded-xl p-3 space-y-2">
                <p className="text-xs font-bold text-grey-dark flex items-center gap-1.5"><Shield size={12} /> Privacy Options</p>
                <label className="flex items-center gap-2 text-xs text-grey-dark cursor-pointer">
                  <input type="checkbox" checked={permissionGiven} onChange={e => setPermissionGiven(e.target.checked)} className="rounded border-grey-light" />
                  I confirm permission was given to share this testimony publicly
                </label>
                <label className="flex items-center gap-2 text-xs text-grey-dark cursor-pointer">
                  <input type="checkbox" checked={shareAnonymously} onChange={e => setShareAnonymously(e.target.checked)} className="rounded border-grey-light" />
                  Share anonymously
                </label>
              </div>

              <button type="submit" disabled={!permissionGiven || uploading} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden">
                {uploading && uploadProgress > 0 && (
                  <span className="absolute inset-0 bg-primary-dark/40 rounded-xl" style={{ width: `${uploadProgress}%`, transition: "width 0.3s ease" }} />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {uploading
                    ? <><Loader2 size={16} className="animate-spin" /> {uploadProgress > 0 ? `Uploading ${uploadProgress}%...` : "Preparing..."}</>
                    : "Share Testimony"
                  }
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
