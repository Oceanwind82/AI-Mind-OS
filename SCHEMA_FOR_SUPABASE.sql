-- 🚀 AI Mind OS - Supabase Schema Activation
-- Copy and paste this ENTIRE content into Supabase SQL Editor and click RUN

-- Converted to PostgreSQL / Supabase compatible SQL
-- Creates tables following Supabase best practices (primary key bigint identity, RLS enabled)
-- 1) profiles linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  profile_flags jsonb DEFAULT '{}'::jsonb,
  xp_multiplier numeric(3,2) DEFAULT 1.00,
  total_xp integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  max_streak integer DEFAULT 0,
  last_activity_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.progress_tracking (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed')),
  completion_percentage integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT uq_progress_tracking UNIQUE(user_id, lesson_id)
);
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  session_id text,
  timestamp timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.achievements (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_data jsonb DEFAULT '{}'::jsonb,
  earned_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Indexes for FKs
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_user_id ON public.progress_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);

-- Public leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    COALESCE(p.display_name, p.username, 'Anonymous') as player_name,
    p.username,
    p.total_xp,
    p.current_streak,
    p.max_streak,
    COUNT(pt.id) as completed_lessons
FROM public.profiles p
LEFT JOIN public.progress_tracking pt ON p.user_id = pt.user_id AND pt.status = 'completed'
GROUP BY p.id, p.display_name, p.username, p.total_xp, p.current_streak, p.max_streak
ORDER BY p.total_xp DESC, p.current_streak DESC
LIMIT 100;

-- Function for updating streaks and XP
CREATE OR REPLACE FUNCTION public.update_user_xp_and_streak(
    p_user_id uuid,
    p_xp_earned integer
) RETURNS void AS $$
DECLARE
    current_date_val date := CURRENT_DATE;
    last_activity date;
    current_streak_val integer;
    max_streak_val integer;
BEGIN
    -- Get current streak and last activity
    SELECT last_activity_date, current_streak, max_streak 
    INTO last_activity, current_streak_val, max_streak_val
    FROM public.profiles 
    WHERE user_id = p_user_id;
    
    -- Update streak logic
    IF last_activity IS NULL OR last_activity < current_date_val - INTERVAL '1 day' THEN
        -- First activity or broken streak
        current_streak_val := 1;
    ELSIF last_activity = current_date_val - INTERVAL '1 day' THEN
        -- Consecutive day
        current_streak_val := current_streak_val + 1;
    END IF;
    
    -- Update max streak if needed
    IF current_streak_val > max_streak_val THEN
        max_streak_val := current_streak_val;
    END IF;
    
    -- Update user profile
    UPDATE public.profiles 
    SET 
        total_xp = total_xp + (p_xp_earned * xp_multiplier),
        current_streak = current_streak_val,
        max_streak = max_streak_val,
        last_activity_date = current_date_val,
        updated_at = now()
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create default RLS policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON public.progress_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.progress_tracking
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics" ON public.analytics_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON public.achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard is public read-only
CREATE POLICY "Leaderboard is public" ON public.leaderboard
    FOR SELECT TO authenticated, anon USING (true);
