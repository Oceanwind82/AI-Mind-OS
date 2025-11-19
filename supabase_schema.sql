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
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'master')),
  stripe_customer_id TEXT,
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_lesson ON ai_usage(user_id, lesson_slug);
CREATE INDEX IF NOT EXISTS idx_ai_usage_reset_date ON ai_usage(reset_date);
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- Example data (optional - for testing)
-- This will be populated automatically when users sign up
