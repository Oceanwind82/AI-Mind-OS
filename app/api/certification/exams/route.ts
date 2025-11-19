import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  generateExamQuestions,
  type CertificationExam 
} from '../../../../lib/certification';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/certification/exams - List available exams
export async function GET() {
  try {
    const { data: exams, error } = await supabase
      .from('certification_exams')
      .select('*')
      .eq('active', true);

    if (error) throw error;

    return NextResponse.json({ exams: exams || [] });
  } catch (error) {
    console.error('Get exams error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}

// POST /api/certification/exams - Create new exam (admin only)
export async function POST(request: NextRequest) {
  try {
    const { title, description, requiredLessons, difficulty, questionCount, passingScore, timeLimit, price } = await request.json();

    // Get lesson content for question generation
    const lessonContent = requiredLessons.join(' '); // Simplified for demo
    
    // Generate AI-powered questions
    const questions = await generateExamQuestions(lessonContent, difficulty, questionCount);

    const examData: Partial<CertificationExam> = {
      title,
      description,
      requiredLessons,
      questions,
      passingScore,
      timeLimit,
      price,
      certificateTemplate: 'default'
    };

    const { data, error } = await supabase
      .from('certification_exams')
      .insert([examData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ exam: data });
  } catch (error) {
    console.error('Create exam error:', error);
    return NextResponse.json(
      { error: 'Failed to create exam' },
      { status: 500 }
    );
  }
}
