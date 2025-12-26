import { FinancialDataRequest, OpenDartResponse } from '@/types';

const API_BASE_URL = 'https://opendart.fss.or.kr/api';

export class OpenDartClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENDART_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENDART_API_KEY가 설정되지 않았습니다.');
    }
  }

  /**
   * 단일회사 주요계정 조회
   */
  async getFinancialData(
    params: FinancialDataRequest
  ): Promise<OpenDartResponse> {
    const { corp_code, bsns_year, reprt_code } = params;

    const url = new URL(`${API_BASE_URL}/fnlttSinglAcnt.json`);
    url.searchParams.append('crtfc_key', this.apiKey);
    url.searchParams.append('corp_code', corp_code);
    url.searchParams.append('bsns_year', bsns_year);
    url.searchParams.append('reprt_code', reprt_code);

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenDartResponse = await response.json();

      // 에러 처리
      if (data.status !== '000') {
        throw new Error(`OpenDart API 오류: ${data.message} (코드: ${data.status})`);
      }

      return data;
    } catch (error) {
      console.error('OpenDart API 호출 오류:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스
let clientInstance: OpenDartClient | null = null;

export function getOpenDartClient(): OpenDartClient {
  if (!clientInstance) {
    clientInstance = new OpenDartClient();
  }
  return clientInstance;
}


