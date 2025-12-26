'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompanySearch from '@/components/search/CompanySearch';
import { CorpData } from '@/types';

export default function Home() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<CorpData | null>(null);

  // 첫 화면에서만 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSelectCompany = (company: CorpData) => {
    setSelectedCompany(company);
    router.push(`/dashboard/${company.corp_code}`);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* 헤더 */}
      <header className="border-b border-black/10 bg-white/80 backdrop-blur-sm z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-2xl font-bold tracking-tight">FINANCIAL ANALYZER</div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex flex-col justify-center items-center max-w-7xl mx-auto px-6 w-full overflow-hidden">
        {/* 히어로 섹션 */}
        <div className="text-center w-full">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            재무 데이터를
            <br />
            시각화하세요
          </h1>
          <p className="text-lg md:text-xl text-black/60 max-w-2xl mx-auto mb-8">
            회사를 검색하여 재무 데이터를 시각화하고 AI 분석을 받아보세요
          </p>
          
          <div className="max-w-2xl mx-auto mb-12">
            <CompanySearch onSelectCompany={handleSelectCompany} />
          </div>
        </div>

        {/* 기능 소개 */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="group cursor-pointer">
            <div className="h-48 bg-white p-8 flex flex-col justify-between hover:bg-black hover:text-white transition-all">
              <div className="text-5xl mb-4">🔍</div>
              <div>
                <h3 className="text-xl font-bold mb-2">회사 검색</h3>
                <p className="text-black/60 group-hover:text-white/80 text-sm leading-relaxed transition-colors">
                  회사명, 영문명, 또는 종목코드로 검색
                </p>
              </div>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="h-48 bg-white p-8 flex flex-col justify-between hover:bg-black hover:text-white transition-all">
              <div className="text-5xl mb-4">📊</div>
              <div>
                <h3 className="text-xl font-bold mb-2">데이터 시각화</h3>
                <p className="text-black/60 group-hover:text-white/80 text-sm leading-relaxed transition-colors">
                  재무상태표와 손익계산서 차트
                </p>
              </div>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="h-48 bg-white p-8 flex flex-col justify-between hover:bg-black hover:text-white transition-all">
              <div className="text-5xl mb-4">🤖</div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI 분석</h3>
                <p className="text-black/60 group-hover:text-white/80 text-sm leading-relaxed transition-colors">
                  Gemini AI 재무 분석
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
