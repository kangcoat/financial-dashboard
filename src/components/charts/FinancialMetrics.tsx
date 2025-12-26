'use client';

import { FinancialDataItem } from '@/types';

interface FinancialMetricsProps {
  data: FinancialDataItem[];
}

export default function FinancialMetrics({ data }: FinancialMetricsProps) {
  const formatAmount = (amount: string | undefined) => {
    if (!amount) return '-';
    // 쉼표 제거 후 숫자로 변환
    const cleanAmount = amount.replace(/,/g, '');
    const num = parseInt(cleanAmount, 10);
    if (isNaN(num)) return '-';
    
    if (num >= 1000000000000) {
      return `${(num / 1000000000000).toFixed(2)}조원`;
    } else if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}억원`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}백만원`;
    }
    return `${num.toLocaleString('ko-KR')}원`;
  };

  const findAccount = (accountName: string, sjDiv: 'BS' | 'IS' = 'BS') => {
    return data.find((item) => item.account_nm === accountName && item.sj_div === sjDiv);
  };

  const totalAssets = findAccount('자산총계');
  const totalRevenue = findAccount('매출액', 'IS');
  const operatingProfit = findAccount('영업이익', 'IS');
  const netIncome = findAccount('당기순이익', 'IS');

  const metrics = [
    {
      label: '총자산',
      value: formatAmount(totalAssets?.thstrm_amount),
      change: totalAssets
        ? ((parseInt(totalAssets.thstrm_amount.replace(/,/g, '')) - parseInt(totalAssets.frmtrm_amount.replace(/,/g, ''))) /
            parseInt(totalAssets.frmtrm_amount.replace(/,/g, ''))) *
          100
        : null,
    },
    {
      label: '매출액',
      value: formatAmount(totalRevenue?.thstrm_amount),
      change: totalRevenue
        ? ((parseInt(totalRevenue.thstrm_amount.replace(/,/g, '')) - parseInt(totalRevenue.frmtrm_amount.replace(/,/g, ''))) /
            parseInt(totalRevenue.frmtrm_amount.replace(/,/g, ''))) *
          100
        : null,
    },
    {
      label: '영업이익',
      value: formatAmount(operatingProfit?.thstrm_amount),
      change: operatingProfit
        ? ((parseInt(operatingProfit.thstrm_amount.replace(/,/g, '')) - parseInt(operatingProfit.frmtrm_amount.replace(/,/g, ''))) /
            parseInt(operatingProfit.frmtrm_amount.replace(/,/g, ''))) *
          100
        : null,
    },
    {
      label: '당기순이익',
      value: formatAmount(netIncome?.thstrm_amount),
      change: netIncome
        ? ((parseInt(netIncome.thstrm_amount.replace(/,/g, '')) - parseInt(netIncome.frmtrm_amount.replace(/,/g, ''))) /
            parseInt(netIncome.frmtrm_amount.replace(/,/g, ''))) *
          100
        : null,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white border-2 border-black p-4 hover:bg-black hover:text-white transition-all cursor-pointer"
        >
          <div className="text-xs font-medium mb-2 text-black/60 group-hover:text-white/80">{metric.label}</div>
          <div className="text-xl font-bold mb-2">{metric.value}</div>
          {metric.change !== null && (
            <div
              className={`text-xs font-semibold ${
                metric.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change).toFixed(1)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
