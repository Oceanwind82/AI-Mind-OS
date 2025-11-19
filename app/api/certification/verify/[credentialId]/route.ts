import { NextRequest, NextResponse } from 'next/server';
import { verifyCertificate } from '../../../../../lib/certification';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ credentialId: string }> }
) {
  try {
    const { credentialId } = await params;
    
    const certificate = await verifyCertificate(credentialId);
    
    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      certificate,
      verified: true,
      message: 'Certificate is valid and verified'
    });

  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    );
  }
}
