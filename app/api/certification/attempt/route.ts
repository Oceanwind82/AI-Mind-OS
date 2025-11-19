import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  gradeExamAttempt, 
  createCertificate,
  type CertificationExam,
  type CertificationAttempt
} from '../../../../lib/certification';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/certification/attempt - Submit exam attempt
export async function POST(request: NextRequest) {
  try {
    const { examId, userId, answers, userProfile } = await request.json();

    // Get exam details
    const { data: exam, error: examError } = await supabase
      .from('certification_exams')
      .select('*')
      .eq('id', examId)
      .single();

    if (examError || !exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Grade the attempt
    const gradeResult = await gradeExamAttempt(exam as CertificationExam, answers);

    // Create attempt record
    const attemptData: Partial<CertificationAttempt> = {
      userId,
      examId,
      answers,
      score: gradeResult.score,
      passed: gradeResult.passed,
      startedAt: new Date(),
      completedAt: new Date()
    };

    // If passed, create certificate
    let certificate = null;
    if (gradeResult.passed) {
      certificate = await createCertificate(
        userId,
        examId,
        userProfile.full_name || 'Student'
      );
      attemptData.certificateId = certificate.id;
    }

    // Save attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('certification_attempts')
      .insert([attemptData])
      .select()
      .single();

    if (attemptError) throw attemptError;

    return NextResponse.json({ 
      attempt,
      result: gradeResult,
      certificate 
    });

  } catch (error) {
    console.error('Exam attempt error:', error);
    return NextResponse.json(
      { error: 'Failed to process exam attempt' },
      { status: 500 }
    );
  }
}

// GET /api/certification/attempt/[userId] - Get user's attempts
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

    const { data: attempts, error } = await supabase
      .from('certification_attempts')
      .select(`
        *,
        certification_exams(title, description),
        certificates(*)
      `)
      .eq('userId', userId)
      .order('completedAt', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ attempts: attempts || [] });
  } catch (error) {
    console.error('Get attempts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attempts' },
      { status: 500 }
    );
  }
}
