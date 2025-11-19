import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signInWithProvider = async (provider: 'google' | 'github') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database types
export type PlanTier = 'free' | 'pro' | 'master';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  tier: PlanTier;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIUsage {
  id: string;
  user_id: string;
  lesson_slug: string;
  messages_used: number;
  monthly_total: number;
  reset_date: string;
  created_at: string;
  updated_at: string;
}

// Usage tracking functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

export const updateUserTier = async (userId: string, tier: PlanTier) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      tier,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

export const getAIUsage = async (userId: string, lessonSlug: string): Promise<AIUsage | null> => {
  const { data, error } = await supabase
    .from('ai_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_slug', lessonSlug)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching AI usage:', error);
    return null;
  }
  
  return data;
};

export const incrementAIUsage = async (userId: string, lessonSlug: string) => {
  // First, try to get existing usage
  const existing = await getAIUsage(userId, lessonSlug);
  
  if (existing) {
    // Update existing record
    const { data, error } = await supabase
      .from('ai_usage')
      .update({
        messages_used: existing.messages_used + 1,
        monthly_total: existing.monthly_total + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();
    
    return { data, error };
  } else {
    // Create new record
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1); // First day of next month
    
    const { data, error } = await supabase
      .from('ai_usage')
      .insert({
        user_id: userId,
        lesson_slug: lessonSlug,
        messages_used: 1,
        monthly_total: 1,
        reset_date: nextMonth.toISOString()
      })
      .select()
      .single();
    
    return { data, error };
  }
};

export const canUseAI = async (userId: string, lessonSlug: string): Promise<boolean> => {
  const profile = await getUserProfile(userId);
  if (!profile) return false;
  
  // Pro and Master users have unlimited usage
  if (profile.tier === 'pro' || profile.tier === 'master') {
    return true;
  }
  
  // Free users are limited to 3 messages per lesson
  const usage = await getAIUsage(userId, lessonSlug);
  if (!usage) return true; // New user, allow first usage
  
  return usage.messages_used < 3;
};
