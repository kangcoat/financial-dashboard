'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { FinancialDataItem } from '@/types';

interface BalanceSheetChartProps {
  data: FinancialDataItem[];
}

export default function BalanceSheetChart({ data }: BalanceSheetChartProps) {
  // 재무상태표 데이터만 필터링
  const balanceSheetData = data.filter((item) => item.sj_div === 'BS');

  // 주요 항목 추출
  const keyAccounts = ['자산총계', '부채총계', '자본총계'];
  const chartData: any[] = [];

  keyAccounts.forEach((accountName) => {
    const account = balanceSheetData.find((item) => item.account_nm === accountName);
    if (account && account.thstrm_amount) {
      const entry: any = {
        name: accountName,
      };

      // 당기 데이터
      if (account.thstrm_amount) {
        entry.당기 = parseInt(account.thstrm_amount.replace(/,/g, ''), 10) / 1000000000000; // 조원 단위
      }

      // 전기 데이터
      if (account.frmtrm_amount) {
        entry.전기 = parseInt(account.frmtrm_amount.replace(/,/g, ''), 10) / 1000000000000;
      }

      // 전전기 데이터 (있는 경우)
      if (account.bfefrmtrm_amount) {
        entry.전전기 = parseInt(account.bfefrmtrm_amount.replace(/,/g, ''), 10) / 1000000000000;
      }

      chartData.push(entry);
    }
  });

  const formatValue = (value: number) => {
    return `${value.toFixed(1)}조`;
  };

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex flex-col bg-white border-2 border-black p-4">
        <h3 className="text-lg font-bold mb-3 flex-shrink-0">재무상태표</h3>
        <div className="flex-1 flex items-center justify-center text-black/40">
          데이터가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white border-2 border-black p-4">
      <h3 className="text-lg font-bold mb-3 flex-shrink-0">재무상태표</h3>
      <div className="flex-1 min-h-0" style={{ height: 'calc(100% - 3rem)' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.1} />
          <XAxis 
            dataKey="name" 
            stroke="#000000"
            tick={{ fill: '#000000', fontSize: 12, fontWeight: 600 }}
          />
          <YAxis 
            tickFormatter={formatValue} 
            stroke="#000000"
            tick={{ fill: '#000000', fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip
            formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(2)}조원` : '-'}
            contentStyle={{ 
              backgroundColor: '#000000', 
              border: 'none',
              color: '#ffffff',
              borderRadius: '0',
              padding: '12px'
            }}
            labelStyle={{ color: '#ffffff', fontWeight: 600 }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          {chartData[0]?.전전기 !== undefined && (
            <Bar dataKey="전전기" fill="#94a3b8" name="전전기">
              <LabelList 
                dataKey="전전기" 
                position="top" 
                formatter={(value: any) => {
                  const num = typeof value === 'number' ? value : parseFloat(value);
                  return num && num > 0 ? `${num.toFixed(1)}조` : '';
                }}
                style={{ fill: '#000000', fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          )}
          <Bar dataKey="전기" fill="#64748b" name="전기">
            <LabelList 
              dataKey="전기" 
              position="top" 
              formatter={(value: any) => {
                const num = typeof value === 'number' ? value : parseFloat(value);
                return num && num > 0 ? `${num.toFixed(1)}조` : '';
              }}
              style={{ fill: '#000000', fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
          <Bar dataKey="당기" fill="#000000" name="당기">
            <LabelList 
              dataKey="당기" 
              position="top" 
              formatter={(value: any) => {
                const num = typeof value === 'number' ? value : parseFloat(value);
                return num && num > 0 ? `${num.toFixed(1)}조` : '';
              }}
              style={{ fill: '#000000', fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
