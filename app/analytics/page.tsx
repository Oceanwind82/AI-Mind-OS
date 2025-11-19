'use client';

import { useState, useEffect } from 'react';

interface RealTimeMetrics {
  activeUsers: number;
  concurrent_sessions: number;
  lessons_in_progress: number;
  certifications_active: number;
  ai_interactions_per_minute: number;
  revenue_per_hour: number;
  top_performing_content: string[];
  user_satisfaction_score: number;
}

interface RevenueAnalytics {
  daily_revenue: number;
  monthly_recurring_revenue: number;
  customer_lifetime_value: number;
  churn_rate: number;
  conversion_rate: number;
  average_order_value: number;
  subscription_growth_rate: number;
  revenue_by_country: Record<string, number>;
  revenue_by_plan: Record<string, number>;
}

interface AIAnalytics {
  total_ai_interactions: number;
  average_response_time: number;
  user_satisfaction_rating: number;
  most_asked_questions: Array<{ question: string; count: number }>;
  ai_accuracy_score: number;
  language_usage_distribution: Record<string, number>;
  topic_popularity: Record<string, number>;
  prompt_effectiveness_score: number;
}

interface LearningAnalytics {
  completion_rates_by_lesson: Record<string, number>;
  average_time_per_lesson: Record<string, number>;
  certification_pass_rates: Record<string, number>;
  learning_path_effectiveness: Record<string, number>;
  knowledge_retention_score: number;
  skill_progression_rate: number;
  preferred_learning_times: Record<string, number>;
}

interface AnalyticsData {
  realtime: RealTimeMetrics;
  revenue: RevenueAnalytics;
  ai: AIAnalytics;
  learning: LearningAnalytics;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'realtime' | 'revenue' | 'ai' | 'learning'>('overview');

  useEffect(() => {
    fetchAnalytics();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics Unavailable</h2>
          <p className="text-gray-600">Unable to load analytics data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time insights into your AI Mind OS empire</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              <button
                onClick={fetchAnalytics}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '🎯 Overview', icon: '🎯' },
              { id: 'realtime', label: '⚡ Real-time', icon: '⚡' },
              { id: 'revenue', label: '💰 Revenue', icon: '💰' },
              { id: 'ai', label: '🧠 AI Analytics', icon: '🧠' },
              { id: 'learning', label: '🎓 Learning', icon: '🎓' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'realtime' | 'revenue' | 'ai' | 'learning')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'realtime' && <RealtimeTab data={data.realtime} />}
        {activeTab === 'revenue' && <RevenueTab data={data.revenue} />}
        {activeTab === 'ai' && <AITab data={data.ai} />}
        {activeTab === 'learning' && <LearningTab data={data.learning} />}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={data.realtime.activeUsers}
          icon="👥"
          color="blue"
          trend="+12.5%"
        />
        <MetricCard
          title="Daily Revenue"
          value={`$${data.revenue.daily_revenue.toFixed(2)}`}
          icon="💰"
          color="green"
          trend="+8.3%"
        />
        <MetricCard
          title="AI Interactions"
          value={data.ai.total_ai_interactions}
          icon="🧠"
          color="purple"
          trend="+15.7%"
        />
        <MetricCard
          title="Satisfaction Score"
          value={`${data.realtime.user_satisfaction_score.toFixed(1)}/5`}
          icon="⭐"
          color="yellow"
          trend="+2.1%"
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickStatsCard
          title="🚀 Performance Highlights"
          stats={[
            { label: 'Concurrent Sessions', value: data.realtime.concurrent_sessions },
            { label: 'Lessons in Progress', value: data.realtime.lessons_in_progress },
            { label: 'Active Certifications', value: data.realtime.certifications_active },
            { label: 'AI Interactions/min', value: data.realtime.ai_interactions_per_minute.toFixed(1) },
          ]}
        />
        <QuickStatsCard
          title="💼 Business Metrics"
          stats={[
            { label: 'Monthly Recurring Revenue', value: `$${data.revenue.monthly_recurring_revenue.toFixed(0)}` },
            { label: 'Customer Lifetime Value', value: `$${data.revenue.customer_lifetime_value.toFixed(0)}` },
            { label: 'Conversion Rate', value: `${data.revenue.conversion_rate.toFixed(1)}%` },
            { label: 'Churn Rate', value: `${data.revenue.churn_rate.toFixed(1)}%` },
          ]}
        />
      </div>
    </div>
  );
}

// Real-time Tab Component
function RealtimeTab({ data }: { data: RealTimeMetrics }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RealtimeCard title="Active Users" value={data.activeUsers} icon="👥" />
        <RealtimeCard title="Live Sessions" value={data.concurrent_sessions} icon="🔴" />
        <RealtimeCard title="Lessons Active" value={data.lessons_in_progress} icon="📚" />
        <RealtimeCard title="Certifications" value={data.certifications_active} icon="🎓" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Live Activity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">AI Interactions/min</span>
              <span className="font-bold text-blue-600">{data.ai_interactions_per_minute.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue/hour</span>
              <span className="font-bold text-green-600">${data.revenue_per_hour.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Satisfaction Score</span>
              <span className="font-bold text-yellow-600">{data.user_satisfaction_score.toFixed(1)}/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Top Performing Content</h3>
          <div className="space-y-3">
            {data.top_performing_content.slice(0, 5).map((content, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{content}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Revenue Tab Component
function RevenueTab({ data }: { data: RevenueAnalytics }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Daily Revenue" value={`$${data.daily_revenue.toFixed(2)}`} icon="💰" color="green" />
        <MetricCard title="Monthly MRR" value={`$${data.monthly_recurring_revenue.toFixed(0)}`} icon="📈" color="blue" />
        <MetricCard title="Customer LTV" value={`$${data.customer_lifetime_value.toFixed(0)}`} icon="👤" color="purple" />
        <MetricCard title="Growth Rate" value={`${data.subscription_growth_rate.toFixed(1)}%`} icon="🚀" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Revenue by Plan</h3>
          <div className="space-y-3">
            {Object.entries(data.revenue_by_plan).map(([plan, revenue]) => (
              <div key={plan} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{plan}</span>
                <span className="font-bold text-green-600">${revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🌍 Revenue by Country</h3>
          <div className="space-y-3">
            {Object.entries(data.revenue_by_country)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([country, revenue]) => (
              <div key={country} className="flex justify-between items-center">
                <span className="text-gray-600">{country}</span>
                <span className="font-bold text-blue-600">${revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Tab Component
function AITab({ data }: { data: AIAnalytics }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Interactions" value={data.total_ai_interactions} icon="🧠" color="purple" />
        <MetricCard title="Avg Response Time" value={`${data.average_response_time.toFixed(0)}ms`} icon="⚡" color="blue" />
        <MetricCard title="Satisfaction Rating" value={`${data.user_satisfaction_rating.toFixed(1)}/5`} icon="⭐" color="yellow" />
        <MetricCard title="Accuracy Score" value={`${data.ai_accuracy_score.toFixed(1)}%`} icon="🎯" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">❓ Most Asked Questions</h3>
          <div className="space-y-3">
            {data.most_asked_questions.slice(0, 5).map((qa, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-700 text-sm">{qa.question}</p>
                <span className="text-xs text-gray-500">{qa.count} times asked</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🌐 Language Distribution</h3>
          <div className="space-y-3">
            {Object.entries(data.language_usage_distribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([lang, count]) => (
              <div key={lang} className="flex justify-between items-center">
                <span className="text-gray-600 uppercase">{lang}</span>
                <span className="font-bold text-purple-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Learning Tab Component
function LearningTab({ data }: { data: LearningAnalytics }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Retention Score" value={`${data.knowledge_retention_score.toFixed(1)}%`} icon="🧠" color="purple" />
        <MetricCard title="Progression Rate" value={`${data.skill_progression_rate.toFixed(1)}`} icon="📈" color="blue" />
        <MetricCard title="Avg Completion" value={`${Object.values(data.completion_rates_by_lesson).reduce((a, b) => a + b, 0) / Object.values(data.completion_rates_by_lesson).length || 0}%`} icon="✅" color="green" />
        <MetricCard title="Avg Pass Rate" value={`${Object.values(data.certification_pass_rates).reduce((a, b) => a + b, 0) / Object.values(data.certification_pass_rates).length || 0}%`} icon="🎓" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Lesson Completion Rates</h3>
          <div className="space-y-3">
            {Object.entries(data.completion_rates_by_lesson)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([lesson, rate]) => (
              <div key={lesson} className="flex justify-between items-center">
                <span className="text-gray-600">{lesson}</span>
                <span className="font-bold text-green-600">{rate.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🕒 Preferred Learning Times</h3>
          <div className="space-y-3">
            {Object.entries(data.preferred_learning_times)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([time, count]) => (
              <div key={time} className="flex justify-between items-center">
                <span className="text-gray-600">{time}</span>
                <span className="font-bold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility Components
function MetricCard({ title, value, icon, color, trend }: {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'yellow';
  trend?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-green-600 text-sm mt-1">
              <span className="font-medium">{trend}</span> from last period
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickStatsCard({ title, stats }: {
  title: string;
  stats: Array<{ label: string; value: string | number }>;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600">{stat.label}</span>
            <span className="font-bold text-gray-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RealtimeCard({ title, value, icon }: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-green-600 text-sm">Live</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
