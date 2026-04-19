export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
          current_day: number;
          completed_days: number[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      souls: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          email: string;
          location: string;
          notes: string;
          follow_up_status: "pending" | "in_progress" | "completed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["souls"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["souls"]["Row"]>;
      };
      testimonies: {
        Row: {
          id: string;
          user_id: string;
          author: string;
          title: string;
          content: string;
          likes: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonies"]["Row"], "id" | "likes" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["testimonies"]["Row"]>;
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          parent_type: "testimony" | "prayer" | "community" | "daily_share";
          parent_id: string;
          author: string;
          content: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["comments"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["comments"]["Row"]>;
      };
      prayers: {
        Row: {
          id: string;
          user_id: string;
          author: string;
          content: string;
          likes: number;
          prayer_count: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["prayers"]["Row"], "id" | "likes" | "prayer_count" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["prayers"]["Row"]>;
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          date: string;
          time: string;
          location: string;
          type: "outreach" | "prayer" | "study" | "crusade";
          attendees: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "id" | "attendees" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
      };
      groups: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          leader: string;
          members: number;
          type: "outreach" | "prayer" | "campus" | "street";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["groups"]["Row"], "id" | "members" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["groups"]["Row"]>;
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          author: string;
          location: string;
          content: string;
          likes: number;
          type: "testimony" | "report" | "encouragement" | "milestone";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["community_posts"]["Row"], "id" | "likes" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["community_posts"]["Row"]>;
      };
      daily_records: {
        Row: {
          id: string;
          user_id: string;
          day: number;
          reflection_answers: Record<string, string>;
          souls_saved: number;
          people_prayed_for: number;
          invitations_to_church: number;
          contact_info: string;
          healing_testimonies: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["daily_records"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["daily_records"]["Row"]>;
      };
    };
  };
}
