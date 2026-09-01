import { NextResponse } from 'next/server';
import { askCensusSaathi } from '@/lib/gemini';
import { scrubPII } from '@/lib/pii-scrubber';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, selectedState, selectedLanguage, currentContext } = body || {};

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json(
        { error: 'Question is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: 'Question is too long (maximum 500 characters allowed).' },
        { status: 400 },
      );
    }

    // Step 1: Server-side PII Scrubbing
    const scrubResult = scrubPII(question.trim());

    // Step 2: Query Census AI / Grounded Reasoning Engine
    const aiResult = await askCensusSaathi({
      question: scrubResult.cleanedText,
      selectedState: typeof selectedState === 'string' ? selectedState.slice(0, 60) : 'Maharashtra',
      selectedLanguage: typeof selectedLanguage === 'string' ? selectedLanguage.slice(0, 40) : 'English',
      currentContext: typeof currentContext === 'string' ? currentContext.slice(0, 60) : 'general',
    });

    return NextResponse.json({
      answer: aiResult.answer,
      source: aiResult.source,
      disclaimer: aiResult.disclaimer,
      piiRedacted: scrubResult.hadPii,
      redactedTypes: scrubResult.redactedTypes,
    });
  } catch (error) {
    console.error('Error in /api/ask route:', error);
    return NextResponse.json(
      {
        error: 'An internal server error occurred while processing your Census question.',
        fallbackAnswer: 'Census 2027 is conducted under the Census Act 1948. For official updates, please visit censusindia.gov.in.',
      },
      { status: 500 },
    );
  }
}
