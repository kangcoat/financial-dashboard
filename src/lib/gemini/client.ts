import { GoogleGenerativeAI } from '@google/generative-ai';
import { FinancialDataItem } from '@/types';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    // gemini-2.5-flash 사용
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });
  }

  /**
   * 재무 데이터를 분석하여 쉬운 설명 생성
   */
  async analyzeFinancialData(
    corpName: string,
    financialData: FinancialDataItem[]
  ): Promise<string> {
    // 재무 데이터를 구조화된 텍스트로 변환
    const dataSummary = this.formatFinancialData(financialData);

    const prompt = `당신은 재무 분석 전문가입니다. 다음 재무 데이터를 초보 투자자도 이해할 수 있도록 쉽고 명확하게 설명해주세요.

회사명: ${corpName}

재무 데이터:
${dataSummary}

다음 항목을 포함하여 분석해주세요:
1. 재무 상태 요약 (3-4줄로 핵심 요약)
2. 주요 강점과 약점 (구체적인 수치와 함께)
3. 투자 시 고려사항 (실용적인 조언)

한국어로 답변해주세요.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API 호출 오류:', error);
      throw error;
    }
  }

  /**
   * 재무 데이터를 읽기 쉬운 형식으로 포맷팅
   */
  private formatFinancialData(data: FinancialDataItem[]): string {
    // 재무상태표와 손익계산서 분리
    const balanceSheet = data.filter((item) => item.sj_div === 'BS');
    const incomeStatement = data.filter((item) => item.sj_div === 'IS');

    let summary = '';

    // 손익계산서 주요 항목
    const keyIncomeItems = ['매출액', '영업이익', '당기순이익'];
    summary += '=== 손익계산서 주요 항목 ===\n';
    incomeStatement
      .filter((item) => keyIncomeItems.includes(item.account_nm))
      .forEach((item) => {
        summary += `${item.account_nm}:\n`;
        summary += `  당기: ${this.formatAmount(item.thstrm_amount)}원\n`;
        summary += `  전기: ${this.formatAmount(item.frmtrm_amount)}원\n`;
        if (item.bfefrmtrm_amount) {
          summary += `  전전기: ${this.formatAmount(item.bfefrmtrm_amount)}원\n`;
        }
        summary += '\n';
      });

    // 재무상태표 주요 항목
    const keyBalanceItems = ['자산총계', '부채총계', '자본총계'];
    summary += '=== 재무상태표 주요 항목 ===\n';
    balanceSheet
      .filter((item) => keyBalanceItems.includes(item.account_nm))
      .forEach((item) => {
        summary += `${item.account_nm}:\n`;
        summary += `  당기: ${this.formatAmount(item.thstrm_amount)}원\n`;
        summary += `  전기: ${this.formatAmount(item.frmtrm_amount)}원\n`;
        if (item.bfefrmtrm_amount) {
          summary += `  전전기: ${this.formatAmount(item.bfefrmtrm_amount)}원\n`;
        }
        summary += '\n';
      });

    return summary;
  }

  /**
   * 금액 포맷팅 (천 단위 구분)
   */
  private formatAmount(amount: string): string {
    const num = parseInt(amount, 10);
    if (isNaN(num)) return amount;
    return num.toLocaleString('ko-KR');
  }
}

// 싱글톤 인스턴스
let clientInstance: GeminiClient | null = null;

export function getGeminiClient(): GeminiClient {
  if (!clientInstance) {
    clientInstance = new GeminiClient();
  }
  return clientInstance;
}

