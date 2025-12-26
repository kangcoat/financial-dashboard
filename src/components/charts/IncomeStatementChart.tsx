'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FinancialDataItem } from '@/types';

interface IncomeStatementChartProps {
  data: FinancialDataItem[];
}

export default function IncomeStatementChart({ data }: IncomeStatementChartProps) {
  // 손익계산서 데이터만 필터링
  const incomeData = data.filter((item) => item.sj_div === 'IS');

  // 주요 항목 추출
  const keyAccounts = ['매출액', '영업이익', '당기순이익'];
  const chartData: any[] = [];

  // 첫 번째 계정을 기준으로 기간 확인
  const firstAccount = incomeData.find(item => keyAccounts.includes(item.account_nm));
  const hasBfefrmtrm = firstAccount?.bfefrmtrm_amount ? true : false;

  // 기간별 데이터 구성
  if (hasBfefrmtrm) {
    // 전전기가 있는 경우
    const entry1: any = { name: '전전기' };
    const entry2: any = { name: '전기' };
    const entry3: any = { name: '당기' };

    keyAccounts.forEach((accountName) => {
      const account = incomeData.find((item) => item.account_nm === accountName);
      if (account) {
        if (account.bfefrmtrm_amount) {
          entry1[accountName] = parseInt(account.bfefrmtrm_amount.replace(/,/g, ''), 10) / 1000000000000;
        }
        if (account.frmtrm_amount) {
          entry2[accountName] = parseInt(account.frmtrm_amount.replace(/,/g, ''), 10) / 1000000000000;
        }
        if (account.thstrm_amount) {
          entry3[accountName] = parseInt(account.thstrm_amount.replace(/,/g, ''), 10) / 1000000000000;
        }
      }
    });

    chartData.push(entry1, entry2, entry3);
  } else {
    // 전전기가 없는 경우
    const entry1: any = { name: '전기' };
    const entry2: any = { name: '당기' };

    keyAccounts.forEach((accountName) => {
      const account = incomeData.find((item) => item.account_nm === accountName);
      if (account) {
        if (account.frmtrm_amount) {
          entry1[accountName] = parseInt(account.frmtrm_amount.replace(/,/g, ''), 10) / 1000000000000;
        }
        if (account.thstrm_amount) {
          entry2[accountName] = parseInt(account.thstrm_amount.replace(/,/g, ''), 10) / 1000000000000;
        }
      }
    });

    chartData.push(entry1, entry2);
  }

  const formatValue = (value: number) => {
    return `${value.toFixed(1)}조`;
  };

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex flex-col bg-white border-2 border-black p-4">
        <h3 className="text-lg font-bold mb-3 flex-shrink-0">손익계산서</h3>
        <div className="flex-1 flex items-center justify-center text-black/40">
          데이터가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white border-2 border-black p-4">
      <h3 className="text-lg font-bold mb-3 flex-shrink-0">손익계산서</h3>
      <div className="flex-1 min-h-0" style={{ height: 'calc(100% - 3rem)' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="매출액"
            stroke="#000000"
            strokeWidth={3}
            name="매출액"
            dot={{ fill: '#000000', r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="영업이익"
            stroke="#64748b"
            strokeWidth={3}
            name="영업이익"
            dot={{ fill: '#64748b', r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="당기순이익"
            stroke="#94a3b8"
            strokeWidth={3}
            name="당기순이익"
            dot={{ fill: '#94a3b8', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
