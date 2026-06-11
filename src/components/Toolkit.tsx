"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  BookOpen, MapPin, Heart, Gift, Sparkles, Star,
  ChevronLeft, ChevronRight, X, Maximize2, Download
} from "lucide-react";

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("ws-favorite-cards");
    return saved ? JSON.parse(saved) : [];
  });

  const toggle = (url: string) => {
    setFavorites(prev => {
      const next = prev.includes(url) ? prev.filter(f => f !== url) : [...prev, url];
      localStorage.setItem("ws-favorite-cards", JSON.stringify(next));
      return next;
    });
  };

  const isFav = (url: string) => favorites.includes(url);

  return { favorites, toggle, isFav };
}

async function downloadImage(url: string, name: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    // Fallback: open in new tab so user can long-press to save
    window.open(url, "_blank");
  }
}

type Section = "scriptures" | "locations" | "gospel" | "bingo" | "gifts";

const sections: { id: Section; label: string; icon: React.ElementType; color: string }[] = [
  { id: "scriptures", label: "Scriptures & Declarations", icon: BookOpen, color: "from-blue-600 to-blue-800" },
  { id: "locations", label: "Conversation Starters", icon: MapPin, color: "from-green-600 to-green-800" },
  { id: "gospel", label: "Gospel Scripts/Tools", icon: Heart, color: "from-purple-600 to-purple-800" },
  { id: "bingo", label: "Acts of Kindness", icon: Sparkles, color: "from-amber-500 to-amber-700" },
  { id: "gifts", label: "Gifts & Giveaways", icon: Gift, color: "from-rose-500 to-rose-700" },
];

const scriptureCards = Array.from({ length: 30 }, (_, i) => `/toolkit/scripture-cards/sc-${String(i + 1).padStart(2, "0")}.jpg`);

const conversationCards = Array.from({ length: 34 }, (_, i) => `/toolkit/conversation-cards/ConversationStarterCard${String(i + 1).padStart(2, "0")}.jpg`);

const bingoImages = [
  "/toolkit/bingo/ActsOfKindnessBingoChalllenge01.jpg",
  "/toolkit/bingo/ActsOfKindnessBingoChalllenge02.jpg",
];

const gospelImage = "/toolkit/gospel-tool/gospel-tool.jpg";

const giftIdeas = [
  { title: "Reusable Water Bottles", desc: "Encourages hydration and reduces plastic waste." },
  { title: "Care Packages with Personal Care Kits", desc: "Include essentials like snacks, first-aid items and toiletries: Travel-sized liquid body wash, bottles of shampoo and conditioner, Toothpaste, Toothbrushes, Deodorant, Razors, Shaving Cream, Moisturizer, Feminine Hygiene (Pads, tampons, or pantyliners), Hand Sanitizer, Facial Wipes, Baby/body wipes, Nail Clippers, Q-tips." },
  { title: "School Supplies", desc: "Provide backpacks filled with notebooks, pens, and art supplies for students." },
  { title: "Healthy Snack Packs", desc: "Offer nutritious snacks for families and children at community events/outreaches." },
  { title: "Gift Cards", desc: "Small gift cards for local grocery stores or restaurants to assist families in need." },
  { title: "Socks", desc: "Warm socks to provide comfort for those experiencing homelessness." },
  { title: "Gardening Kits", desc: "Include seeds, soil, and pots for community gardening projects." },
  { title: "Books", desc: "Distribute books for various age groups to promote literacy and learning." },
  { title: "Activity Kits", desc: "Include craft supplies, puzzles, or games for families to enjoy together." },
  { title: "Cooking Class Kits", desc: "Provide recipes and ingredients to promote healthy eating." },
  { title: "Fitness Gear", desc: "Items like jump ropes, resistance bands, or yoga mats to encourage physical activity." },
  { title: "Bicycle Repair Kits", desc: "Tools and supplies for bike maintenance to promote active transportation." },
  { title: "Community Meal Events", desc: "Host potluck-style meals where everyone brings a dish to share." },
  { title: "Pet Supplies", desc: "Food, toys, or grooming items for families with pets." },
  { title: "Emergency Preparedness Kits", desc: "Flashlights, batteries, and first-aid supplies for community safety." },
  { title: "Local Business Coupons", desc: "Coupons or discounts from local businesses to support the community." },
  { title: "Craft Workshops", desc: "Organize workshops where participants can create their own items to take home." },
  { title: "Seasonal Clothing", desc: "Items like gloves, hats, or sunscreen, depending on the season." },
  { title: "Flat Screen TVs", desc: "Provide entertainment and educational resources for families." },
  { title: "Laptops", desc: "Help students and adults with online learning and job opportunities." },
  { title: "Smartphones (iPhones and Androids)", desc: "Assist individuals in staying connected." },
  { title: "Tablets (iPads)", desc: "Provide devices for educational purposes and entertainment." },
  { title: "Video Game Gift Cards", desc: "Allow youth to enjoy recreational activities." },
  { title: "Bicycles", desc: "Encourage physical activity and provide reliable transportation." },
  { title: "Sports Equipment", desc: "Soccer balls, volleyballs, and other sports gear to promote fitness and community engagement." },
  { title: "Bill Pays", desc: "Rent, Power, Internet, Phone, Water, Food, Car payment/insurance etc." },
];

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const prev = () => setCurrent(c => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent(c => (c === images.length - 1 ? 0 : c + 1));

  return (
    <>
      <div className="relative bg-grey-light rounded-2xl overflow-hidden">
        <div className="relative w-full" style={{ minHeight: 300 }}>
          <Image
            src={images[current]}
            alt={`${title} ${current + 1}`}
            width={800}
            height={1000}
            className="w-full h-auto object-contain"
            priority={current === 0}
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <button
          onClick={() => setFullscreen(true)}
          className="absolute top-3 right-3 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <Maximize2 size={14} />
        </button>
      </div>
      {images.length > 1 && (
        <div className="text-center mt-2">
          <span className="text-grey text-xs font-medium">{current + 1} / {images.length}</span>
        </div>
      )}

      {/* Dot indicators for smaller sets */}
      {images.length > 1 && images.length <= 10 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-grey-medium/40"}`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60" onClick={() => setFullscreen(false)}>
          <div className="relative w-full max-w-lg mt-0" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[current]}
              alt={`${title} ${current + 1}`}
              width={600}
              height={900}
              className="w-full h-auto block"
              priority
            />
            <div className="absolute top-2 left-0 right-0 z-20 flex items-center justify-between px-3">
              <button
                onClick={() => downloadImage(images[current], `${title}-${current + 1}.jpg`)}
                className="flex items-center gap-1 bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                <Download size={12} /> Save
              </button>
              <span className="bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full">{current + 1} / {images.length}</span>
              <button onClick={() => setFullscreen(false)} className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                <X size={14} className="text-white" />
              </button>
            </div>
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function CardGrid({ images, title, favHook }: { images: string[]; title: string; favHook?: ReturnType<typeof useFavorites> }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Lock body scroll when card is open (mobile Safari compatible)
  useEffect(() => {
    if (selectedIndex !== null) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [selectedIndex]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className="group relative rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary/40 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1 active:scale-[0.98]"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-2xl" />
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 translate-y-2 group-hover:translate-y-0">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Card {i + 1}
              </span>
            </div>
            <Image
              src={img}
              alt={`${title} Card ${i + 1}`}
              width={400}
              height={500}
              className="w-full h-auto rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedIndex(null)}>
          <div className="rounded-[24px] max-w-md w-full shadow-2xl overflow-hidden animate-pop-in" onClick={(e) => e.stopPropagation()}>
            {/* Card image — no extra space, image IS the modal */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={selectedIndex}
              src={images[selectedIndex]}
              alt={`${title} Card ${selectedIndex + 1}`}
              className="w-full max-h-[70dvh] object-cover rounded-t-[24px] block"
            />

            {/* Controls bar */}
            <div className="p-4 flex items-center justify-between bg-white rounded-b-[24px]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIndex(i => i !== null ? (i === 0 ? images.length - 1 : i - 1) : null)}
                  className="w-9 h-9 rounded-full bg-grey-light/70 hover:bg-grey-light flex items-center justify-center transition-colors"
                >
                  <ChevronLeft size={18} className="text-dark" />
                </button>
                <button
                  onClick={() => setSelectedIndex(i => i !== null ? (i === images.length - 1 ? 0 : i + 1) : null)}
                  className="w-9 h-9 rounded-full bg-grey-light/70 hover:bg-grey-light flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={18} className="text-dark" />
                </button>
                <span className="text-xs font-bold text-grey ml-1">{selectedIndex + 1} / {images.length}</span>
              </div>
              <div className="flex items-center gap-2">
                {favHook && (
                  <button
                    onClick={() => favHook.toggle(images[selectedIndex])}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${favHook.isFav(images[selectedIndex]) ? "bg-amber-50 text-amber-500" : "bg-grey-light/70 text-grey-dark hover:bg-grey-light"}`}
                  >
                    <Star size={15} fill={favHook.isFav(images[selectedIndex]) ? "currentColor" : "none"} />
                  </button>
                )}
                <button
                  onClick={() => downloadImage(images[selectedIndex], `${title}-Card-${selectedIndex + 1}.jpg`)}
                  className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
                >
                  <Download size={13} /> Save
                </button>
                <button onClick={() => setSelectedIndex(null)} className="w-9 h-9 rounded-full bg-grey-light/70 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const bonusConversationCards = Array.from({ length: 4 }, (_, i) => `/toolkit/conversation-cards/ConversationStarterCard${String(i + 31).padStart(2, "0")}.jpg`);

function GospelToolSection({ favHook }: { favHook?: ReturnType<typeof useFavorites> }) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-5 text-white">
        <Heart size={32} className="mb-2 opacity-80" />
        <h3 className="text-lg font-bold">Gospel Soul-Winning Tool</h3>
        <p className="text-purple-200 text-sm mt-1">Show this to the person you are sharing the Gospel with. Let them read along as you guide them to Christ.</p>
      </div>

      <div className="flex justify-center px-4">
        <button
          onClick={() => setFullscreen(true)}
          className="group relative max-w-md w-full rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] border-2 border-transparent hover:border-purple-400/50"
        >
          <Image
            src={gospelImage}
            alt="Gospel Soul-Winning Tool"
            width={600}
            height={2400}
            className="w-full h-auto rounded-2xl"
            priority
          />
        </button>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex flex-col" onClick={() => setFullscreen(false)}>
          {/* Sticky top bar */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => downloadImage(gospelImage, "Gospel-Soul-Winning-Tool.jpg")}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
            >
              <Download size={13} /> Save
            </button>
            <span className="bg-white/15 text-white text-xs font-bold px-3 py-2 rounded-full">Gospel Tool</span>
            <button onClick={() => setFullscreen(false)} className="w-9 h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors">
              <X size={16} className="text-white" />
            </button>
          </div>
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto flex justify-center px-4 pb-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={gospelImage}
              alt="Gospel Soul-Winning Tool"
              width={600}
              height={2400}
              className="w-full max-w-lg h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Bonus Conversation Starter Cards */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
        <MapPin size={32} className="mb-2 opacity-80" />
        <h3 className="text-lg font-bold">Bonus Conversation Starters</h3>
        <p className="text-indigo-200 text-sm mt-1">4 additional conversation starter scripts to help you lead naturally into sharing the Gospel.</p>
      </div>
      <CardGrid images={bonusConversationCards} title="Bonus Conversation Starter" favHook={favHook} />
    </div>
  );
}

const bingoSquares = [
  "Buy someone coffee", "Write an encouraging note", "Help carry groceries",
  "Pray with a stranger", "Give a genuine compliment", "Share a meal",
  "Visit someone lonely", "Donate clothes", "Hold the door open",
  "Pay for someone's food", "Send a thank-you text", "Offer to pray for someone",
  "FREE SPACE", "Give a Bible", "Invite someone to church",
  "Smile at 10 people", "Clean up litter", "Leave an encouraging tip",
  "Cook for a neighbor", "Forgive someone", "Volunteer your time",
  "Give flowers", "Listen without interrupting", "Share your testimony",
  "Let someone go first",
];

function BingoBoard() {
  const [completed, setCompleted] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    const saved = localStorage.getItem("ws-bingo-completed");
    return saved ? new Set(JSON.parse(saved)) : new Set([12]);
  });

  const toggle = (i: number) => {
    if (i === 12) return;
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      localStorage.setItem("ws-bingo-completed", JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <div className="bg-card rounded-2xl p-4 border border-grey-light">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-dark text-sm">Interactive Bingo</h4>
        <span className="text-xs text-grey font-medium">{completed.size}/25 completed</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {bingoSquares.map((sq, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`aspect-square rounded-lg p-1 flex items-center justify-center text-center transition-all duration-200 ${
              completed.has(i)
                ? "bg-amber-500 text-white scale-95 shadow-inner"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/50"
            }`}
          >
            <span className="text-[9px] leading-tight font-medium line-clamp-3">
              {completed.has(i) && i !== 12 ? "✓" : sq}
            </span>
          </button>
        ))}
      </div>
      <p className="text-grey text-[10px] text-center mt-3">Tap a square when you complete the act of kindness!</p>
    </div>
  );
}

export default function Toolkit() {
  const [activeSection, setActiveSection] = useState<Section>("scriptures");
  const favHook = useFavorites();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-dark">Soul-Winning Toolkit</h2>
        <p className="text-grey mt-1">Use these as you step out today.</p>
      </div>

      {/* Favorites Quick Access */}
      {favHook.favorites.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/50">
          <h4 className="font-bold text-dark text-sm mb-3 flex items-center gap-2">
            <Star size={14} className="text-amber-500" fill="currentColor" /> My Favorites ({favHook.favorites.length})
          </h4>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {favHook.favorites.map((img, i) => (
              <div key={i} className="shrink-0 w-20 h-28 rounded-xl overflow-hidden shadow-md border-2 border-amber-300">
                <Image src={img} alt={`Favorite ${i + 1}`} width={80} height={112} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {sections.map(sec => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === sec.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-card text-grey border border-grey-light hover:border-primary/30"
              }`}
            >
              <Icon size={16} />
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      {activeSection === "scriptures" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
            <BookOpen size={32} className="mb-2 opacity-80" />
            <h3 className="text-lg font-bold">30 Scriptures & Declarations for Miracles and Healing</h3>
            <p className="text-blue-200 text-sm mt-1">Tap any card to view it full-size. Declare them boldly over the people you meet!</p>
          </div>
          <CardGrid images={scriptureCards} title="Scripture Card" favHook={favHook} />
        </div>
      )}

      {activeSection === "locations" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-5 text-white">
            <MapPin size={32} className="mb-2 opacity-80" />
            <h3 className="text-lg font-bold">30 Location Ideas & Conversation Starters</h3>
            <p className="text-green-200 text-sm mt-1">Tap any card to view it full-size. Use these ideas to start meaningful conversations!</p>
          </div>
          <CardGrid images={conversationCards} title="Conversation Starter" favHook={favHook} />
        </div>
      )}

      {activeSection === "gospel" && (
        <GospelToolSection favHook={favHook} />
      )}

      {activeSection === "bingo" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 rounded-2xl p-5 text-white">
            <Sparkles size={32} className="mb-2 opacity-80" />
            <h3 className="text-lg font-bold">Acts of Kindness Bingo Challenge</h3>
            <p className="text-amber-100 text-sm mt-1">Tap a square when you complete an act of kindness. Do it with friends!</p>
          </div>
          <BingoBoard />
          <CardGrid images={bingoImages} title="Bingo Challenge" />
        </div>
      )}

      {activeSection === "gifts" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-5 text-white">
            <Gift size={32} className="mb-2 opacity-80" />
            <h3 className="text-lg font-bold">Gifts & Giveaway Ideas for Outreach</h3>
            <p className="text-indigo-200 text-sm mt-1">Creative ideas for gifts and giveaways to bless people during your outreach events.</p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-grey-light flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">{giftIdeas.length}</div>
              <div>
                <p className="font-bold text-dark text-sm">Total Ideas</p>
                <p className="text-grey text-xs">Tap any card to read more</p>
              </div>
            </div>
            <div className="h-8 w-px bg-grey-light flex-shrink-0" />
            <div className="flex gap-2">
              {[
                { tag: "Essentials", cls: "bg-blue-50 text-blue-600 border-blue-100" },
                { tag: "Education", cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                { tag: "Health", cls: "bg-purple-50 text-purple-600 border-purple-100" },
                { tag: "Tech", cls: "bg-amber-50 text-amber-600 border-amber-100" },
                { tag: "Community", cls: "bg-cyan-50 text-cyan-600 border-cyan-100" },
              ].map(({ tag, cls }) => (
                <span key={tag} className={`${cls} text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap border`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {giftIdeas.map((item, i) => {
              const colors = [
                { bg: "from-blue-50 to-blue-100/50", border: "border-blue-100", badge: "from-blue-500 to-blue-600", hover: "hover:border-blue-300", text: "group-hover:text-blue-700", bar: "from-blue-400 to-blue-600" },
                { bg: "from-emerald-50 to-emerald-100/50", border: "border-emerald-100", badge: "from-emerald-500 to-emerald-600", hover: "hover:border-emerald-300", text: "group-hover:text-emerald-700", bar: "from-emerald-400 to-emerald-600" },
                { bg: "from-purple-50 to-purple-100/50", border: "border-purple-100", badge: "from-purple-500 to-purple-600", hover: "hover:border-purple-300", text: "group-hover:text-purple-700", bar: "from-purple-400 to-purple-600" },
                { bg: "from-amber-50 to-amber-100/50", border: "border-amber-100", badge: "from-amber-500 to-amber-600", hover: "hover:border-amber-300", text: "group-hover:text-amber-700", bar: "from-amber-400 to-amber-600" },
                { bg: "from-rose-50 to-rose-100/50", border: "border-rose-100", badge: "from-rose-500 to-rose-600", hover: "hover:border-rose-300", text: "group-hover:text-rose-700", bar: "from-rose-400 to-rose-600" },
                { bg: "from-cyan-50 to-cyan-100/50", border: "border-cyan-100", badge: "from-cyan-500 to-cyan-600", hover: "hover:border-cyan-300", text: "group-hover:text-cyan-700", bar: "from-cyan-400 to-cyan-600" },
              ];
              const c = colors[i % colors.length];
              return (
                <div
                  key={i}
                  className={`group bg-card rounded-2xl overflow-hidden border-2 border-transparent ${c.hover} shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 cursor-default`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className={`bg-gradient-to-r ${c.bg} px-4 py-3 ${c.border} border-b flex items-center gap-3`}>
                    <span className={`bg-gradient-to-br ${c.badge} text-white w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      {i + 1}
                    </span>
                    <h4 className={`font-bold text-dark text-sm ${c.text} transition-colors duration-300`}>{item.title}</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-grey-dark text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${c.bar} transition-all duration-500`} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
