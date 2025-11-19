import { NextRequest, NextResponse } from 'next/server';
import { ragVectorSearch } from '../../../lib/rag-vector-search';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, type, filters, limit, threshold } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'search':
        result = await ragVectorSearch.semanticSearch({
          query,
          filters,
          limit: limit || 10,
          threshold: threshold || 0.1
        });
        break;

      case 'rag':
        result = await ragVectorSearch.ragQuery(query, {
          maxSources: limit || 5,
          includeFollowUp: true,
          responseStyle: 'detailed'
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be "search" or "rag"' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('RAG Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = ragVectorSearch.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('RAG Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, metadata } = body;

    if (!title || !content || !metadata) {
      return NextResponse.json(
        { error: 'Title, content, and metadata are required' },
        { status: 400 }
      );
    }

    const documentId = await ragVectorSearch.addDocument({
      content,
      metadata: {
        title,
        source: metadata.source || 'API',
        type: metadata.type || 'concept',
        difficulty: metadata.difficulty || 'intermediate',
        topics: metadata.topics || [],
        timestamp: new Date(),
        ...metadata
      }
    });

    return NextResponse.json({ 
      success: true,
      documentId,
      message: 'Document added successfully'
    });

  } catch (error) {
    console.error('RAG Add Document API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
