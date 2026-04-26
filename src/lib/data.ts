export interface ChallengeCard {
  day: number;
  title: string;
  theme: string;
  worshipNote: string;
  praiseScripture: string;
  prayer: string;
  keyScripture: string;
  dailyReading: string;
  encouragement: string;
  challenge: string;
  locationSuggestions: string;
  groupActivity: string;
  reflections: string[];
  prayingForSick: string;
}

export { challengeCards } from "./challenges-data";

export const bookDedication = "This book is dedicated to every evangelist, pastor, soul winner, leader, believer, and follower of Jesus Christ who has answered the call to share the Gospel. Whether you are just beginning your journey or have spent decades sharing His Word, this book is for you! May it encourage you to reach others with the love of Christ and challenge you to grow bolder in your evangelism.";

export const bookTestimonials = [
  {
    author: "Jonathan Shuttlesworth",
    title: "Evangelist & Host of Revival Today",
    content: "Bernard has a genuine passion for winning souls. Through bold street preaching and compassionate outreach, he's been a powerful force for the Gospel. His work reminds us of the urgency and joy of leading others to Christ."
  },
  {
    author: "Dr. Kazumba Charles",
    title: "Evangelist & Founder of KiTV Network",
    content: "Bernard's dedication to soul-winning is truly inspiring. His tireless efforts in reaching the lost and training others in evangelism reflect the heart of Jesus. This challenge will ignite a fire in anyone who takes it on!"
  }
];

export interface DailyRecord {
  day: number;
  reflectionAnswers: Record<string, string>;
  soulsSaved: number;
  peoplePrayedFor: number;
  invitationsToChurch: number;
  contactInfo: string;
  healingTestimonies: string;
  date: string;
}

export interface DailyShare {
  id: string;
  day: number;
  dayTitle: string;
  author: string;
  reflectionAnswers: Record<string, string>;
  soulsSaved: number;
  peoplePrayedFor: number;
  invitationsToChurch: number;
  healingTestimonies: string;
  date: string;
  likes: number;
  comments: Comment[];
}

export interface Soul {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  date: string;
  notes: string;
  followUpStatus: "pending" | "in_progress" | "completed";
  addedBy: string;
}

export interface Testimony {
  id: string;
  author: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface PrayerRequest {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  prayerCount: number;
  comments: Comment[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  locationNotes: string;
  type: "outreach" | "prayer" | "study" | "crusade";
  attendees: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  leader: string;
  members: number;
  type: "outreach" | "prayer" | "campus" | "street";
}

export interface CommunityPost {
  id: string;
  author: string;
  location: string;
  content: string;
  date: string;
  likes: number;
  comments: Comment[];
  type: "testimony" | "report" | "encouragement" | "milestone";
}

export const sampleSouls: Soul[] = [];

export const sampleTestimonies: Testimony[] = [];

export const samplePrayers: PrayerRequest[] = [];

export const sampleEvents: Event[] = [];

export const sampleGroups: Group[] = [];

export const sampleCommunityPosts: CommunityPost[] = [];
