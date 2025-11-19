'use client';

import React, { useState, useEffect } from 'react';
import { ragVectorSearch, SearchResult, RAGResponse, VectorDocument } from '../../../lib/rag-vector-search';

interface RAGStats {
  totalDocuments: number;
  lastIndexUpdate: Date;
  documentTypes: Record<string, number>;
  difficultyLevels: Record<string, number>;
  topTopics: Array<{ topic: string; count: number }>;
}

const RAGVectorSearchAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [ragResponse, setRAGResponse] = useState<RAGResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState<RAGStats | null>(null);
  const [newDocument, setNewDocument] = useState({
    title: '',
    content: '',
    type: 'concept' as VectorDocument['metadata']['type'],
    difficulty: 'intermediate' as VectorDocument['metadata']['difficulty'],
    topics: '',
    source: 'AI Mind OS Admin'
  });

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const ragStats = ragVectorSearch.getStats();
    setStats(ragStats);
  };

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await ragVectorSearch.semanticSearch({
        query: searchQuery,
        limit: 10,
        threshold: 0.1
      });
      setSearchResults(results);
      setRAGResponse(null);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRAGQuery = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await ragVectorSearch.ragQuery(searchQuery, {
        maxSources: 5,
        includeFollowUp: true,
        responseStyle: 'detailed'
      });
      setRAGResponse(response);
      setSearchResults(null);
    } catch (error) {
      console.error('RAG query error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddDocument = async () => {
    if (!newDocument.title || !newDocument.content) {
      alert('Please fill in title and content');
      return;
    }

    try {
      const topics = newDocument.topics.split(',').map(t => t.trim()).filter(t => t);
      
      await ragVectorSearch.addDocument({
        content: newDocument.content,
        metadata: {
          title: newDocument.title,
          source: newDocument.source,
          type: newDocument.type,
          difficulty: newDocument.difficulty,
          topics: topics,
          timestamp: new Date()
        }
      });

      // Reset form
      setNewDocument({
        title: '',
        content: '',
        type: 'concept',
        difficulty: 'intermediate',
        topics: '',
        source: 'AI Mind OS Admin'
      });

      // Reload stats
      loadStats();
      alert('Document added successfully!');
    } catch (error) {
      console.error('Add document error:', error);
      alert('Failed to add document');
    }
  };

  const exportData = () => {
    const data = ragVectorSearch.exportStore();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rag-vector-store-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">🔍</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              RAG Vector Search Admin
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered search and retrieval system with semantic understanding and contextual response generation.
          </p>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 text-xl">📄</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</div>
                  <div className="text-sm text-gray-500">Total Documents</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🧠</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{Object.keys(stats.documentTypes).length}</div>
                  <div className="text-sm text-gray-500">Content Types</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🎯</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.topTopics.length}</div>
                  <div className="text-sm text-gray-500">Topics Indexed</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">⚡</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">AI</div>
                  <div className="text-sm text-gray-500">Powered</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'search', name: 'Smart Search', icon: '🔍' },
                { id: 'rag', name: 'RAG Chat', icon: '💬' },
                { id: 'manage', name: 'Manage Content', icon: '📝' },
                { id: 'analytics', name: 'Analytics', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
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
            {/* Search Tab */}
            {activeTab === 'search' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Semantic Vector Search</h2>
                  <p className="text-gray-600">Search through AI Mind OS content using advanced vector similarity matching</p>
                </div>

                {/* Search Interface */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex gap-4 mb-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for AI concepts, techniques, examples..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSemanticSearch()}
                    />
                    <button
                      onClick={handleSemanticSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <span>🔍</span>
                          Vector Search
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {searchResults && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Search Results ({searchResults.totalResults} found in {searchResults.searchTime}ms)
                      </h3>
                      <div className="text-sm text-gray-500">
                        Avg Similarity: {Math.round(searchResults.avgSimilarity * 100)}%
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {searchResults.documents.map((doc) => (
                        <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{doc.metadata.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                doc.metadata.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                doc.metadata.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {doc.metadata.difficulty}
                              </span>
                              <span className="text-sm font-semibold text-indigo-600">
                                {Math.round((doc.similarity || 0) * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{doc.content.slice(0, 200)}...</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {doc.metadata.topics.slice(0, 3).map((topic) => (
                                <span key={topic} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                                  {topic}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{doc.metadata.source}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RAG Chat Tab */}
            {activeTab === 'rag' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">RAG AI Assistant</h2>
                  <p className="text-gray-600">Ask questions and get AI-generated answers based on indexed content</p>
                </div>

                {/* Chat Interface */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex gap-4 mb-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask about AI concepts, prompt engineering, best practices..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleRAGQuery()}
                    />
                    <button
                      onClick={handleRAGQuery}
                      disabled={isSearching || !searchQuery.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Thinking...
                        </>
                      ) : (
                        <>
                          <span>💬</span>
                          Ask AI
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* RAG Response */}
                {ragResponse && (
                  <div className="space-y-6">
                    {/* AI Answer */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">🤖</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">AI Assistant Response</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ragResponse.confidence >= 80 ? 'bg-green-100 text-green-800' :
                          ragResponse.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ragResponse.confidence}% confidence
                        </span>
                      </div>
                      
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">{ragResponse.answer}</p>
                      </div>
                    </div>

                    {/* Sources */}
                    {ragResponse.sources.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-blue-900 mb-4">Sources Referenced</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {ragResponse.sources.map((source, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-semibold text-gray-900">{source.title}</h5>
                                <span className="text-sm font-semibold text-blue-600">{source.relevance}%</span>
                              </div>
                              <p className="text-gray-700 text-sm mb-2">{source.snippet}</p>
                              <span className="text-xs text-gray-500">{source.source}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Follow-up Questions */}
                    {ragResponse.followUpQuestions.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-green-900 mb-4">Suggested Follow-up Questions</h4>
                        <div className="space-y-2">
                          {ragResponse.followUpQuestions.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => setSearchQuery(question)}
                              className="block w-full text-left px-4 py-2 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                            >
                              <span className="text-green-700">❓ {question}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Manage Content Tab */}
            {activeTab === 'manage' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Management</h2>
                  <p className="text-gray-600">Add new documents to the vector search index</p>
                </div>

                {/* Add Document Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Document</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="docTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Document Title *
                      </label>
                      <input
                        type="text"
                        id="docTitle"
                        value={newDocument.title}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter document title..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="docSource" className="block text-sm font-medium text-gray-700 mb-1">
                        Source
                      </label>
                      <input
                        type="text"
                        id="docSource"
                        value={newDocument.source}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, source: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Content source..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="docType" className="block text-sm font-medium text-gray-700 mb-1">
                        Content Type
                      </label>
                      <select
                        id="docType"
                        value={newDocument.type}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value as VectorDocument['metadata']['type'] }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="concept">Concept</option>
                        <option value="example">Example</option>
                        <option value="lesson">Lesson</option>
                        <option value="summary">Summary</option>
                        <option value="exercise">Exercise</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="docDifficulty" className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty Level
                      </label>
                      <select
                        id="docDifficulty"
                        value={newDocument.difficulty}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, difficulty: e.target.value as VectorDocument['metadata']['difficulty'] }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="docTopics" className="block text-sm font-medium text-gray-700 mb-1">
                      Topics (comma-separated)
                    </label>
                    <input
                      type="text"
                      id="docTopics"
                      value={newDocument.topics}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, topics: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., prompt engineering, AI parameters, temperature..."
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="docContent" className="block text-sm font-medium text-gray-700 mb-1">
                      Content *
                    </label>
                    <textarea
                      id="docContent"
                      value={newDocument.content}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Enter the document content..."
                    />
                  </div>

                  <button
                    onClick={handleAddDocument}
                    disabled={!newDocument.title || !newDocument.content}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Add Document to Index
                  </button>
                </div>

                {/* Management Actions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Management Actions</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={exportData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <span>💾</span>
                      Export Data
                    </button>
                    <button
                      onClick={loadStats}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <span>🔄</span>
                      Refresh Stats
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && stats && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Vector Search Analytics</h2>
                  <p className="text-gray-600">Insights and metrics from your knowledge base</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Document Types */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📄</span> Document Types
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(stats.documentTypes).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="capitalize">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.round((count / stats.totalDocuments) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Levels */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🎯</span> Difficulty Distribution
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(stats.difficultyLevels).map(([level, count]) => (
                        <div key={level} className="flex justify-between items-center">
                          <span className="capitalize">{level}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  level === 'beginner' ? 'bg-green-500' :
                                  level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.round((count / stats.totalDocuments) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Topics */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🏷️</span> Top Topics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {stats.topTopics.map((topic) => (
                        <div key={topic.topic} className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
                          <div className="text-sm font-medium text-indigo-900">{topic.topic}</div>
                          <div className="text-xs text-indigo-600">{topic.count} docs</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>⚙️</span> System Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</div>
                        <div className="text-sm text-gray-500">Total Documents</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {new Date(stats.lastIndexUpdate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">Last Update</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">OpenAI</div>
                        <div className="text-sm text-gray-500">Vector Engine</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGVectorSearchAdmin;
