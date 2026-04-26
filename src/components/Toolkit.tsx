"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BookOpen, MapPin, Heart, Gift, Sparkles,
  ChevronLeft, ChevronRight, X, Maximize2, Download
} from "lucide-react";

function downloadImage(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

type Section = "scriptures" | "locations" | "gospel" | "bingo" | "gifts";

const sections: { id: Section; label: string; icon: React.ElementType; color: string }[] = [
  { id: "scriptures", label: "Scriptures & Declarations", icon: BookOpen, color: "from-blue-600 to-blue-800" },
  { id: "locations", label: "Conversation Starters", icon: MapPin, color: "from-green-600 to-green-800" },
  { id: "gospel", label: "Gospel Tool", icon: Heart, color: "from-purple-600 to-purple-800" },
  { id: "bingo", label: "Kindness Bingo", icon: Sparkles, color: "from-amber-500 to-amber-700" },
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
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center" onClick={() => setFullscreen(false)}>
          <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30">
            <X size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); downloadImage(images[current], `${title}-${current + 1}.jpg`); }}
            className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30 backdrop-blur-sm"
          >
            <Download size={16} /> Save
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 py-14 px-2" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[current]}
              alt={`${title} ${current + 1}`}
              width={1200}
              height={1600}
              className="max-w-full max-h-[85vh] object-contain"
            />
            <span className="text-white text-xs font-semibold bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full">
              {current + 1} / {images.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

function CardGrid({ images, title }: { images: string[]; title: string }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in overflow-auto"
          onClick={() => setSelectedIndex(null)}
        >
          <button className="absolute top-4 right-4 z-10 w-11 h-11 bg-white/15 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20">
            <X size={22} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); downloadImage(images[selectedIndex], `${title}-Card-${selectedIndex + 1}.jpg`); }}
            className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/15 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
          >
            <Download size={16} /> Save
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(i => i !== null ? (i === 0 ? images.length - 1 : i - 1) : null); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10 backdrop-blur-sm border border-white/20"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(i => i !== null ? (i === images.length - 1 ? 0 : i + 1) : null); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10 backdrop-blur-sm border border-white/20"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 py-14 px-2" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedIndex]}
              alt={`${title} Card ${selectedIndex + 1}`}
              width={800}
              height={1000}
              className="max-w-full max-h-[85vh] object-contain"
            />
            <span className="text-white text-xs font-semibold bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full">
              {selectedIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

function GospelToolSection() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-5 text-white">
        <Heart size={32} className="mb-2 opacity-80" />
        <h3 className="text-lg font-bold">Gospel Soul-Winning Tool</h3>
        <p className="text-purple-200 text-sm mt-1">Show this to the person you are sharing the Gospel with. Let them read along as you guide them to Christ.</p>
      </div>

      <div className="flex justify-center px-4">
        <button
          onClick={() => setFullscreen(true)}
          className="group relative max-w-md w-full rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] border-2 border-transparent hover:border-purple-400/50"
        >
          <Image
            src={gospelImage}
            alt="Gospel Soul-Winning Tool"
            width={600}
            height={1200}
            className="w-full h-auto rounded-2xl"
            priority
          />
        </button>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in overflow-auto"
          onClick={() => setFullscreen(false)}
        >
          <button className="absolute top-4 right-4 z-10 w-11 h-11 bg-white/15 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20">
            <X size={22} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); downloadImage(gospelImage, "Gospel-Soul-Winning-Tool.jpg"); }}
            className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/15 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
          >
            <Download size={16} /> Save
          </button>
          <div className="absolute inset-0 flex flex-col items-center justify-center py-14 px-2" onClick={(e) => e.stopPropagation()}>
            <Image
              src={gospelImage}
              alt="Gospel Soul-Winning Tool"
              width={800}
              height={1600}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Toolkit() {
  const [activeSection, setActiveSection] = useState<Section>("scriptures");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-dark">Evangelism Toolkit</h2>
        <p className="text-grey mt-1">Resources to guide you as you go out for evangelism</p>
      </div>

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
          <CardGrid images={scriptureCards} title="Scripture Card" />
        </div>
      )}

      {activeSection === "locations" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-5 text-white">
            <MapPin size={32} className="mb-2 opacity-80" />
            <h3 className="text-lg font-bold">30 Location Ideas & Conversation Starters</h3>
            <p className="text-green-200 text-sm mt-1">Tap any card to view it full-size. Use these ideas to start meaningful conversations!</p>
          </div>
          <CardGrid images={conversationCards} title="Conversation Starter" />
        </div>
      )}

      {activeSection === "gospel" && (
        <GospelToolSection />
      )}

      {activeSection === "bingo" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 rounded-2xl p-5 text-white">
            <Sparkles size={32} className="mb-2 opacity-80" />
            <h3 className="text-lg font-bold">Bonus Acts of Kindness Bingo Challenge</h3>
            <p className="text-amber-100 text-sm mt-1">Complete acts of kindness and mark them off! A fun way to spread love in your community.</p>
          </div>
          <CardGrid images={bingoImages} title="Bingo Challenge" />
        </div>
      )}

      {activeSection === "gifts" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-rose-500 to-rose-700 rounded-2xl p-5 text-white">
            <Gift size={32} className="mb-2 opacity-80" />
            <h3 className="text-lg font-bold">Gifts & Giveaway Ideas for Outreach</h3>
            <p className="text-rose-200 text-sm mt-1">Creative ideas for gifts and giveaways to bless people during your outreach events.</p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-grey-light flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm">{giftIdeas.length}</div>
              <div>
                <p className="font-bold text-dark text-sm">Total Ideas</p>
                <p className="text-grey text-xs">Tap any card to read more</p>
              </div>
            </div>
            <div className="h-8 w-px bg-grey-light flex-shrink-0" />
            <div className="flex gap-2">
              {["Essentials", "Education", "Health", "Tech", "Community"].map((tag) => (
                <span key={tag} className="bg-rose-50 text-rose-600 text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap border border-rose-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {giftIdeas.map((item, i) => (
              <div
                key={i}
                className="group bg-card rounded-2xl overflow-hidden border-2 border-transparent hover:border-rose-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 cursor-default"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="bg-gradient-to-r from-rose-50 to-rose-100/50 px-4 py-3 border-b border-rose-100 flex items-center gap-3">
                  <span className="bg-gradient-to-br from-rose-500 to-rose-600 text-white w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {i + 1}
                  </span>
                  <h4 className="font-bold text-dark text-sm group-hover:text-rose-700 transition-colors duration-300">{item.title}</h4>
                </div>
                <div className="p-4">
                  <p className="text-grey-dark text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
