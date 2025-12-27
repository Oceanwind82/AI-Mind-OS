'use client';

import React, { useState } from 'react';

interface LessonGenerationRequest {
  title: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  learningObjectives: string[];
  targetAudience: string;
  contentType: 'text' | 'video' | 'audio' | 'interactive' | 'mixed';
  includeExamples: boolean;
  includeExercises: boolean;
  includeQuiz: boolean;
  generateImages: boolean;
  generateAudio: boolean;
  customInstructions?: string;
}

interface GeneratedLesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: {
    introduction: string;
    sections: Array<{
      title: string;
      content: string;
      examples?: string[];
    }>;
    summary: string;
    keyTakeaways: string[];
  };
  metadata: {
    estimatedDuration: number;
    difficulty: string;
    topics: string[];
    prerequisites: string[];
    learningObjectives: string[];
  };
  analytics: {
    generatedAt: Date;
    version: string;
    quality_score: number;
    engagement_prediction: number;
  };
}

const AILessonGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [generationRequest, setGenerationRequest] = useState<LessonGenerationRequest>({
    title: '',
    topic: '',
    difficulty: 'intermediate',
    duration: 30,
    learningObjectives: [''],
    targetAudience: 'AI enthusiasts and professionals',
    contentType: 'mixed',
    includeExamples: true,
    includeExercises: true,
    includeQuiz: true,
    generateImages: false,
    generateAudio: false,
    customInstructions: ''
  });

  const [generatedLessons, setGeneratedLessons] = useState<GeneratedLesson[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [previewLesson, setPreviewLesson] = useState<GeneratedLesson | null>(null);

  // Mock AI lesson generation function
  const generateLesson = async (request: LessonGenerationRequest): Promise<GeneratedLesson> => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progressive generation steps
    const steps = [
      'Analyzing topic and requirements...',
      'Generating lesson structure...',
      'Creating introduction content...',
      'Developing main sections...',
      'Adding examples and exercises...',
      'Generating quiz questions...',
      'Creating visual assets...',
      'Optimizing content quality...',
      'Finalizing lesson...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGenerationProgress(((i + 1) / steps.length) * 100);
    }

    const lesson: GeneratedLesson = {
      id: `lesson_${Date.now()}`,
      title: request.title,
      slug: request.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: `Comprehensive ${request.difficulty} level lesson on ${request.topic}`,
      content: {
        introduction: `Welcome to this ${request.difficulty} level lesson on ${request.topic}. In this session, we'll explore the fundamental concepts, practical applications, and key insights that will help you master this important topic in AI and machine learning.`,
        sections: [
          {
            title: 'Core Concepts',
            content: `Let's start by understanding the fundamental concepts of ${request.topic}. This foundational knowledge will serve as the building blocks for more advanced topics we'll cover later.`,
            examples: request.includeExamples ? [
              `Example 1: Basic implementation of ${request.topic}`,
              `Example 2: Real-world application in industry`,
              `Example 3: Common use cases and scenarios`
            ] : undefined
          },
          {
            title: 'Practical Applications',
            content: `Now let's explore how ${request.topic} is applied in real-world scenarios. Understanding these applications will help you identify opportunities to implement these concepts in your own projects.`,
            examples: request.includeExamples ? [
              'Industry application example',
              'Open-source project implementation',
              'Academic research case study'
            ] : undefined
          },
          {
            title: 'Best Practices',
            content: `To effectively implement ${request.topic}, it's important to follow established best practices. These guidelines will help you avoid common pitfalls and achieve optimal results.`,
            examples: request.includeExamples ? [
              'Performance optimization techniques',
              'Error handling strategies',
              'Scalability considerations'
            ] : undefined
          }
        ],
        summary: `In this lesson, we've covered the essential aspects of ${request.topic}, including core concepts, practical applications, and best practices. You should now have a solid understanding of how to implement and apply these concepts in your own work.`,
        keyTakeaways: [
          `${request.topic} is a powerful technique for improving AI systems`,
          'Proper implementation requires understanding of core concepts',
          'Real-world applications demonstrate practical value',
          'Following best practices ensures optimal results'
        ]
      },
      metadata: {
        estimatedDuration: request.duration,
        difficulty: request.difficulty,
        topics: [request.topic],
        prerequisites: request.difficulty === 'beginner' ? [] : ['Basic AI knowledge', 'Programming fundamentals'],
        learningObjectives: request.learningObjectives.filter(obj => obj.trim() !== '')
      },
      analytics: {
        generatedAt: new Date(),
        version: '1.0',
        quality_score: Math.random() * 0.3 + 0.7, // 0.7-1.0
        engagement_prediction: Math.random() * 0.4 + 0.6 // 0.6-1.0
      }
    };

    setIsGenerating(false);
    setGenerationProgress(100);
    
    // Add to generated lessons
    setGeneratedLessons(prev => [lesson, ...prev]);
    
    return lesson;
  };

  const handleGenerate = async () => {
    if (!generationRequest.title || !generationRequest.topic) {
      alert('Please fill in the required fields');
      return;
    }

    try {
      await generateLesson(generationRequest);
      setActiveTab('results');
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
    }
  };

  const addLearningObjective = () => {
    setGenerationRequest(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
  };

  const updateLearningObjective = (index: number, value: string) => {
    setGenerationRequest(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeLearningObjective = (index: number) => {
    setGenerationRequest(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">🧠</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Lesson Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Harness the power of advanced AI to create comprehensive, engaging lessons tailored to your specific needs and learning objectives.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📄</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{generatedLessons.length}</div>
                <div className="text-sm text-gray-500">Lessons Generated</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">⏱️</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {generatedLessons.reduce((total, lesson) => total + lesson.metadata.estimatedDuration, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Minutes</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {generatedLessons.length > 0 ? Math.round(generatedLessons.reduce((avg, lesson) => avg + lesson.analytics.quality_score, 0) / generatedLessons.length * 100) : 0}%
                </div>
                <div className="text-sm text-gray-500">Avg Quality</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">👥</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">AI</div>
                <div className="text-sm text-gray-500">Powered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'generate', name: 'Generate Lesson', icon: '✨' },
                { id: 'results', name: 'Generated Lessons', icon: '📚' },
                { id: 'analytics', name: 'Analytics', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Generate Tab */}
            {activeTab === 'generate' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your AI-Powered Lesson</h2>
                  <p className="text-gray-600">Fill in the details below to generate a comprehensive lesson using advanced AI</p>
                </div>

                {isGenerating && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <h3 className="text-lg font-semibold text-blue-900">Generating Your Lesson...</h3>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-blue-700">{Math.round(generationProgress)}% complete</p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📝</span> Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Lesson Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={generationRequest.title}
                          onChange={(e) => setGenerationRequest(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter lesson title..."
                        />
                      </div>
                      <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                          Main Topic *
                        </label>
                        <input
                          type="text"
                          id="topic"
                          value={generationRequest.topic}
                          onChange={(e) => setGenerationRequest(prev => ({ ...prev, topic: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., Machine Learning, Neural Networks..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty Level
                          </label>
                          <select
                            id="difficulty"
                            value={generationRequest.difficulty}
                            onChange={(e) => setGenerationRequest(prev => ({ ...prev, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            id="duration"
                            value={generationRequest.duration}
                            onChange={(e) => setGenerationRequest(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            min="5"
                            max="180"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Preferences */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>⚙️</span> Content Preferences
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">
                          Content Type
                        </label>
                        <select
                          id="contentType"
                          value={generationRequest.contentType}
                          onChange={(e) => setGenerationRequest(prev => ({ ...prev, contentType: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="text">Text Only</option>
                          <option value="video">Video-focused</option>
                          <option value="audio">Audio-focused</option>
                          <option value="interactive">Interactive</option>
                          <option value="mixed">Mixed Media</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
                          Target Audience
                        </label>
                        <input
                          type="text"
                          id="audience"
                          value={generationRequest.targetAudience}
                          onChange={(e) => setGenerationRequest(prev => ({ ...prev, targetAudience: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Describe your target audience..."
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="includeExamples"
                            checked={generationRequest.includeExamples}
                            onChange={(e) => setGenerationRequest(prev => ({ ...prev, includeExamples: e.target.checked }))}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeExamples" className="ml-2 block text-sm text-gray-900">
                            Include practical examples
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="includeExercises"
                            checked={generationRequest.includeExercises}
                            onChange={(e) => setGenerationRequest(prev => ({ ...prev, includeExercises: e.target.checked }))}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeExercises" className="ml-2 block text-sm text-gray-900">
                            Include interactive exercises
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="includeQuiz"
                            checked={generationRequest.includeQuiz}
                            onChange={(e) => setGenerationRequest(prev => ({ ...prev, includeQuiz: e.target.checked }))}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeQuiz" className="ml-2 block text-sm text-gray-900">
                            Include knowledge quiz
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="generateImages"
                            checked={generationRequest.generateImages}
                            onChange={(e) => setGenerationRequest(prev => ({ ...prev, generateImages: e.target.checked }))}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="generateImages" className="ml-2 block text-sm text-gray-900">
                            Generate visual diagrams
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="generateAudio"
                            checked={generationRequest.generateAudio}
                            onChange={(e) => setGenerationRequest(prev => ({ ...prev, generateAudio: e.target.checked }))}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="generateAudio" className="ml-2 block text-sm text-gray-900">
                            Generate audio narration
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Objectives */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🎯</span> Learning Objectives
                  </h3>
                  <div className="space-y-3">
                    {generationRequest.learningObjectives.map((objective, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => updateLearningObjective(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder={`Learning objective ${index + 1}...`}
                        />
                        {generationRequest.learningObjectives.length > 1 && (
                          <button
                            onClick={() => removeLearningObjective(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
                          >
                            ❌
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addLearningObjective}
                      className="w-full px-4 py-2 text-purple-600 border-2 border-dashed border-purple-300 rounded-md hover:bg-purple-50 transition-colors"
                    >
                      + Add Learning Objective
                    </button>
                  </div>
                </div>

                {/* Custom Instructions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>💡</span> Custom Instructions (Optional)
                  </h3>
                  <textarea
                    value={generationRequest.customInstructions || ''}
                    onChange={(e) => setGenerationRequest(prev => ({ ...prev, customInstructions: e.target.value }))}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Add any specific instructions or requirements for the lesson generation..."
                  />
                </div>

                {/* Generate Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !generationRequest.title || !generationRequest.topic}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        Generate AI Lesson
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Generated Lessons</h2>
                    <p className="text-gray-600">{generatedLessons.length} lessons created</p>
                  </div>
                </div>

                {generatedLessons.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📚</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons generated yet</h3>
                    <p className="text-gray-500 mb-4">Create your first AI-powered lesson using the Generate tab</p>
                    <button
                      onClick={() => setActiveTab('generate')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Start Creating
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {generatedLessons.map((lesson) => (
                      <div key={lesson.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                            <p className="text-gray-600 mb-3">{lesson.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <span>⏱️</span>
                                {lesson.metadata.estimatedDuration} min
                              </span>
                              <span className="flex items-center gap-1">
                                <span>📊</span>
                                {Math.round(lesson.analytics.quality_score * 100)}% quality
                              </span>
                              <span className="flex items-center gap-1">
                                <span>🎯</span>
                                {lesson.metadata.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPreviewLesson(lesson)}
                            className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <span>👀</span>
                            Preview
                          </button>
                          <button
                            onClick={() => {
                              const dataStr = JSON.stringify(lesson, null, 2);
                              const blob = new Blob([dataStr], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `${lesson.slug}.json`;
                              link.click();
                            }}
                            className="flex-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <span>💾</span>
                            Export
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Analytics</h2>
                  <p className="text-gray-600">Insights and metrics from your generated lessons</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Generation Stats */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📊</span> Generation Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Lessons</span>
                        <span className="font-semibold">{generatedLessons.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Quality Score</span>
                        <span className="font-semibold">
                          {generatedLessons.length > 0 ? Math.round(generatedLessons.reduce((avg, lesson) => avg + lesson.analytics.quality_score, 0) / generatedLessons.length * 100) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Duration</span>
                        <span className="font-semibold">
                          {generatedLessons.reduce((total, lesson) => total + lesson.metadata.estimatedDuration, 0)} min
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Distribution */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🎯</span> Difficulty Levels
                    </h3>
                    <div className="space-y-3">
                      {['beginner', 'intermediate', 'advanced'].map((level) => {
                        const count = generatedLessons.filter(lesson => lesson.metadata.difficulty === level).length;
                        const percentage = generatedLessons.length > 0 ? Math.round((count / generatedLessons.length) * 100) : 0;
                        return (
                          <div key={level}>
                            <div className="flex justify-between mb-1">
                              <span className="capitalize">{level}</span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  level === 'beginner' ? 'bg-green-500' :
                                  level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Popular Topics */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>👥</span> Popular Topics
                    </h3>
                    <div className="space-y-3">
                      {['Prompt Engineering', 'Neural Networks', 'Machine Learning', 'AI Ethics', 'Deep Learning'].map((topic, index) => (
                        <div key={topic} className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-gray-100 rounded text-xs flex items-center justify-center font-medium">
                            #{index + 1}
                          </span>
                          <span className="text-sm">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        {previewLesson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{previewLesson.title}</h2>
                  <button 
                    onClick={() => setPreviewLesson(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                    <p className="text-gray-700">{previewLesson.content.introduction}</p>
                  </div>
                  {previewLesson.content.sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                      <p className="text-gray-700 mb-3">{section.content}</p>
                      {section.examples && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-2">Examples:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {section.examples.map((example, idx) => (
                              <li key={idx} className="text-sm text-blue-700">{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <p className="text-gray-700">{previewLesson.content.summary}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Takeaways</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {previewLesson.content.keyTakeaways.map((takeaway, index) => (
                        <li key={index} className="text-gray-700">{takeaway}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILessonGenerator;
