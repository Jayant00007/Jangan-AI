import { NextResponse } from 'next/server';
import { factCheckClaim } from '@/lib/gemini';
import { scrubPII } from '@/lib/pii-scrubber';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { claim, selectedLanguage } = body || {};

    if (!claim || typeof claim !== 'string' || !claim.trim()) {
      return NextResponse.json(
        { error: 'Claim text is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    if (claim.length > 500) {
      return NextResponse.json(
        { error: 'Claim text is too long (maximum 500 characters allowed).' },
        { status: 400 },
      );
    }

    // Step 1: Server-side PII Scrubbing
    const scrubResult = scrubPII(claim.trim());

    // Step 2: Run Fact Check Engine
    const result = await factCheckClaim(
      scrubResult.cleanedText,
      typeof selectedLanguage === 'string' ? selectedLanguage : 'English',
    );

    return NextResponse.json({
      ...result,
      piiRedacted: scrubResult.hadPii,
      redactedTypes: scrubResult.redactedTypes,
      disclaimer: 'Fact check results are verified against official Government of India Census guidelines and PIB alerts.',
    });
  } catch (error) {
    console.error('Error in /api/fact-check route:', error);
    return NextResponse.json(
      {
        status: 'unable_to_verify',
        confidence: 'low',
        threatLevel: 'low',
        summary: 'Verification service encountered a temporary error.',
        explanation: 'We could not complete verification at this moment. Please check censusindia.gov.in for official notices.',
        recommendedAction: 'Do not forward unverified messages on social media.',
        sources: ['censusindia.gov.in'],
      },
      { status: 500 },
    );
  }
}
