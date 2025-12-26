import { NextRequest, NextResponse } from 'next/server';
import { getOpenDartClient } from '@/lib/opendart/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const corp_code = searchParams.get('corp_code');
    const bsns_year = searchParams.get('bsns_year');
    const reprt_code = searchParams.get('reprt_code') as '11011' | '11012' | '11013' | '11014';

    // 파라미터 검증
    if (!corp_code || !bsns_year || !reprt_code) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 보고서 코드 검증
    const validReportCodes = ['11011', '11012', '11013', '11014'];
    if (!validReportCodes.includes(reprt_code)) {
      return NextResponse.json(
        { error: '유효하지 않은 보고서 코드입니다.' },
        { status: 400 }
      );
    }

    const client = getOpenDartClient();
    const data = await client.getFinancialData({
      corp_code,
      bsns_year,
      reprt_code,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('재무 데이터 조회 오류:', error);
    return NextResponse.json(
      { error: error.message || '재무 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}


