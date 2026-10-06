import { Furniture } from '../types';

export const ROOM_WIDTH_TILES = 13;
export const ROOM_HEIGHT_TILES = 9;

export const DEFAULT_FURNITURE: Furniture[] = [
  {
    id: 'furn_bed',
    type: 'Bed',
    name: '편안한 침대',
    actionText: '침대에서 수면 중... 💤',
    x: 1,
    y: 1,
    width: 2.2,
    height: 2.8,
    color: '#3b82f6',
    accentColor: '#93c5fd',
    energyDelta: 24,
    hungerDelta: -1.0
  },
  {
    id: 'furn_desk',
    type: 'Desk',
    name: '학습용 책상',
    actionText: '책상에서 집중 공부 중... 📖',
    x: 1,
    y: 4.8,
    width: 2.2,
    height: 1.6,
    color: '#92400e',
    accentColor: '#d97706',
    intelDelta: 1.8,
    energyDelta: -1.5,
    funDelta: -1.0,
    mentalDelta: -0.5
  },
  {
    id: 'furn_pc',
    type: 'Computer',
    name: '게이밍 & 주식 PC',
    actionText: '컴퓨터로 게임 및 주식 분석 중... 💻',
    x: 4.5,
    y: 1,
    width: 2.2,
    height: 1.5,
    color: '#1e293b',
    accentColor: '#38bdf8',
    funDelta: 20,
    mentalDelta: 4,
    energyDelta: -1.5,
    wealthDelta: 12
  },
  {
    id: 'furn_fridge',
    type: 'Fridge',
    name: '양문형 냉장고',
    actionText: '냉장고에서 식사 및 간식 섭취 중... 🍔',
    x: 9.8,
    y: 1,
    width: 1.8,
    height: 2.2,
    color: '#e2e8f0',
    accentColor: '#94a3b8',
    hungerDelta: 32,
    funDelta: 2
  },
  {
    id: 'furn_shower',
    type: 'Shower',
    name: '욕실 & 샤워부스',
    actionText: '샤워 및 청결 유지 중... 🚿',
    x: 9.8,
    y: 4.8,
    width: 1.8,
    height: 2.2,
    color: '#06b6d4',
    accentColor: '#67e8f9',
    hygieneDelta: 38,
    mentalDelta: 6
  },
  {
    id: 'furn_sofa',
    type: 'Sofa',
    name: '거실 안락 소파',
    actionText: '소파에서 TV 시청 및 낮잠 중... 🛋️',
    x: 5.0,
    y: 4.8,
    width: 2.8,
    height: 1.6,
    color: '#be185d',
    accentColor: '#f472b6',
    energyDelta: 8,
    funDelta: 12,
    mentalDelta: 10
  },
  {
    id: 'furn_door',
    type: 'Door',
    name: '현관문 (외부 출근/등교)',
    actionText: '외출 및 학교/직장 근무 중... 🏢',
    x: 5.5,
    y: 7.8,
    width: 1.8,
    height: 0.9,
    color: '#78350f',
    accentColor: '#b45309',
    wealthDelta: 30,
    energyDelta: -3,
    funDelta: -2
  }
];
