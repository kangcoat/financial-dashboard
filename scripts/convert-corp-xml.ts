const fs = require('fs');
const path = require('path');
const { parseString } = require('xml2js');

interface CorpData {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
  modify_date: string;
}

const xmlFilePath = path.join(__dirname, '../corp.xml');
const outputPath = path.join(__dirname, '../src/data/corp.json');

// 출력 디렉토리가 없으면 생성
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// XML 파일 읽기
const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');

// XML을 JSON으로 변환
parseString(xmlContent, (err: any, result: any) => {
  if (err) {
    console.error('XML 파싱 오류:', err);
    process.exit(1);
  }

  // result.result.list 배열에서 데이터 추출
  const companies: CorpData[] = result.result.list.map((item: any) => ({
    corp_code: item.corp_code[0],
    corp_name: item.corp_name[0],
    corp_eng_name: item.corp_eng_name?.[0] || '',
    stock_code: item.stock_code?.[0] || '',
    modify_date: item.modify_date?.[0] || '',
  }));

  // JSON 파일로 저장
  fs.writeFileSync(outputPath, JSON.stringify(companies, null, 2), 'utf-8');
  
  console.log(`✅ 변환 완료: ${companies.length}개 회사 데이터가 ${outputPath}에 저장되었습니다.`);
});

