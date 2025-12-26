// 회사 정보 타입
export interface CorpData {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
  modify_date: string;
}

// 재무 데이터 요청 타입
export interface FinancialDataRequest {
  corp_code: string;
  bsns_year: string;
  reprt_code: '11011' | '11012' | '11013' | '11014';
}

// 재무 데이터 응답 타입
export interface FinancialDataItem {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  stock_code: string;
  account_nm: string;
  fs_div: 'OFS' | 'CFS';
  fs_nm: string;
  sj_div: 'BS' | 'IS';
  sj_nm: string;
  thstrm_nm: string;
  thstrm_dt: string;
  thstrm_amount: string;
  thstrm_add_amount?: string;
  frmtrm_nm: string;
  frmtrm_dt: string;
  frmtrm_amount: string;
  frmtrm_add_amount?: string;
  bfefrmtrm_nm?: string;
  bfefrmtrm_dt?: string;
  bfefrmtrm_amount?: string;
  ord: string;
  currency: string;
}

export interface OpenDartResponse {
  status: string;
  message: string;
  list?: FinancialDataItem[];
}

// 보고서 코드 타입
export type ReportCode = '11011' | '11012' | '11013' | '11014';

export const REPORT_CODES: Record<string, { code: ReportCode; name: string }> = {
  '11011': { code: '11011', name: '사업보고서' },
  '11012': { code: '11012', name: '반기보고서' },
  '11013': { code: '11013', name: '1분기보고서' },
  '11014': { code: '11014', name: '3분기보고서' },
};


