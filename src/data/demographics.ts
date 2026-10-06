import { CountryData, ParentBackground } from '../types';

export const COUNTRIES: CountryData[] = [
  {
    countryId: 'IN',
    countryName: '인도 (India)',
    continent: '남아시아',
    population: 1428000000,
    populationSharePercent: 17.85,
    gdpPerCapitaUSD: 2600,
    lifeExpectancyYears: 70.4,
    infantMortalityPer1000: 28.3,
    healthcareIndex: 48,
    educationIndex: 52,
    safetyIndex: 58,
    currencySymbol: '₹',
    flagEmoji: '🇮🇳',
    description: '세계 최대 인구 대국. 고도성장과 IT 허브가 공존하지만 빈부격차와 지역별 인프라 편차가 극심합니다.',
    endemicRisks: ['수질/대기오염', '치열한 계층경쟁', '의료 인프라 불균형']
  },
  {
    countryId: 'CN',
    countryName: '중국 (China)',
    continent: '동아시아',
    population: 1411000000,
    populationSharePercent: 17.63,
    gdpPerCapitaUSD: 12700,
    lifeExpectancyYears: 78.2,
    infantMortalityPer1000: 6.8,
    healthcareIndex: 72,
    educationIndex: 75,
    safetyIndex: 79,
    currencySymbol: '¥',
    flagEmoji: '🇨🇳',
    description: '거대한 경제 규모와 급속한 현대화. 입시(가오카오)와 취업 경쟁이 매우 치열합니다.',
    endemicRisks: ['초경쟁 입시', '번아웃', '환경 요인']
  },
  {
    countryId: 'US',
    countryName: '미국 (United States)',
    continent: '북미',
    population: 340000000,
    populationSharePercent: 4.25,
    gdpPerCapitaUSD: 76300,
    lifeExpectancyYears: 77.5,
    infantMortalityPer1000: 5.4,
    healthcareIndex: 85,
    educationIndex: 88,
    safetyIndex: 62,
    currencySymbol: '$',
    flagEmoji: '🇺🇸',
    description: '기회의 땅이자 높은 소득. 하지만 의료비 부담과 총기/치안 이슈가 상존합니다.',
    endemicRisks: ['초고액 의료비', '학자금 부채', '치안 불안정']
  },
  {
    countryId: 'NG',
    countryName: '나이지리아 (Nigeria)',
    continent: '아프리카',
    population: 224000000,
    populationSharePercent: 2.80,
    gdpPerCapitaUSD: 2180,
    lifeExpectancyYears: 53.6,
    infantMortalityPer1000: 72.0,
    healthcareIndex: 32,
    educationIndex: 40,
    safetyIndex: 38,
    currencySymbol: '₦',
    flagEmoji: '🇳🇬',
    description: '아프리카의 거인이자 빠른 인구 증가. 열악한 보건 인프라와 높은 영유아 사망률을 극복해야 합니다.',
    endemicRisks: ['풍토병(말라리아)', '영양실조', '인프라 부족']
  },
  {
    countryId: 'BR',
    countryName: '브라질 (Brazil)',
    continent: '남미',
    population: 216000000,
    populationSharePercent: 2.70,
    gdpPerCapitaUSD: 8900,
    lifeExpectancyYears: 72.8,
    infantMortalityPer1000: 13.5,
    healthcareIndex: 56,
    educationIndex: 60,
    safetyIndex: 45,
    currencySymbol: 'R$',
    flagEmoji: '🇧🇷',
    description: '열정적인 문화와 풍부한 천연자원. 치안과 경제 변동성이 큰 도전 과제입니다.',
    endemicRisks: ['치안 위험', '경제 불황', '도시 범죄']
  },
  {
    countryId: 'KR',
    countryName: '대한민국 (South Korea)',
    continent: '동아시아',
    population: 51700000,
    populationSharePercent: 0.64,
    gdpPerCapitaUSD: 33000,
    lifeExpectancyYears: 83.6,
    infantMortalityPer1000: 2.4,
    healthcareIndex: 92,
    educationIndex: 95,
    safetyIndex: 86,
    currencySymbol: '₩',
    flagEmoji: '🇰🇷',
    description: '세계 최고 수준의 치안과 건강보험, 높은 교육열. 하지만 극단적인 스트레스와 주거비가 특징입니다.',
    endemicRisks: ['학업/취업 스트레스', '비싼 주거비', '초고령화 빈곤']
  },
  {
    countryId: 'JP',
    countryName: '일본 (Japan)',
    continent: '동아시아',
    population: 125000000,
    populationSharePercent: 1.56,
    gdpPerCapitaUSD: 34000,
    lifeExpectancyYears: 84.8,
    infantMortalityPer1000: 1.8,
    healthcareIndex: 93,
    educationIndex: 92,
    safetyIndex: 90,
    currencySymbol: '¥',
    flagEmoji: '🇯🇵',
    description: '안정된 사회 인프라와 세계 최고 수준의 장수 국가. 초고령화와 지진 등 자연재해가 변수입니다.',
    endemicRisks: ['자연재해', '사회적 고립/히키코모리', '저성장']
  },
  {
    countryId: 'DE',
    countryName: '독일 (Germany)',
    continent: '유럽',
    population: 84000000,
    populationSharePercent: 1.05,
    gdpPerCapitaUSD: 48700,
    lifeExpectancyYears: 81.0,
    infantMortalityPer1000: 3.1,
    healthcareIndex: 90,
    educationIndex: 91,
    safetyIndex: 82,
    currencySymbol: '€',
    flagEmoji: '🇩🇪',
    description: '유럽 최대 경제국. 탄탄한 사회보장제도와 직업 교육 시스템이 잘 갖추어져 있습니다.',
    endemicRisks: ['고세율', '에너지/생활비 부담', '만성 질환']
  },
  {
    countryId: 'NO',
    countryName: '노르웨이 (Norway)',
    continent: '유럽',
    population: 5500000,
    populationSharePercent: 0.07,
    gdpPerCapitaUSD: 106000,
    lifeExpectancyYears: 83.2,
    infantMortalityPer1000: 1.9,
    healthcareIndex: 96,
    educationIndex: 96,
    safetyIndex: 93,
    currencySymbol: 'kr',
    flagEmoji: '🇳🇴',
    description: '복지 천국이자 최상위 행복지수. 스폰될 확률이 0.07%에 불과한 희귀한 행운의 땅입니다.',
    endemicRisks: ['백야/극야 계절우울증', '높은 물가']
  },
  {
    countryId: 'SO',
    countryName: '소말리아 (Somalia)',
    continent: '아프리카',
    population: 18000000,
    populationSharePercent: 0.22,
    gdpPerCapitaUSD: 500,
    lifeExpectancyYears: 56.5,
    infantMortalityPer1000: 75.0,
    healthcareIndex: 18,
    educationIndex: 22,
    safetyIndex: 20,
    currencySymbol: 'Sh',
    flagEmoji: '🇸🇴',
    description: '극심한 분쟁과 가뭄, 취약한 행정력. 생존 자체가 가장 치열한 도전이 되는 하드코어 지역입니다.',
    endemicRisks: ['전쟁 및 분쟁', '기근', '의료 공백']
  }
];

export function rollRandomCountry(): CountryData {
  const totalWeight = COUNTRIES.reduce((acc, c) => acc + c.populationSharePercent, 0);
  const roll = Math.random() * totalWeight;
  let cumulative = 0;
  for (const c of COUNTRIES) {
    cumulative += c.populationSharePercent;
    if (roll <= cumulative) return c;
  }
  return COUNTRIES[0];
}

export function generateParentBackground(country: CountryData): ParentBackground {
  const roll = Math.random() * 100;
  let quintile = 1;
  if (roll < 25) quintile = 1;
  else if (roll < 50) quintile = 2;
  else if (roll < 75) quintile = 3;
  else if (roll < 93) quintile = 4;
  else quintile = 5;

  switch (quintile) {
    case 1:
      return {
        incomeQuintile: 1,
        bracketName: '취약 계층 (하위 20%)',
        fatherJob: '일용직 근로자',
        motherJob: '가사 및 파트타임',
        housingType: '단칸방 / 노후 주택',
        savingsUSD: Math.round(country.gdpPerCapitaUSD * 0.15)
      };
    case 2:
      return {
        incomeQuintile: 2,
        bracketName: '서민층 (소득 2분위)',
        fatherJob: '소상공인 / 운전기사',
        motherJob: '서비스직 노동자',
        housingType: '작은 연립주택',
        savingsUSD: Math.round(country.gdpPerCapitaUSD * 0.5)
      };
    case 3:
      return {
        incomeQuintile: 3,
        bracketName: '중산층 (소득 3분위)',
        fatherJob: '일반 회사원',
        motherJob: '교사 / 사무직',
        housingType: '일반 아파트',
        savingsUSD: Math.round(country.gdpPerCapitaUSD * 1.5)
      };
    case 4:
      return {
        incomeQuintile: 4,
        bracketName: '상류 중산층 (소득 4분위)',
        fatherJob: '전문직 (엔지니어/금융)',
        motherJob: '공무원 / 연구원',
        housingType: '신축 대형 아파트',
        savingsUSD: Math.round(country.gdpPerCapitaUSD * 4.0)
      };
    case 5:
    default:
      return {
        incomeQuintile: 5,
        bracketName: '초부유층 (상위 7%)',
        fatherJob: '기업 임원 / 사업가',
        motherJob: '전문직 / 자산 관리',
        housingType: '고급 펜트하우스 / 저택',
        savingsUSD: Math.round(country.gdpPerCapitaUSD * 15.0)
      };
  }
}
