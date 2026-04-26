-- Winning Souls Database Schema
-- Run this in Supabase SQL Editor (supabase.com > your project > SQL Editor)

-- Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null default '',
  full_name text not null default '',
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  current_day int not null default 1,
  completed_days int[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Souls won
create table if not exists public.souls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  phone text not null default '',
  email text not null default '',
  location text not null default '',
  notes text not null default '',
  follow_up_status text not null default 'pending' check (follow_up_status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz not null default now()
);

-- Testimonies
create table if not exists public.testimonies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  author text not null,
  title text not null,
  content text not null,
  likes int not null default 0,
  created_at timestamptz not null default now()
);

-- Prayers
create table if not exists public.prayers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  author text not null,
  content text not null,
  likes int not null default 0,
  prayer_count int not null default 0,
  created_at timestamptz not null default now()
);

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  title text not null,
  description text not null default '',
  date text not null,
  time text not null,
  location text not null default '',
  type text not null default 'outreach' check (type in ('outreach', 'prayer', 'study', 'crusade')),
  attendees int not null default 0,
  created_at timestamptz not null default now()
);

-- Groups
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  description text not null default '',
  leader text not null,
  members int not null default 1,
  type text not null default 'outreach' check (type in ('outreach', 'prayer', 'campus', 'street')),
  created_at timestamptz not null default now()
);

-- Community Posts
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  author text not null,
  location text not null default '',
  content text not null,
  likes int not null default 0,
  type text not null default 'testimony' check (type in ('testimony', 'report', 'encouragement', 'milestone')),
  created_at timestamptz not null default now()
);

-- Comments (shared across testimonies, prayers, community posts)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  parent_type text not null check (parent_type in ('testimony', 'prayer', 'community', 'daily_share')),
  parent_id uuid not null,
  author text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Daily Records
create table if not exists public.daily_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  day int not null,
  reflection_answers jsonb not null default '{}',
  souls_saved int not null default 0,
  people_prayed_for int not null default 0,
  invitations_to_church int not null default 0,
  contact_info text not null default '',
  healing_testimonies text not null default '',
  created_at timestamptz not null default now(),
  unique(user_id, day)
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.souls enable row level security;
alter table public.testimonies enable row level security;
alter table public.prayers enable row level security;
alter table public.events enable row level security;
alter table public.groups enable row level security;
alter table public.community_posts enable row level security;
alter table public.comments enable row level security;
alter table public.daily_records enable row level security;

-- Profiles: users can read all, update own
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Souls: users can only see/manage their own
create policy "Users can view own souls" on public.souls for select using (auth.uid() = user_id);
create policy "Users can insert own souls" on public.souls for insert with check (auth.uid() = user_id);
create policy "Users can update own souls" on public.souls for update using (auth.uid() = user_id);
create policy "Users can delete own souls" on public.souls for delete using (auth.uid() = user_id);

-- Testimonies: everyone can read, users manage own
create policy "Testimonies are viewable by everyone" on public.testimonies for select using (true);
create policy "Users can insert own testimonies" on public.testimonies for insert with check (auth.uid() = user_id);
create policy "Users can update own testimonies" on public.testimonies for update using (true);

-- Prayers: everyone can read, users manage own
create policy "Prayers are viewable by everyone" on public.prayers for select using (true);
create policy "Users can insert own prayers" on public.prayers for insert with check (auth.uid() = user_id);
create policy "Users can update prayers" on public.prayers for update using (true);

-- Events: everyone can read, users manage own
create policy "Events are viewable by everyone" on public.events for select using (true);
create policy "Users can insert own events" on public.events for insert with check (auth.uid() = user_id);
create policy "Users can update events" on public.events for update using (true);

-- Groups: everyone can read, users manage own
create policy "Groups are viewable by everyone" on public.groups for select using (true);
create policy "Users can insert own groups" on public.groups for insert with check (auth.uid() = user_id);
create policy "Users can update groups" on public.groups for update using (true);

-- Community posts: everyone can read, users manage own
create policy "Community posts are viewable by everyone" on public.community_posts for select using (true);
create policy "Users can insert own community posts" on public.community_posts for insert with check (auth.uid() = user_id);
create policy "Users can update community posts" on public.community_posts for update using (true);

-- Comments: everyone can read, authenticated can insert
create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Users can insert comments" on public.comments for insert with check (auth.uid() = user_id);

-- Daily records: users can only see/manage their own
create policy "Users can view own records" on public.daily_records for select using (auth.uid() = user_id);
create policy "Users can insert own records" on public.daily_records for insert with check (auth.uid() = user_id);
create policy "Users can update own records" on public.daily_records for update using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable realtime for community features
alter publication supabase_realtime add table public.testimonies;
alter publication supabase_realtime add table public.prayers;
alter publication supabase_realtime add table public.community_posts;
alter publication supabase_realtime add table public.comments;
