'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BalanceSheetChart from '@/components/charts/BalanceSheetChart';
import IncomeStatementChart from '@/components/charts/IncomeStatementChart';
import FinancialMetrics from '@/components/charts/FinancialMetrics';
import AIAnalysis from '@/components/analysis/AIAnalysis';
import { FinancialDataItem, CorpData, REPORT_CODES } from '@/types';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const corpCode = params.corpCode as string;

  const [company, setCompany] = useState<CorpData | null>(null);
  const [financialData, setFinancialData] = useState<FinancialDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);
  const [selectedReport, setSelectedReport] = useState<'11011' | '11012' | '11013' | '11014'>('11011');

  // 회사 정보 로드
  useEffect(() => {
    const loadCompany = async () => {
      try {
        const response = await fetch('/corp.json');
        const companies: CorpData[] = await response.json();
        const found = companies.find((c) => c.corp_code === corpCode);
        if (found) {
          setCompany(found);
        } else {
          setError('회사 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('회사 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    if (corpCode) {
      loadCompany();
    }
  }, [corpCode]);

  // 재무 데이터 로드
  useEffect(() => {
    const loadFinancialData = async () => {
      if (!corpCode) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/financial-data?corp_code=${corpCode}&bsns_year=${selectedYear}&reprt_code=${selectedReport}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '재무 데이터를 불러오는 중 오류가 발생했습니다.');
        }

        const data = await response.json();
        if (data.status === '000' && data.list) {
          setFinancialData(data.list);
        } else {
          throw new Error(data.message || '재무 데이터를 찾을 수 없습니다.');
        }
      } catch (err: any) {
        setError(err.message || '재무 데이터를 불러오는 중 오류가 발생했습니다.');
        setFinancialData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFinancialData();
  }, [corpCode, selectedYear, selectedReport]);

  // 사용 가능한 연도 목록 생성 (최근 5년)
  const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i - 1);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-black/10 bg-white/95 backdrop-blur-sm z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-black hover:opacity-60 transition-opacity font-medium text-lg"
            >
              ← 홈으로
            </button>
            {company && (
              <div className="text-right">
                <h1 className="text-3xl font-bold mb-1">{company.corp_name}</h1>
                {company.corp_eng_name && (
                  <p className="text-black/60 text-base">{company.corp_eng_name}</p>
                )}
                {company.stock_code && (
                  <p className="text-black/40 text-xs mt-1 font-mono">종목코드: {company.stock_code}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 필터 */}
      <div className="px-6 py-4 border-b border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-black p-4">
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-xs font-medium mb-1 text-black/60">사업연도</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 bg-white text-black border-2 border-black rounded-none focus:outline-none font-medium text-sm min-w-[100px] hover:bg-black hover:text-white transition-all"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}년
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-black/60">보고서</label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value as any)}
                  className="px-3 py-2 bg-white text-black border-2 border-black rounded-none focus:outline-none font-medium text-sm min-w-[120px] hover:bg-black hover:text-white transition-all"
                >
                  {Object.values(REPORT_CODES).map((report) => (
                    <option key={report.code} value={report.code}>
                      {report.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-black text-white p-4 mb-4 border-2 border-black">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
              <span className="text-lg font-medium">재무 데이터를 불러오는 중...</span>
            </div>
          </div>
        )}

        {/* 재무 데이터 표시 */}
        {!isLoading && financialData.length > 0 && (
          <div className="space-y-6">
            {/* 주요 지표 */}
            <FinancialMetrics data={financialData} />

            {/* 차트 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96">
                <BalanceSheetChart data={financialData} />
              </div>
              <div className="h-96">
                <IncomeStatementChart data={financialData} />
              </div>
            </div>

            {/* AI 분석 */}
            {company && (
              <AIAnalysis corpName={company.corp_name} financialData={financialData} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
