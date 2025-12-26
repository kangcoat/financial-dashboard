'use client';

import { useState, useMemo, useCallback } from 'react';
import { CorpData } from '@/types';

interface CompanySearchProps {
  onSelectCompany: (company: CorpData) => void;
}

export default function CompanySearch({ onSelectCompany }: CompanySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<CorpData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);

  // 회사 데이터 로드
  const loadCompanies = useCallback(async () => {
    if (companies.length > 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/corp.json');
      const data: CorpData[] = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('회사 데이터 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  }, [companies.length]);

  // 검색 필터링
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return companies
      .filter((company) => {
        const name = company.corp_name.toLowerCase();
        const engName = company.corp_eng_name.toLowerCase();
        const stockCode = company.stock_code.toLowerCase();
        return name.includes(term) || engName.includes(term) || stockCode.includes(term);
      })
      .slice(0, 10); // 최대 10개만 표시
  }, [searchTerm, companies]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);
    setShowResults(value.length > 0);
    
    if (value.length > 0 && companies.length === 0) {
      loadCompanies();
    }
  };

  const handleSelectCompany = (company: CorpData) => {
    setSearchTerm(company.corp_name);
    setShowResults(false);
    setSelectedIndex(-1);
    onSelectCompany(company);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || filteredCompanies.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < filteredCompanies.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectCompany(filteredCompanies[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchTerm.length > 0) setShowResults(true);
            if (companies.length === 0) loadCompanies();
          }}
          placeholder="회사명, 영문명, 또는 종목코드로 검색..."
          className="w-full px-6 py-5 text-xl border-2 border-black rounded-none focus:outline-none focus:border-black bg-white text-black placeholder:text-black/40 font-medium transition-all"
        />
        {isLoading && (
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"></div>
          </div>
        )}
      </div>

      {showResults && filteredCompanies.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-96 overflow-y-auto">
          {filteredCompanies.map((company, index) => (
            <div
              key={company.corp_code}
              onClick={() => handleSelectCompany(company)}
              className={`px-6 py-4 cursor-pointer border-b border-black/10 last:border-b-0 hover:bg-black hover:text-white transition-all ${
                index === selectedIndex ? 'bg-black text-white' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg mb-1">
                    {company.corp_name}
                  </div>
                  {company.corp_eng_name && (
                    <div className="text-sm opacity-70">
                      {company.corp_eng_name}
                    </div>
                  )}
                </div>
                {company.stock_code && (
                  <div className="text-sm font-mono font-semibold">
                    {company.stock_code}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && searchTerm.length > 0 && filteredCompanies.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center text-black/60">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
