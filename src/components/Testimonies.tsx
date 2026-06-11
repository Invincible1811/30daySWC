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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Ref callback — reliably attaches the stream as soon as the <video> is in the DOM
  const videoRefCallback = useCallback((node: HTMLVideoElement | null) => {
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch(() => {});
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
    const mimeType = MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "";
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const type = recordMode === "video" ? "video/webm" : "audio/webm";
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
    timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
  }, [recordMode]);

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

  // Upload media to Supabase Storage
  const uploadMedia = useCallback(async (blob: Blob, mode: "video" | "audio"): Promise<string | null> => {
    if (!user) {
      console.warn("No user — skipping upload");
      return null;
    }
    try {
      const formData = new FormData();
      formData.append("file", blob, `recording.webm`);
      formData.append("userId", user.id);
      formData.append("mediaType", mode);

      const res = await fetch("/api/upload-media", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok || !json.url) {
        console.error("Upload error:", json.error || "Unknown error");
        return null;
      }
      return json.url;
    } catch (err) {
      console.error("Upload failed:", err);
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
      finalMediaUrl = await uploadMedia(recordedBlob, recordMode);
      setUploading(false);

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
      alert("Your testimony was shared! However, the recording could not be uploaded to the cloud. Other users may not see it until the media storage is set up.");
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-bold text-red-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        {formatTime(recordingTime)}
                      </span>
                      <button type="button" onClick={stopRecording}
                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
                        <Square size={12} fill="white" /> Stop
                      </button>
                    </div>
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

              <button type="submit" disabled={!permissionGiven || uploading} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : "Share Testimony"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
