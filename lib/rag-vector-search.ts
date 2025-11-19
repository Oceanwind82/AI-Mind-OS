import OpenAI from 'openai';

// Initialize OpenAI client with environment safety
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Helper function to check OpenAI availability
function checkOpenAI(): OpenAI {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Please configure OPENAI_API_KEY.');
  }
  return openai;
}

// Document interface for vector storage
export interface VectorDocument {
  id: string;
  content: string;
  metadata: {
    title: string;
    source: string;
    type: 'lesson' | 'summary' | 'concept' | 'example' | 'exercise';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
    timestamp: Date;
    lessonSlug?: string;
    sectionTitle?: string;
  };
  embedding?: number[];
  similarity?: number;
}

// Search query interface
export interface SearchQuery {
  query: string;
  filters?: {
    type?: VectorDocument['metadata']['type'][];
    difficulty?: VectorDocument['metadata']['difficulty'][];
    topics?: string[];
    source?: string[];
  };
  limit?: number;
  threshold?: number;
}

// RAG response interface
export interface RAGResponse {
  answer: string;
  sources: Array<{
    title: string;
    source: string;
    relevance: number;
    snippet: string;
  }>;
  confidence: number;
  followUpQuestions: string[];
}

// Vector search result interface
export interface SearchResult {
  documents: VectorDocument[];
  totalResults: number;
  searchTime: number;
  avgSimilarity: number;
}

// Enhanced RAG + Vector Search Service
export class RAGVectorSearchService {
  private vectorStore: Map<string, VectorDocument> = new Map();
  private indexedDocuments: number = 0;
  private lastIndexUpdate: Date = new Date();

  constructor() {
    this.initializeWithSampleData();
  }

  // Initialize with sample AI Mind OS lesson data
  private initializeWithSampleData(): void {
    const sampleDocuments: VectorDocument[] = [
      {
        id: 'doc_001',
        content: 'Prompt engineering is the practice of designing and refining prompts to elicit desired responses from AI language models. It involves understanding how to communicate effectively with AI systems through carefully crafted instructions, context, and examples.',
        metadata: {
          title: 'Introduction to Prompt Engineering',
          source: 'AI Mind OS Core Lessons',
          type: 'concept',
          difficulty: 'beginner',
          topics: ['prompt engineering', 'AI basics', 'communication'],
          timestamp: new Date(),
          lessonSlug: 'prompt-engineering-basics'
        }
      },
      {
        id: 'doc_002',
        content: 'Temperature settings control the randomness in AI responses. Lower temperatures (0.1-0.3) produce more focused, deterministic outputs suitable for factual content. Higher temperatures (0.7-1.0) increase creativity and variation, ideal for creative writing and brainstorming.',
        metadata: {
          title: 'Temperature Control in AI Models',
          source: 'AI Mind OS Advanced Techniques',
          type: 'concept',
          difficulty: 'intermediate',
          topics: ['temperature', 'AI parameters', 'response control'],
          timestamp: new Date(),
          lessonSlug: 'ai-parameters-mastery'
        }
      },
      {
        id: 'doc_003',
        content: 'Role-based prompting involves instructing the AI to assume a specific role or persona. For example: "You are an expert data scientist. Explain machine learning to a business executive." This technique helps tailor responses to specific audiences and contexts.',
        metadata: {
          title: 'Role-Based Prompting Strategies',
          source: 'AI Mind OS Professional Techniques',
          type: 'example',
          difficulty: 'intermediate',
          topics: ['role prompting', 'persona', 'audience targeting'],
          timestamp: new Date(),
          lessonSlug: 'advanced-prompting-techniques'
        }
      },
      {
        id: 'doc_004',
        content: 'Chain-of-thought prompting encourages AI models to show their reasoning process by asking them to think step by step. This technique significantly improves performance on complex reasoning tasks and mathematical problems.',
        metadata: {
          title: 'Chain-of-Thought Prompting',
          source: 'AI Mind OS Expert Methods',
          type: 'concept',
          difficulty: 'advanced',
          topics: ['chain of thought', 'reasoning', 'complex problems'],
          timestamp: new Date(),
          lessonSlug: 'expert-prompting-methods'
        }
      },
      {
        id: 'doc_005',
        content: 'Few-shot learning in prompt engineering involves providing the AI with a few examples of the desired input-output format before asking it to perform the task. This helps establish patterns and improves response consistency.',
        metadata: {
          title: 'Few-Shot Learning Examples',
          source: 'AI Mind OS Pattern Recognition',
          type: 'example',
          difficulty: 'intermediate',
          topics: ['few-shot learning', 'examples', 'patterns'],
          timestamp: new Date(),
          lessonSlug: 'pattern-based-prompting'
        }
      },
      {
        id: 'doc_006',
        content: 'Token limits are crucial constraints in AI models. GPT-4 has approximately 8,000-32,000 tokens depending on the version. One token is roughly 0.75 words. Understanding token usage helps optimize prompt efficiency and avoid truncation.',
        metadata: {
          title: 'Understanding Token Limits',
          source: 'AI Mind OS Technical Foundations',
          type: 'concept',
          difficulty: 'beginner',
          topics: ['tokens', 'limits', 'optimization'],
          timestamp: new Date(),
          lessonSlug: 'ai-technical-foundations'
        }
      },
      {
        id: 'doc_007',
        content: 'Prompt injection attacks occur when malicious users try to manipulate AI systems by embedding harmful instructions within seemingly innocent inputs. Defense strategies include input validation, output filtering, and prompt engineering safeguards.',
        metadata: {
          title: 'AI Security and Prompt Injection',
          source: 'AI Mind OS Security Module',
          type: 'concept',
          difficulty: 'advanced',
          topics: ['security', 'prompt injection', 'defense'],
          timestamp: new Date(),
          lessonSlug: 'ai-security-essentials'
        }
      },
      {
        id: 'doc_008',
        content: 'Effective business prompts should include: clear context about the company/industry, specific desired outcome, target audience information, brand voice guidelines, and any constraints or requirements. This ensures AI responses align with business objectives.',
        metadata: {
          title: 'Business Prompt Engineering',
          source: 'AI Mind OS Business Applications',
          type: 'example',
          difficulty: 'intermediate',
          topics: ['business', 'context', 'objectives'],
          timestamp: new Date(),
          lessonSlug: 'business-ai-applications'
        }
      }
    ];

    // Add sample documents to vector store
    sampleDocuments.forEach(doc => {
      this.vectorStore.set(doc.id, doc);
    });

    this.indexedDocuments = sampleDocuments.length;
    this.lastIndexUpdate = new Date();
  }

  // Generate embeddings for text content
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const client = checkOpenAI();
      const response = await client.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      // Return mock embedding for development
      return Array.from({ length: 1536 }, () => Math.random() - 0.5);
    }
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Add document to vector store
  async addDocument(document: Omit<VectorDocument, 'id' | 'embedding'>): Promise<string> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const embedding = await this.generateEmbedding(document.content);

    const vectorDoc: VectorDocument = {
      ...document,
      id,
      embedding
    };

    this.vectorStore.set(id, vectorDoc);
    this.indexedDocuments++;
    this.lastIndexUpdate = new Date();

    return id;
  }

  // Batch add multiple documents
  async addDocuments(documents: Array<Omit<VectorDocument, 'id' | 'embedding'>>): Promise<string[]> {
    const ids: string[] = [];

    for (const document of documents) {
      const id = await this.addDocument(document);
      ids.push(id);
    }

    return ids;
  }

  // Update existing document
  async updateDocument(id: string, updates: Partial<VectorDocument>): Promise<boolean> {
    const existingDoc = this.vectorStore.get(id);
    if (!existingDoc) {
      return false;
    }

    let embedding = existingDoc.embedding;
    if (updates.content && updates.content !== existingDoc.content) {
      embedding = await this.generateEmbedding(updates.content);
    }

    const updatedDoc: VectorDocument = {
      ...existingDoc,
      ...updates,
      embedding
    };

    this.vectorStore.set(id, updatedDoc);
    this.lastIndexUpdate = new Date();

    return true;
  }

  // Remove document from vector store
  removeDocument(id: string): boolean {
    const deleted = this.vectorStore.delete(id);
    if (deleted) {
      this.indexedDocuments--;
      this.lastIndexUpdate = new Date();
    }
    return deleted;
  }

  // Semantic search using vector similarity
  async semanticSearch(searchQuery: SearchQuery): Promise<SearchResult> {
    const startTime = Date.now();
    const queryEmbedding = await this.generateEmbedding(searchQuery.query);
    
    const results: VectorDocument[] = [];
    let totalSimilarity = 0;

    // Calculate similarity for all documents
    for (const [, document] of this.vectorStore) {
      // Apply filters
      if (!this.matchesFilters(document, searchQuery.filters)) {
        continue;
      }

      // Calculate similarity (use mock similarity for documents without embeddings)
      let similarity: number;
      if (document.embedding) {
        similarity = this.cosineSimilarity(queryEmbedding, document.embedding);
      } else {
        // Fallback: text-based similarity score
        similarity = this.textSimilarity(searchQuery.query.toLowerCase(), document.content.toLowerCase());
      }

      // Apply threshold filter
      if (similarity >= (searchQuery.threshold || 0.1)) {
        const docWithSimilarity = { ...document, similarity };
        results.push(docWithSimilarity);
        totalSimilarity += similarity;
      }
    }

    // Sort by similarity (descending)
    results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

    // Apply limit
    const limitedResults = results.slice(0, searchQuery.limit || 10);

    const searchTime = Date.now() - startTime;
    const avgSimilarity = results.length > 0 ? totalSimilarity / results.length : 0;

    return {
      documents: limitedResults,
      totalResults: results.length,
      searchTime,
      avgSimilarity
    };
  }

  // Simple text-based similarity fallback
  private textSimilarity(query: string, content: string): number {
    const queryWords = query.split(/\s+/);
    const contentWords = content.split(/\s+/);
    
    let matches = 0;
    for (const word of queryWords) {
      if (contentWords.some(cWord => cWord.includes(word) || word.includes(cWord))) {
        matches++;
      }
    }

    return matches / queryWords.length;
  }

  // Check if document matches search filters
  private matchesFilters(document: VectorDocument, filters?: SearchQuery['filters']): boolean {
    if (!filters) return true;

    if (filters.type && !filters.type.includes(document.metadata.type)) {
      return false;
    }

    if (filters.difficulty && !filters.difficulty.includes(document.metadata.difficulty)) {
      return false;
    }

    if (filters.topics && !filters.topics.some(topic => 
      document.metadata.topics.some(docTopic => 
        docTopic.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(docTopic.toLowerCase())
      )
    )) {
      return false;
    }

    if (filters.source && !filters.source.includes(document.metadata.source)) {
      return false;
    }

    return true;
  }

  // RAG: Retrieve and Generate response
  async ragQuery(query: string, options?: {
    maxSources?: number;
    includeFollowUp?: boolean;
    responseStyle?: 'concise' | 'detailed' | 'conversational';
  }): Promise<RAGResponse> {
    try {
      // Step 1: Retrieve relevant documents
      const searchResult = await this.semanticSearch({
        query,
        limit: options?.maxSources || 5,
        threshold: 0.2
      });

      if (searchResult.documents.length === 0) {
        return {
          answer: "I don't have specific information about that topic in my knowledge base. Could you rephrase your question or ask about AI prompt engineering, temperature settings, or other AI concepts?",
          sources: [],
          confidence: 0,
          followUpQuestions: [
            "What specific aspect of AI would you like to learn about?",
            "Are you interested in prompt engineering techniques?",
            "Would you like to know about AI model parameters?"
          ]
        };
      }

      // Step 2: Prepare context from retrieved documents
      const context = searchResult.documents
        .map((doc, index) => `[Source ${index + 1}: ${doc.metadata.title}]\n${doc.content}`)
        .join('\n\n');

      // Step 3: Generate response using OpenAI
      const client = checkOpenAI();
      const systemPrompt = this.createRAGSystemPrompt(options?.responseStyle || 'detailed');

      const completion = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context:\n${context}\n\nQuestion: ${query}` }
        ],
        max_tokens: 800,
        temperature: 0.3,
      });

      const answer = completion.choices[0]?.message?.content || 'Unable to generate response.';

      // Step 4: Generate follow-up questions if requested
      let followUpQuestions: string[] = [];
      if (options?.includeFollowUp !== false) {
        followUpQuestions = await this.generateFollowUpQuestions(query, answer);
      }

      // Step 5: Calculate confidence score
      const confidence = this.calculateConfidence(searchResult.avgSimilarity, searchResult.documents.length);

      // Step 6: Prepare sources
      const sources = searchResult.documents.map(doc => ({
        title: doc.metadata.title,
        source: doc.metadata.source,
        relevance: Math.round((doc.similarity || 0) * 100),
        snippet: doc.content.slice(0, 150) + (doc.content.length > 150 ? '...' : '')
      }));

      return {
        answer,
        sources,
        confidence,
        followUpQuestions
      };

    } catch (error) {
      console.error('RAG query error:', error);
      return {
        answer: 'I apologize, but I encountered an error while processing your question. Please try again.',
        sources: [],
        confidence: 0,
        followUpQuestions: []
      };
    }
  }

  // Create system prompt for RAG responses
  private createRAGSystemPrompt(style: 'concise' | 'detailed' | 'conversational'): string {
    const basePrompt = `You are an expert AI tutor for AI Mind OS, a comprehensive AI and prompt engineering education platform. Use the provided context to answer questions accurately and helpfully.

Guidelines:
- Base your response primarily on the provided context
- If the context doesn't fully address the question, acknowledge limitations
- Provide practical, actionable insights
- Use examples when helpful
- Maintain accuracy and avoid speculation
- Reference the sources naturally in your response`;

    const stylePrompts = {
      concise: `${basePrompt}\n\nResponse Style: Keep responses focused and to-the-point. Prioritize key information and actionable insights.`,
      detailed: `${basePrompt}\n\nResponse Style: Provide comprehensive explanations with examples, context, and practical applications.`,
      conversational: `${basePrompt}\n\nResponse Style: Use a friendly, engaging tone as if explaining to a colleague. Include analogies and relatable examples.`
    };

    return stylePrompts[style];
  }

  // Generate contextual follow-up questions
  private async generateFollowUpQuestions(originalQuery: string, answer: string): Promise<string[]> {
    try {
      const client = checkOpenAI();
      const completion = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Generate 3 relevant follow-up questions based on the user\'s original question and the answer provided. Questions should encourage deeper learning and practical application.'
          },
          {
            role: 'user',
            content: `Original question: ${originalQuery}\nAnswer: ${answer}\n\nGenerate follow-up questions as JSON array.`
          }
        ],
        max_tokens: 200,
        temperature: 0.6,
      });

      const response = completion.choices[0]?.message?.content || '[]';
      try {
        return JSON.parse(response);
      } catch {
        return [
          "How can I apply this concept in practice?",
          "What are some common mistakes to avoid?",
          "Are there any advanced techniques related to this topic?"
        ];
      }
    } catch (error) {
      console.error('Follow-up questions generation error:', error);
      return [
        "Can you provide more specific examples?",
        "How does this relate to other AI concepts?",
        "What should I learn next about this topic?"
      ];
    }
  }

  // Calculate confidence score based on search results
  private calculateConfidence(avgSimilarity: number, resultCount: number): number {
    // Base confidence on similarity and number of supporting sources
    let confidence = avgSimilarity * 100;

    // Boost confidence with more supporting sources (up to 5)
    const sourceBoost = Math.min(resultCount / 5, 1) * 10;
    confidence += sourceBoost;

    // Cap at 95% to acknowledge potential limitations
    return Math.min(confidence, 95);
  }

  // Get vector store statistics
  getStats(): {
    totalDocuments: number;
    lastIndexUpdate: Date;
    documentTypes: Record<string, number>;
    difficultyLevels: Record<string, number>;
    topTopics: Array<{ topic: string; count: number }>;
  } {
    const documentTypes: Record<string, number> = {};
    const difficultyLevels: Record<string, number> = {};
    const topicCounts: Record<string, number> = {};

    for (const [, document] of this.vectorStore) {
      // Count document types
      documentTypes[document.metadata.type] = (documentTypes[document.metadata.type] || 0) + 1;

      // Count difficulty levels
      difficultyLevels[document.metadata.difficulty] = (difficultyLevels[document.metadata.difficulty] || 0) + 1;

      // Count topics
      document.metadata.topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    }

    // Get top 10 topics
    const topTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));

    return {
      totalDocuments: this.indexedDocuments,
      lastIndexUpdate: this.lastIndexUpdate,
      documentTypes,
      difficultyLevels,
      topTopics
    };
  }

  // Clear all documents
  clearStore(): void {
    this.vectorStore.clear();
    this.indexedDocuments = 0;
    this.lastIndexUpdate = new Date();
  }

  // Export vector store for backup
  exportStore(): VectorDocument[] {
    return Array.from(this.vectorStore.values());
  }

  // Import vector store from backup
  async importStore(documents: VectorDocument[]): Promise<void> {
    this.vectorStore.clear();
    
    for (const document of documents) {
      // Generate embeddings if missing
      if (!document.embedding) {
        document.embedding = await this.generateEmbedding(document.content);
      }
      this.vectorStore.set(document.id, document);
    }

    this.indexedDocuments = documents.length;
    this.lastIndexUpdate = new Date();
  }
}

// Singleton instance for global use
export const ragVectorSearch = new RAGVectorSearchService();

// Convenience functions for easy usage
export async function searchLessons(query: string, options?: {
  difficulty?: VectorDocument['metadata']['difficulty'][];
  topics?: string[];
  limit?: number;
}): Promise<SearchResult> {
  return ragVectorSearch.semanticSearch({
    query,
    filters: {
      difficulty: options?.difficulty,
      topics: options?.topics
    },
    limit: options?.limit
  });
}

export async function askAI(question: string, options?: {
  style?: 'concise' | 'detailed' | 'conversational';
  includeFollowUp?: boolean;
}): Promise<RAGResponse> {
  return ragVectorSearch.ragQuery(question, {
    responseStyle: options?.style,
    includeFollowUp: options?.includeFollowUp
  });
}

export async function addLessonContent(
  title: string,
  content: string,
  metadata: {
    difficulty: VectorDocument['metadata']['difficulty'];
    topics: string[];
    lessonSlug?: string;
    sectionTitle?: string;
  }
): Promise<string> {
  return ragVectorSearch.addDocument({
    content,
    metadata: {
      title,
      source: 'AI Mind OS Lessons',
      type: 'lesson',
      timestamp: new Date(),
      ...metadata
    }
  });
}

export function getSearchStats() {
  return ragVectorSearch.getStats();
}
