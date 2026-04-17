"use client";

import {
  Home, Map, CalendarDays, Users, MoreHorizontal,
  BookOpen, Heart, MessageCircle, Globe, Award,
  UserPlus, HandHeart, ChevronLeft, Menu, X, Wrench
} from "lucide-react";
import { useState } from "react";

export type Page =
  | "dashboard"
  | "challenges"
  | "souls"
  | "followup"
  | "prayer"
  | "testimonies"
  | "events"
  | "groups"
  | "community"
  | "toolkit"
  | "comingsoon";

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const bottomNavItems: { icon: React.ElementType; label: string; page: Page }[] = [
  { icon: Home, label: "Home", page: "dashboard" },
  { icon: BookOpen, label: "Challenge", page: "challenges" },
  { icon: UserPlus, label: "Souls", page: "souls" },
  { icon: CalendarDays, label: "Events", page: "events" },
  { icon: MoreHorizontal, label: "More", page: "community" },
];

const moreMenuItems: { icon: React.ElementType; label: string; page: Page }[] = [
  { icon: Home, label: "Dashboard", page: "dashboard" },
  { icon: BookOpen, label: "30-Day Challenge", page: "challenges" },
  { icon: UserPlus, label: "Log Souls", page: "souls" },
  { icon: HandHeart, label: "Follow Up", page: "followup" },
  { icon: Heart, label: "Prayer Wall", page: "prayer" },
  { icon: MessageCircle, label: "Testimonies", page: "testimonies" },
  { icon: CalendarDays, label: "Events", page: "events" },
  { icon: Users, label: "Groups & Teams", page: "groups" },
  { icon: Globe, label: "Community", page: "community" },
  { icon: Wrench, label: "Evangelism Toolkit", page: "toolkit" },
  { icon: Award, label: "Coming Soon", page: "comingsoon" },
];

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark text-white fixed left-0 top-0 h-full z-40">
        <div className="p-6 border-b border-dark-light">
          <h1 className="text-xl font-bold text-primary-light flex items-center gap-2">
            <span className="text-2xl">✝</span> Winning Souls
          </h1>
          <p className="text-xs text-grey mt-1">30-Day Soul Winning Challenge</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {moreMenuItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all ${
                  active
                    ? "bg-primary text-white border-r-4 border-primary-light"
                    : "text-grey-medium hover:bg-dark-light hover:text-white"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-dark-light">
          <div className="bg-primary/20 rounded-lg p-3 text-center">
            <Award size={24} className="text-warning mx-auto mb-1" />
            <p className="text-xs text-grey-medium">Bible School Scholarship</p>
            <p className="text-[10px] text-primary-light">COMING SOON</p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-dark text-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-1">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-primary-light flex items-center gap-2">
          <span>✝</span> Winning Souls
        </h1>
        <div className="w-8" />
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-dark text-white animate-slide-in">
            <div className="p-4 flex items-center justify-between border-b border-dark-light">
              <h1 className="text-lg font-bold text-primary-light">✝ Winning Souls</h1>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} className="text-grey" />
              </button>
            </div>
            <nav className="py-4">
              {moreMenuItems.map(item => {
                const Icon = item.icon;
                const active = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => { onNavigate(item.page); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all ${
                      active
                        ? "bg-primary text-white"
                        : "text-grey-medium hover:bg-dark-light hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-grey-medium/30 px-2 py-1 flex items-center justify-around">
        {bottomNavItems.map(item => {
          const Icon = item.icon;
          const isMore = item.page === "community";
          const active = isMore
            ? !["dashboard", "challenges", "souls", "events"].includes(currentPage)
            : currentPage === item.page;

          return (
            <button
              key={item.label}
              onClick={() => {
                if (isMore) {
                  setMoreOpen(!moreOpen);
                } else {
                  setMoreOpen(false);
                  onNavigate(item.page);
                }
              }}
              className={`flex flex-col items-center py-1 px-3 text-[11px] transition-colors ${
                active ? "text-primary" : "text-grey"
              }`}
            >
              <Icon size={22} />
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* More Menu Popup (Mobile) */}
      {moreOpen && (
        <div className="lg:hidden fixed bottom-16 right-2 z-50 bg-white rounded-xl shadow-2xl border border-grey-light p-2 w-56 animate-slide-up">
          {moreMenuItems.filter(i => !["dashboard", "challenges", "souls", "events"].includes(i.page)).map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                onClick={() => { onNavigate(item.page); setMoreOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
                  currentPage === item.page ? "bg-primary/10 text-primary" : "text-dark hover:bg-grey-light"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
