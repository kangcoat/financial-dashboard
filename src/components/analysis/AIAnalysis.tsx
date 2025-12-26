'use client';

import { useState } from 'react';
import { FinancialDataItem } from '@/types';

interface AIAnalysisProps {
  corpName: string;
  financialData: FinancialDataItem[];
}

export default function AIAnalysis({ corpName, financialData }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          corp_name: corpName,
          financial_data: financialData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '분석 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-black p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">AI 재무 분석</h3>
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-white hover:text-black border-2 border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white"
        >
          {isLoading ? '분석 중...' : '분석 시작'}
        </button>
      </div>

      {error && (
        <div className="bg-black text-white p-3 mb-4 border-2 border-black">
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-black border-t-transparent"></div>
          <span className="ml-4 text-sm font-medium">AI가 재무 데이터를 분석하고 있습니다...</span>
        </div>
      )}

      {analysis && (
        <div className="prose max-w-none max-h-32 overflow-y-auto">
          <div className="whitespace-pre-wrap text-black leading-relaxed text-sm">
            {analysis.split('\n').map((line, index) => (
              <p key={index} className="mb-2">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {!analysis && !isLoading && !error && (
        <div className="text-center py-8 text-black/60 text-sm">
          위의 "분석 시작" 버튼을 클릭하여 AI 재무 분석을 시작하세요.
        </div>
      )}
    </div>
  );
}
