-- 💳 AI Mind OS - SaaS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'master', 'supreme', 'neural')),
  stripe_customer_id TEXT,
  
  -- Mastermind Onboarding System fields
  archetype TEXT CHECK (archetype IN ('visionary', 'strategist', 'executor', 'innovator', 'optimizer', 'disruptor')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  cognitive_score INTEGER DEFAULT 0,
  
  -- Gamification fields
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI usage tracking table
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_slug TEXT NOT NULL,
  messages_used INTEGER DEFAULT 0,
  monthly_total INTEGER DEFAULT 0,
  reset_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one usage record per user per lesson
  UNIQUE(user_id, lesson_slug)
);

-- Create onboarding responses table
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  response TEXT NOT NULL,
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one achievement per user
  UNIQUE(user_id, achievement_id)
);

-- Create certification exams table
CREATE TABLE IF NOT EXISTS certification_exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  questions JSONB NOT NULL, -- Array of exam questions
  passing_score INTEGER NOT NULL DEFAULT 80,
  time_limit INTEGER NOT NULL DEFAULT 60, -- minutes
  price INTEGER DEFAULT 0, -- in cents
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certification attempts table
CREATE TABLE IF NOT EXISTS certification_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  exam_id UUID REFERENCES certification_exams(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL, -- User's answers
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  time_spent INTEGER DEFAULT 0, -- in minutes
  certificate_id UUID, -- Will reference certificates table
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  exam_id UUID REFERENCES certification_exams(id) ON DELETE CASCADE NOT NULL,
  certification_title TEXT NOT NULL,
  student_name TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  credential_id TEXT NOT NULL UNIQUE, -- Public credential ID
  linkedin_share_url TEXT,
  pdf_url TEXT NOT NULL
);

-- Create user progress tracking table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_slug TEXT NOT NULL,
  completion_status TEXT DEFAULT 'not_started' CHECK (completion_status IN ('not_started', 'in_progress', 'completed')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  time_spent INTEGER DEFAULT 0, -- in minutes
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Unique constraint: one progress record per user per lesson
  UNIQUE(user_id, lesson_slug)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_usage_updated_at
  BEFORE UPDATE ON ai_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certification_exams_updated_at
  BEFORE UPDATE ON certification_exams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- AI usage policies
CREATE POLICY "Users can view own AI usage" ON ai_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI usage" ON ai_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI usage" ON ai_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Onboarding responses policies
CREATE POLICY "Users can view own onboarding responses" ON onboarding_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding responses" ON onboarding_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view own achievements" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certification exams policies (public read)
CREATE POLICY "Anyone can view active certification exams" ON certification_exams
  FOR SELECT USING (active = TRUE);

-- Certification attempts policies
CREATE POLICY "Users can view own certification attempts" ON certification_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certification attempts" ON certification_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certificates policies
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates" ON certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certificates can be viewed by credential_id (for public verification)
CREATE POLICY "Public certificate verification" ON certificates
  FOR SELECT USING (TRUE);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_lesson ON ai_usage(user_id, lesson_slug);
CREATE INDEX IF NOT EXISTS idx_ai_usage_reset_date ON ai_usage(reset_date);
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_archetype ON profiles(archetype);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user ON onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_certification_attempts_user ON certification_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_certification_attempts_exam ON certification_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_credential ON certificates(credential_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_lesson ON user_progress(user_id, lesson_slug);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(completion_status);

-- Example data (optional - for testing)
-- This will be populated automatically when users sign up

-- Insert sample certification exam
INSERT INTO certification_exams (
  title,
  description,
  questions,
  passing_score,
  time_limit,
  price,
  active
) VALUES (
  'AI Mind OS Fundamentals',
  'Master the fundamentals of AI Mind OS and cognitive transformation',
  '[
    {
      "id": "q1",
      "question": "What is the primary purpose of AI Mind OS?",
      "options": ["Entertainment", "Cognitive transformation", "Data analysis", "Social networking"],
      "correctAnswer": 1,
      "explanation": "AI Mind OS is designed for cognitive transformation and mind enhancement."
    },
    {
      "id": "q2", 
      "question": "Which archetype focuses on long-term vision and innovation?",
      "options": ["Executor", "Visionary", "Optimizer", "Strategist"],
      "correctAnswer": 1,
      "explanation": "The Visionary archetype is characterized by long-term thinking and innovative vision."
    }
  ]'::jsonb,
  80,
  30,
  0,
  TRUE
) ON CONFLICT DO NOTHING;

-- Function to calculate user level based on XP
CREATE OR REPLACE FUNCTION calculate_level(xp_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level calculation: level = floor(sqrt(xp / 100)) + 1
  RETURN FLOOR(SQRT(xp_points / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to award achievement
CREATE OR REPLACE FUNCTION award_achievement(
  p_user_id UUID,
  p_achievement_id TEXT,
  p_title TEXT,
  p_description TEXT,
  p_points INTEGER DEFAULT 0
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO achievements (user_id, achievement_type, achievement_id, title, description, points)
  VALUES (p_user_id, 'milestone', p_achievement_id, p_title, p_description, p_points)
  ON CONFLICT (user_id, achievement_id) DO NOTHING;
  
  -- Update user XP
  UPDATE profiles 
  SET xp = xp + p_points,
      level = calculate_level(xp + p_points)
  WHERE id = p_user_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
