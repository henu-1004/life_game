import { LifeEvent } from '../types';

export const LIFE_EVENTS: LifeEvent[] = [
  {
    id: 'EVT_CHILDHOOD_SICKNESS',
    title: '유아기 고열과 감염 질환',
    narrative: '면역력이 약한 어린 시절, 한밤중에 갑작스러운 40도 고열과 발작 증상이 찾아왔습니다. 부모님이 다급하게 치료 방식을 결정해야 합니다.',
    age: 3,
    choices: [
      {
        label: '대도시 종합병원 응급실로 직행해 정밀 처치를 받는다',
        hint: '의료비 $400 지출, 높은 완치율',
        successRate: 0.95,
        wealthDelta: -400,
        healthDelta: 15,
        mentalDelta: 5,
        successOutcome: '전문 의료진의 발 빠른 수액 및 항생제 투여로 후유증 없이 말끔히 회복했습니다.',
        failureOutcome: '병원비는 지출되었으나 약간의 기관지 천식 소인이 남았습니다.'
      },
      {
        label: '약국 해열제와 민간요법으로 집에서 간호한다',
        hint: '비용 절감 ($20), 위험성 상존',
        successRate: 0.65,
        wealthDelta: -20,
        healthDelta: -10,
        mentalDelta: -10,
        successOutcome: '다행히 3일간의 간호 끝에 스스로 열을 이겨내고 회복했습니다.',
        failureOutcome: '열이 너무 오래 지속되어 기초 체력과 면역계에 영구적인 손상을 입었습니다.'
      }
    ]
  },
  {
    id: 'EVT_TEEN_PEER_PRESSURE',
    title: '사춘기의 방황과 유혹',
    narrative: '중학교 시절, 또래 무리에서 은밀한 일탈(오토바이, 담배, 무단결석)을 권유하며 동조하지 않으면 따돌리겠다는 압박을 가해옵니다.',
    age: 14,
    choices: [
      {
        label: '유혹을 단호히 거절하고 독서실에서 혼자만의 길을 간다',
        hint: '지능 상승 (+15), 멘탈 소모 (-10), 매력 (-5)',
        successRate: 0.85,
        intelDelta: 15,
        mentalDelta: -10,
        charmDelta: -5,
        successOutcome: '혼자만의 고독을 학업 성취로 승화시켜 상위권 성적을 달성했습니다.',
        failureOutcome: '무리에서 겉돌며 일시적인 고립감과 우울감을 겪었습니다.'
      },
      {
        label: '친구들과 어울리며 골목길 사교성과 눈치를 익힌다',
        hint: '매력 상승 (+18), 학업 소홀 (-8)',
        successRate: 0.80,
        intelDelta: -8,
        charmDelta: 18,
        mentalDelta: 10,
        successOutcome: '사람을 다루고 위기를 모면하는 실전 사교 기술을 터득했습니다.',
        failureOutcome: '경찰 지구대에 불려가 부모님이 소환되는 곤욕을 치렀습니다.'
      }
    ]
  },
  {
    id: 'EVT_CAREER_ENTRANCE',
    title: '청년기의 갈림길: 사회 진출과 진로',
    narrative: '성인이 된 첫해. 당신의 앞길에 중요한 선택의 기로가 펼쳐집니다. 어떤 방식으로 자본주의 사회에 첫 발을 내딛겠습니까?',
    age: 20,
    choices: [
      {
        label: '학자금 대출을 내어 고등 교육/전문 학위를 취득한다',
        hint: '부채 -$5,000, 지능 +25, 장기 연봉 상승',
        successRate: 0.85,
        wealthDelta: -5000,
        intelDelta: 25,
        mentalDelta: -10,
        successOutcome: '전문 라이선스와 학위를 취득해 고소득 화이트칼라 직군에 안착했습니다.',
        failureOutcome: '학점 경쟁에 밀려 부채만 안고 졸업장을 받았습니다.'
      },
      {
        label: '곧장 산업 전선에 뛰어들어 일당과 실전 기술을 모은다',
        hint: '초기 종잣돈 +$4,000, 체력 소모',
        successRate: 0.90,
        wealthDelta: 4000,
        healthDelta: -5,
        intelDelta: 5,
        successOutcome: '또래보다 훨씬 빠른 속도로 경제적 자립과 종잣돈을 모았습니다.',
        failureOutcome: '열악한 작업 환경으로 인해 초기 관절에 무리가 왔습니다.'
      },
      {
        label: '대출을 받아 작은 스타트업/창업에 도전한다',
        hint: '대박 +$25,000 또는 파산 (성공 확률 50%)',
        successRate: 0.50,
        wealthDelta: 25000,
        mentalDelta: 20,
        charmDelta: 15,
        successOutcome: '시장의 뜨거운 반응을 이끌어내며 20대에 자수성가의 발판을 마련했습니다!',
        failureOutcome: '자본금 고갈로 1년 만에 폐업하고 빚더미를 안았습니다.'
      }
    ]
  },
  {
    id: 'EVT_MIDLIFE_OPPORTUNITY',
    title: '중년의 베팅: 위험한 투자 기회',
    narrative: '직장 생활 15년 차. 지인이 고수익을 약속하는 신흥 기술/해외 부동산 투자 펀드를 은밀히 소개해 왔습니다.',
    age: 38,
    choices: [
      {
        label: '모아둔 여유 자금의 40%를 공격적으로 투자한다',
        hint: '성공 시 +$35,000, 실패 시 -$15,000',
        successRate: 0.55,
        wealthDelta: 35000,
        mentalDelta: 15,
        successOutcome: '투자 자산 가치가 급등하여 조기 은퇴(FIRE)에 바짝 다가섰습니다!',
        failureOutcome: '사기성 펀드로 판명되어 피땀 흘려 모은 투자금을 날렸습니다.'
      },
      {
        label: '일확천금 대신 안전한 국채와 연금 저축을 선택한다',
        hint: '안정적 확정 수익 +$4,000, 리스크 제로',
        successRate: 1.0,
        wealthDelta: 4000,
        mentalDelta: 5,
        successOutcome: '시장 폭락장에서도 굳건하게 노후 자산을 지켜냈습니다.',
        failureOutcome: '큰 수익은 없었지만 평온한 가정을 유지했습니다.'
      }
    ]
  },
  {
    id: 'EVT_SENIOR_HEALTH_CRISIS',
    title: '황혼의 고비: 몸의 경고 신호',
    narrative: '어느덧 예순을 넘긴 나이. 정기 검진에서 심혈관 및 주요 장기에 중대한 이상 소견이 발견되었습니다.',
    age: 62,
    choices: [
      {
        label: '아끼지 않고 명의의 최신 표적 시술과 정밀 치료를 받는다',
        hint: '의료비 -$15,000, 건강 +30, 수명 10년 연장 기대',
        successRate: 0.88,
        wealthDelta: -15000,
        healthDelta: 30,
        mentalDelta: 10,
        successOutcome: '시술이 기적적으로 성공하여 통증 없이 활기찬 노년을 되찾았습니다.',
        failureOutcome: '고액의 치료비를 지출했으나 기력 회복이 더딥니다.'
      },
      {
        label: '자녀에게 부담 주지 않고 자연 치유와 소식으로 요양한다',
        hint: '비용 절감 (-$500), 건강 악화 위험',
        successRate: 0.60,
        wealthDelta: -500,
        healthDelta: -12,
        mentalDelta: -5,
        successOutcome: '자연 친화적 전원생활로 몸과 마음의 안정을 찾았습니다.',
        failureOutcome: '합병증이 서서히 번지며 거동이 불편해졌습니다.'
      }
    ]
  }
];
