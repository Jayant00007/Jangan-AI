import { NextResponse } from 'next/server';
import { explainChartData } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { metric, state, years, values, language } = body || {};

    if (!metric || typeof metric !== 'string') {
      return NextResponse.json(
        { error: 'Metric is required to generate chart explanation.' },
        { status: 400 },
      );
    }

    const result = await explainChartData({
      metric: metric.slice(0, 100),
      state: typeof state === 'string' ? state.slice(0, 60) : 'All India',
      years: Array.isArray(years) ? years.map(String) : ['1951', '2011'],
      values: typeof values === 'object' && values !== null ? values : {},
      language: typeof language === 'string' ? language.slice(0, 40) : 'English',
    });

    return NextResponse.json({
      explanation: result.explanation,
      keyObservations: result.keyObservations,
      disclaimer: 'Observations are based strictly on official Census of India statistical tables (1951-2011).',
    });
  } catch (error) {
    console.error('Error in /api/explain-chart route:', error);
    return NextResponse.json(
      {
        explanation: 'Historical Census tables reflect national demographic trends compiled by the Office of the Registrar General of India.',
        keyObservations: ['Data represents decadal enumerations from 1951 to 2011.'],
        disclaimer: 'Source: Census of India historical series.',
      },
      { status: 500 },
    );
  }
}
