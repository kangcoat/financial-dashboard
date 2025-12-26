import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini/client';
import { FinancialDataItem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { corp_name, financial_data } = body;

    if (!corp_name || !financial_data || !Array.isArray(financial_data)) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const client = getGeminiClient();
    const analysis = await client.analyzeFinancialData(
      corp_name,
      financial_data as FinancialDataItem[]
    );

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('AI 분석 오류:', error);
    return NextResponse.json(
      { error: error.message || 'AI 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}


