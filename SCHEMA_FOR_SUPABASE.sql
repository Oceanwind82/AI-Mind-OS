-- =====================================================
-- AI Mind OS — Supabase Schema (Fixed + RLS-safe)
-- Run as 'postgres' in Supabase SQL editor
-- =====================================================

-- 0) Helpers for idempotent policy creation
create or replace function public._create_policy_if_not_exists(
  p_name text, p_table regclass, p_cmd text, p_qual text, p_with text default null
) returns void language plpgsql as $$
begin
  perform 1 from pg_policies where schemaname = split_part(p_table::text,'.',1)
    and tablename = split_part(p_table::text,'.',2)
    and policyname = p_name;
  if not found then
    execute format(
      'create policy %I on %s for %s using (%s)%s',
      p_name, p_table, p_cmd, p_qual,
      case when p_with is null then '' else format(' with check (%s)', p_with) end
    );
  end if;
end $$;

-- 1) Core tables -------------------------------------------------------------

create table if not exists public.profiles (
  id bigserial primary key,
  user_id uuid unique references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  profile_flags jsonb default '{}'::jsonb,
  xp_multiplier numeric(3,2) default 1.00 check (xp_multiplier > 0),
  total_xp integer default 0,
  current_streak integer default 0,
  max_streak integer default 0,
  last_activity_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

create table if not exists public.progress_tracking (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id text not null,
  status text default 'not_started' check (status in ('not_started','in_progress','completed')),
  completion_percentage integer default 0,
  xp_earned integer default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint uq_progress_tracking unique (user_id, lesson_id)
);
alter table public.progress_tracking enable row level security;

create table if not exists public.analytics_events (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  event_data jsonb default '{}'::jsonb,
  session_id text,
  "timestamp" timestamptz default now(),
  created_at timestamptz default now()
);
alter table public.analytics_events enable row level security;

create table if not exists public.achievements (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  achievement_type text not null,
  achievement_data jsonb default '{}'::jsonb,
  earned_at timestamptz default now(),
  created_at timestamptz default now()
);
alter table public.achievements enable row level security;

-- Indexes
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_progress_tracking_user_id on public.progress_tracking(user_id);
create index if not exists idx_analytics_events_user_id on public.analytics_events(user_id);
create index if not exists idx_achievements_user_id on public.achievements(user_id);

-- Drop existing view to handle column name changes (PostgreSQL limitation)
drop view if exists public.leaderboard cascade;
-- 2) Leaderboard view (no RLS on views) -------------------------------------

create view public.leaderboard as
select
  coalesce(p.display_name, p.username, 'Anonymous') as player_name,
  p.username,
  p.total_xp,
  p.current_streak,
  p.max_streak,
  count(pt.id) as completed_lessons
from public.profiles p
left join public.progress_tracking pt
  on p.user_id = pt.user_id and pt.status = 'completed'
group by p.id, p.display_name, p.username, p.total_xp, p.current_streak, p.max_streak
order by p.total_xp desc, p.current_streak desc
limit 100;

-- Grant read access to the view (RLS does not apply to views; base-table RLS still applies)
grant usage on schema public to anon, authenticated;
grant select on public.leaderboard to anon, authenticated;

-- NOTE: Because base tables have RLS, rows visible via the view still depend on the caller's row access.
-- For a truly public leaderboard, see the optional section at the end.

-- 3) Streak/XP function (fixed type cast) -----------------------------------

create or replace function public.update_user_xp_and_streak(
  p_user_id uuid,
  p_xp_earned integer
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_date_val date := current_date;
  last_activity date;
  current_streak_val integer := 0;
  max_streak_val integer := 0;
begin
  select
    (last_activity_date::date),
    coalesce(current_streak, 0),
    coalesce(max_streak, 0)
  into last_activity, current_streak_val, max_streak_val
  from public.profiles
  where user_id = p_user_id;

  -- Update streak logic
  if last_activity is null then
    current_streak_val := 1;
  elsif last_activity = current_date_val then
    -- already counted today; keep streak as-is
    current_streak_val := current_streak_val;
  elsif last_activity = (current_date_val - 1) then
    current_streak_val := current_streak_val + 1;
  else
    current_streak_val := 1;
  end if;

  if current_streak_val > max_streak_val then
    max_streak_val := current_streak_val;
  end if;

  update public.profiles
  set
    total_xp = total_xp + (p_xp_earned * xp_multiplier)::int, -- FIX: cast numeric → int
    current_streak = current_streak_val,
    max_streak = max_streak_val,
    last_activity_date = current_date_val::timestamptz,
    updated_at = now()
  where user_id = p_user_id;
end;
$$;

-- 4) RLS Policies (idempotent) ----------------------------------------------

-- profiles
select public._create_policy_if_not_exists(
  'Users can view own profile', 'public.profiles', 'select', 'auth.uid() = user_id'
);
select public._create_policy_if_not_exists(
  'Users can update own profile', 'public.profiles', 'update', 'auth.uid() = user_id', 'auth.uid() = user_id'
);
select public._create_policy_if_not_exists(
  'Users can insert own profile', 'public.profiles', 'insert', 'true', 'auth.uid() = user_id'
);

-- progress_tracking
select public._create_policy_if_not_exists(
  'Users can view own progress', 'public.progress_tracking', 'select', 'auth.uid() = user_id'
);
select public._create_policy_if_not_exists(
  'Users can insert own progress', 'public.progress_tracking', 'insert', 'true', 'auth.uid() = user_id'
);
select public._create_policy_if_not_exists(
  'Users can update own progress', 'public.progress_tracking', 'update', 'auth.uid() = user_id', 'auth.uid() = user_id'
);
select public._create_policy_if_not_exists(
  'Users can delete own progress', 'public.progress_tracking', 'delete', 'auth.uid() = user_id'
);

-- analytics_events
select public._create_policy_if_not_exists(
  'Users can view own analytics', 'public.analytics_events', 'select', 'auth.uid() = user_id'
);
select public._create_policy_if_not_exists(
  'Users can insert own analytics', 'public.analytics_events', 'insert', 'true', 'auth.uid() = user_id'
);

-- achievements
select public._create_policy_if_not_exists(
  'Users can view own achievements', 'public.achievements', 'select', 'auth.uid() = user_id'
);
select public._create_policy_if_not_exists(
  'Users can insert own achievements', 'public.achievements', 'insert', 'true', 'auth.uid() = user_id'
);

-- (REMOVED) ❌ "Leaderboard is public" RLS on a view — not allowed, causes error.

-- 5) Optional: updated_at auto-touch (nice-to-have)
do $$
begin
  if not exists (select 1 from pg_proc where proname = 'trigger_set_timestamp') then
    create function public.trigger_set_timestamp() returns trigger language plpgsql as $f$
    begin
      new.updated_at = now();
      return new;
    end $f$;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'set_timestamp_profiles') then
    create trigger set_timestamp_profiles before update on public.profiles
    for each row execute function public.trigger_set_timestamp();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'set_timestamp_progress') then
    create trigger set_timestamp_progress before update on public.progress_tracking
    for each row execute function public.trigger_set_timestamp();
  end if;
end $$;
