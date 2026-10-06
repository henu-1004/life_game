import { Trait } from '../types';

export const ALL_TRAITS: Trait[] = [
  {
    id: 'GENIUS',
    name: '수리 천재',
    desc: '학업과 논리 기술 습득 속도가 40% 빠릅니다.',
    isPositive: true,
    studyEfficiency: 1.4
  },
  {
    id: 'IRON_BODY',
    name: '강철 체력',
    desc: '피로도가 30% 천천히 쌓이고 기초 건강도가 높습니다.',
    isPositive: true,
    energyDecayRate: 0.7,
    healthBonus: 15
  },
  {
    id: 'CHARISMATIC',
    name: '타고난 매력',
    desc: '사람들과 쉽게 친해지며 사회적 교류 시 재미와 멘탈이 크게 증가합니다.',
    isPositive: true,
    charmBonus: 20
  },
  {
    id: 'WORKAHOLIC',
    name: '워커홀릭',
    desc: '일과 공부를 할 때 멘탈 감소가 50% 적고 업무 성과가 높습니다.',
    isPositive: true,
    workEfficiency: 1.3,
    mentalResilience: 1.2
  },
  {
    id: 'FRAGILE',
    name: '병약함',
    desc: '체력이 약하고 건강 감소 질병에 취약합니다.',
    isPositive: false,
    healthBonus: -20,
    energyDecayRate: 1.35
  },
  {
    id: 'ANXIOUS',
    name: '불안증 소인',
    desc: '스트레스와 멘탈 감소 속도가 35% 빠릅니다.',
    isPositive: false,
    mentalResilience: 0.65
  },
  {
    id: 'GLUTTON',
    name: '대식가',
    desc: '허기 소모 속도가 40% 빠르지만 식사 시 재미가 회복됩니다.',
    isPositive: false,
    hungerDecayRate: 1.4
  }
];

export function rollStartingTraits(count = 2): Trait[] {
  const pool = [...ALL_TRAITS];
  const selected: Trait[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return selected;
}
