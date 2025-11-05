-- =====================================================
-- AI Mind OS — Minimal v1 Schema (Production Ready)
-- Copy-paste this entire content into Supabase SQL Editor
-- =====================================================

-- Optional: clear any old leaderboard view that might conflict
drop view if exists public.leaderboard cascade;

-- 1) Profiles — one row per user (PK = user_id)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  total_xp integer default 0,
  current_streak integer default 0,
  last_active_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- 2) Lesson progress — 1 row per (user, lesson)
create table if not exists public.progress (
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id text not null,
  status text not null default 'not_started'
    check (status in ('not_started','in_progress','completed')),
  score numeric,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, lesson_id)
);
alter table public.progress enable row level security;

-- Indexes
create index if not exists idx_progress_user on public.progress(user_id);
create index if not exists idx_progress_status on public.progress(status);

-- RLS policies (users can only touch their own rows)
drop policy if exists "profiles select own" on public.profiles;
drop policy if exists "profiles upsert own" on public.profiles;
create policy "profiles select own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles upsert own" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "progress select own" on public.progress;
drop policy if exists "progress upsert own" on public.progress;
create policy "progress select own" on public.progress
  for select using (auth.uid() = user_id);
create policy "progress upsert own" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);