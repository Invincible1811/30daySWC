"use client";

import { useApp } from "@/lib/store";
import { challengeCards as challengeCardsData } from "@/lib/data";
import { BookOpen, Check, Lock, ChevronRight, Printer, Share2, X, Save, Users, Heart, ClipboardList } from "lucide-react";
import { useState, useEffect } from "react";

export default function ChallengeCards() {
  const { currentDay, completedDays, completeDay, dailyRecords, saveDailyRecord, shareDailyRecord } = useApp();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  // Form state for daily record
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});
  const [soulsSaved, setSoulsSaved] = useState(0);
  const [peoplePrayedFor, setPeoplePrayedFor] = useState(0);
  const [invitationsToChurch, setInvitationsToChurch] = useState(0);
  const [contactInfo, setContactInfo] = useState("");
  const [healingTestimonies, setHealingTestimonies] = useState("");

  const challengeCards = challengeCardsData;
  const selected = selectedCard !== null ? challengeCards[selectedCard] : null;

  // Load existing record when selecting a card
  useEffect(() => {
    if (selectedCard !== null) {
      const card = challengeCards[selectedCard];
      if (!card) return;
      const existing = dailyRecords[card.day];
      if (existing) {
        setReflectionAnswers(existing.reflectionAnswers || {});
        setSoulsSaved(existing.soulsSaved);
        setPeoplePrayedFor(existing.peoplePrayedFor);
        setInvitationsToChurch(existing.invitationsToChurch);
        setContactInfo(existing.contactInfo);
        setHealingTestimonies(existing.healingTestimonies);
        setSaved(true);
      } else {
        setReflectionAnswers({});
        setSoulsSaved(0);
        setPeoplePrayedFor(0);
        setInvitationsToChurch(0);
        setContactInfo("");
        setHealingTestimonies("");
        setSaved(false);
      }
      setShared(false);
      setShowRecordForm(false);
    }
  }, [selectedCard, dailyRecords, challengeCards]);

  const handleSaveRecord = () => {
    if (!selected) return;
    saveDailyRecord({
      day: selected.day,
      reflectionAnswers,
      soulsSaved,
      peoplePrayedFor,
      invitationsToChurch,
      contactInfo,
      healingTestimonies,
      date: new Date().toISOString().split("T")[0],
    });
    setSaved(true);
  };

  const handleShareToCommunity = () => {
    if (!selected) return;
    handleSaveRecord();
    shareDailyRecord(selected.day);
    setShared(true);
  };

  const handlePrint = () => {
    if (!selected) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Day ${selected.day} - ${selected.title}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
        h1 { color: #1E40AF; } h2 { color: #333; } .scripture { background: #f0f4ff; padding: 16px; border-radius: 8px; font-style: italic; color: #1E40AF; margin: 16px 0; }
        .tip { background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0; }
      </style></head><body>
      <h1>Day ${selected.day}: ${selected.title}</h1>
      <h2>${selected.theme}</h2>
      <h3>Today's Challenge</h3><p>${selected.challenge}</p>
      <div class="scripture">"${selected.keyScripture}"</div>
      <h3>Prayer</h3><p>${selected.prayer}</p>
      <h3>Daily Reading</h3><p>${selected.dailyReading}</p>
      <h3>Encouragement</h3><p>${selected.encouragement}</p>
      <h3>Location Suggestions</h3><p>${selected.locationSuggestions}</p>
      <h3>Group Activity</h3><p>${selected.groupActivity}</p>
      <h3>Reflections</h3><ul>${selected.reflections.map((r: string) => `<li>${r}</li>`).join('')}</ul>
      <h3>Praying for the Sick</h3><p>${selected.prayingForSick}</p>
      <p style="text-align:center;margin-top:40px;color:#999;">Winning Souls - 30 Day Soul Winning Challenge</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async () => {
    if (!selected) return;
    const text = `Day ${selected.day}: ${selected.title}\nTheme: ${selected.theme}\n\n📋 Challenge: ${selected.challenge}\n\n📖 ${selected.keyScripture}\n\n� ${selected.encouragement}\n\n📍 Locations: ${selected.locationSuggestions}\n\n— Winning Souls App #30DaySWC`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Day ${selected.day}: ${selected.title}`, text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      alert("Challenge copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-dark">30-Day Challenge</h2>
        <p className="text-grey mt-1">Complete one challenge each day to grow as a soul winner</p>
      </div>

      {/* Progress */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-dark">Your Progress</span>
          <span className="text-sm text-primary font-semibold">{completedDays.length}/30 days</span>
        </div>
        <div className="w-full h-2.5 bg-grey-light rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
            style={{ width: `${(completedDays.length / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {challengeCards.map((card, idx) => {
          const isCompleted = completedDays.includes(card.day);
          const isCurrent = card.day === Math.min(currentDay, 30);
          const isLocked = card.day > currentDay && !isCompleted;

          return (
            <button
              key={card.day}
              onClick={() => !isLocked && setSelectedCard(idx)}
              disabled={isLocked}
              className={`relative rounded-xl p-4 text-left transition-all border ${
                isCurrent
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                  : isCompleted
                  ? "bg-success/10 border-success/30 hover:border-success"
                  : isLocked
                  ? "bg-grey-light border-grey-light text-grey cursor-not-allowed opacity-60"
                  : "bg-card border-grey-light hover:border-primary/30 hover:shadow-md"
              }`}
            >
              {isCompleted && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
              {isLocked && (
                <Lock size={14} className="absolute top-2 right-2 text-grey" />
              )}
              <p className={`text-xs font-medium ${isCurrent ? "text-blue-200" : isCompleted ? "text-success" : "text-grey"}`}>
                Day {card.day}
              </p>
              <p className={`text-sm font-semibold mt-1 line-clamp-2 ${
                isCurrent ? "text-white" : isCompleted ? "text-dark" : isLocked ? "text-grey" : "text-dark"
              }`}>
                {card.title}
              </p>
              {isCurrent && (
                <div className="mt-2 flex items-center gap-1 text-xs text-blue-200">
                  Today <ChevronRight size={12} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Card Pop-up */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-lg w-full animate-pop-in shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white relative">
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
              >
                <X size={18} />
              </button>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <BookOpen size={28} />
              </div>
              <p className="text-blue-200 text-sm">Day {selected.day} of 30</p>
              <h3 className="text-xl font-bold mt-1">{selected.title}</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-primary font-semibold uppercase tracking-wide">{selected.theme}</p>

              <div className="bg-amber-50 rounded-xl p-4">
                <h4 className="font-semibold text-amber-800 text-sm mb-1">🎵 Worship Note:</h4>
                <p className="text-amber-700 text-sm italic">{selected.worshipNote}</p>
                <p className="text-amber-600 text-xs mt-2 italic">{selected.praiseScripture}</p>
              </div>

              <div>
                <h4 className="font-semibold text-dark text-sm mb-2">🙏 Prayer:</h4>
                <p className="text-grey-dark text-sm leading-relaxed">{selected.prayer}</p>
              </div>

              <div className="bg-primary/5 rounded-xl p-4">
                <h4 className="font-semibold text-primary text-sm mb-1">📖 Key Scripture:</h4>
                <p className="text-primary text-sm italic leading-relaxed">&ldquo;{selected.keyScripture}&rdquo;</p>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 bg-grey-light rounded-xl p-3">
                  <h4 className="font-semibold text-dark text-xs mb-1">📚 Daily Reading</h4>
                  <p className="text-grey-dark text-sm">{selected.dailyReading}</p>
                </div>
                <div className="flex-1 bg-grey-light rounded-xl p-3">
                  <h4 className="font-semibold text-dark text-xs mb-1">📍 Locations</h4>
                  <p className="text-grey-dark text-sm">{selected.locationSuggestions}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-dark text-sm mb-2">📋 Today&apos;s Challenge:</h4>
                <p className="text-grey-dark text-sm leading-relaxed">{selected.challenge}</p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 text-sm mb-1">� Encouragement:</h4>
                <p className="text-green-700 text-sm italic leading-relaxed">&ldquo;{selected.encouragement}&rdquo;</p>
              </div>

              <div>
                <h4 className="font-semibold text-dark text-sm mb-2">👥 Group Activity:</h4>
                <p className="text-grey-dark text-sm leading-relaxed">{selected.groupActivity}</p>
              </div>

              <div>
                <h4 className="font-semibold text-dark text-sm mb-2">🤔 Reflections:</h4>
                <ul className="space-y-1">
                  {selected.reflections.map((r, i) => (
                    <li key={i} className="text-grey-dark text-sm leading-relaxed flex gap-2">
                      <span className="text-primary">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50 rounded-xl p-4">
                <h4 className="font-semibold text-rose-800 text-sm mb-1">🙌 Praying for the Sick:</h4>
                <p className="text-rose-700 text-sm leading-relaxed">{selected.prayingForSick}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 bg-grey-light text-dark py-2.5 rounded-xl text-sm font-medium hover:bg-grey-medium/30 transition-colors">
                  <Printer size={16} /> Print
                </button>
                <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 bg-grey-light text-dark py-2.5 rounded-xl text-sm font-medium hover:bg-grey-medium/30 transition-colors">
                  <Share2 size={16} /> Share
                </button>
              </div>

              {/* Record Your Day Button */}
              {selected.day <= currentDay && (
                <button
                  onClick={() => setShowRecordForm(!showRecordForm)}
                  className="w-full bg-primary/10 text-primary py-3 rounded-xl font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                >
                  <ClipboardList size={18} /> {showRecordForm ? "Hide" : (saved ? "Edit" : "Record")} Your Day
                </button>
              )}

              {/* Record Form */}
              {showRecordForm && (
                <div className="space-y-4 border-t border-grey-light pt-4">
                  {/* Reflections */}
                  <div>
                    <h4 className="font-bold text-dark text-sm mb-3 flex items-center gap-2">🤔 Reflections</h4>
                    {selected.reflections.map((question, i) => (
                      <div key={i} className="mb-3">
                        <label className="text-grey-dark text-sm font-medium block mb-1">{question}</label>
                        <textarea
                          value={reflectionAnswers[question] || ""}
                          onChange={(e) => setReflectionAnswers(prev => ({ ...prev, [question]: e.target.value }))}
                          placeholder="Write your answer..."
                          className="w-full border border-grey-light rounded-xl p-3 text-sm text-dark placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Impact Record */}
                  <div>
                    <h4 className="font-bold text-dark text-sm mb-3 flex items-center gap-2">📊 Impact Record</h4>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="text-grey-dark text-xs font-medium block mb-1">Souls Saved</label>
                        <input
                          type="number"
                          min={0}
                          value={soulsSaved}
                          onChange={(e) => setSoulsSaved(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full border border-grey-light rounded-xl p-2.5 text-sm text-dark text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="text-grey-dark text-xs font-medium block mb-1">People Prayed For</label>
                        <input
                          type="number"
                          min={0}
                          value={peoplePrayedFor}
                          onChange={(e) => setPeoplePrayedFor(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full border border-grey-light rounded-xl p-2.5 text-sm text-dark text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="text-grey-dark text-xs font-medium block mb-1">Church Invites</label>
                        <input
                          type="number"
                          min={0}
                          value={invitationsToChurch}
                          onChange={(e) => setInvitationsToChurch(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full border border-grey-light rounded-xl p-2.5 text-sm text-dark text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-grey-dark text-xs font-medium block mb-1">Contact Info (Name/Phone/Email)</label>
                      <textarea
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="e.g. John Doe, +1234567890, john@email.com"
                        className="w-full border border-grey-light rounded-xl p-3 text-sm text-dark placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-grey-dark text-xs font-medium block mb-1">Healing & Miracle Testimonies</label>
                      <textarea
                        value={healingTestimonies}
                        onChange={(e) => setHealingTestimonies(e.target.value)}
                        placeholder="Share what God did today..."
                        className="w-full border border-grey-light rounded-xl p-3 text-sm text-dark placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Save & Share buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveRecord}
                      className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={16} /> {saved ? "Update" : "Save"} Record
                    </button>
                    <button
                      onClick={handleShareToCommunity}
                      disabled={shared}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                        shared
                          ? "bg-success/10 text-success cursor-default"
                          : "bg-accent text-white hover:bg-accent/90"
                      }`}
                    >
                      <Users size={16} /> {shared ? "Shared!" : "Share to Community"}
                    </button>
                  </div>
                  {saved && (
                    <p className="text-xs text-success text-center flex items-center justify-center gap-1">
                      <Check size={14} /> Record saved! Souls automatically counted.
                    </p>
                  )}
                </div>
              )}

              {!completedDays.includes(selected.day) && selected.day <= currentDay && (
                <button
                  onClick={() => { completeDay(selected.day); setSelectedCard(null); }}
                  className="w-full bg-success text-white py-3 rounded-xl font-semibold hover:bg-success/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Mark as Completed
                </button>
              )}
              {completedDays.includes(selected.day) && (
                <div className="w-full bg-success/10 text-success py-3 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
                  <Check size={18} /> Completed ✓
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
