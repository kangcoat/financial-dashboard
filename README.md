# 재무 데이터 시각화 분석 서비스

React와 Next.js를 활용한 재무 데이터 시각화 및 AI 분석 서비스입니다. OpenDart API를 통해 실제 재무 데이터를 가져와 시각화하고, Gemini AI로 쉬운 분석을 제공합니다.

## 주요 기능

1. **회사 검색**: corp.xml 데이터베이스를 활용한 회사명/종목코드 검색
2. **재무 데이터 시각화**: 
   - 재무상태표 차트 (막대 차트)
   - 손익계산서 차트 (선 차트)
   - 주요 재무 지표 카드
3. **AI 분석**: Gemini AI를 활용한 재무 데이터 분석 및 해석

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **차트**: Recharts
- **AI**: Google Gemini API
- **배포**: Vercel

## 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
OPENDART_API_KEY=your_opendart_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 회사 데이터 변환

corp.xml 파일을 프로젝트 루트에 배치한 후 다음 명령어를 실행하세요:

```bash
npx ts-node scripts/convert-corp-xml.ts
```

이 명령어는 `src/data/corp.json`과 `public/corp.json`을 생성합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
financial-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── financial-data/    # OpenDart API 프록시
│   │   │   └── ai-analysis/         # Gemini AI 분석 API
│   │   ├── dashboard/
│   │   │   └── [corpCode]/          # 재무 대시보드 페이지
│   │   ├── page.tsx                 # 메인 검색 페이지
│   │   └── layout.tsx
│   ├── components/
│   │   ├── search/                  # 회사 검색 컴포넌트
│   │   ├── charts/                  # 차트 컴포넌트
│   │   └── analysis/                # AI 분석 컴포넌트
│   ├── lib/
│   │   ├── opendart/                # OpenDart API 클라이언트
│   │   └── gemini/                  # Gemini API 클라이언트
│   ├── types/                       # TypeScript 타입 정의
│   └── data/
│       └── corp.json                # 회사 정보 데이터
├── scripts/
│   └── convert-corp-xml.ts          # XML → JSON 변환 스크립트
└── public/
    └── corp.json                    # 정적 회사 데이터
```

## API 사용

### OpenDart API

- **엔드포인트**: `/api/financial-data`
- **메서드**: GET
- **파라미터**:
  - `corp_code`: 회사 고유번호 (8자리)
  - `bsns_year`: 사업연도 (4자리)
  - `reprt_code`: 보고서 코드 (11011: 사업보고서, 11012: 반기, 11013: 1분기, 11014: 3분기)

### Gemini AI API

- **엔드포인트**: `/api/ai-analysis`
- **메서드**: POST
- **요청 본문**:
  ```json
  {
    "corp_name": "회사명",
    "financial_data": [...]
  }
  ```

## 배포 (Vercel)

1. GitHub에 프로젝트를 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인하고 프로젝트를 import합니다.
3. 환경변수를 Vercel 대시보드에 설정합니다:
   - `OPENDART_API_KEY`
   - `GEMINI_API_KEY`
4. 배포를 시작합니다.

## 주의사항

- API 키는 절대 공개 저장소에 커밋하지 마세요.
- OpenDart API는 일일 20,000건의 요청 제한이 있습니다.
- Gemini API는 사용량에 따라 비용이 발생할 수 있습니다.

## 라이선스

MIT
