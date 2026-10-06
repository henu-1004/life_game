export interface CountryData {
  countryId: string;
  countryName: string;
  continent: string;
  population: number;
  populationSharePercent: number; // e.g. 17.8
  gdpPerCapitaUSD: number;
  lifeExpectancyYears: number;
  infantMortalityPer1000: number;
  healthcareIndex: number; // 0 ~ 100
  educationIndex: number;  // 0 ~ 100
  safetyIndex: number;     // 0 ~ 100
  currencySymbol: string;
  flagEmoji: string;
  description: string;
  endemicRisks: string[];
}

export interface ParentBackground {
  incomeQuintile: number; // 1 ~ 5
  bracketName: string;
  fatherJob: string;
  motherJob: string;
  housingType: string;
  savingsUSD: number;
}

export interface Trait {
  id: string;
  name: string;
  desc: string;
  isPositive: boolean;
  hungerDecayRate?: number;
  energyDecayRate?: number;
  studyEfficiency?: number;
  workEfficiency?: number;
  mentalResilience?: number;
  healthBonus?: number;
  charmBonus?: number;
}

export interface Needs {
  hunger: number;  // 0 ~ 100
  energy: number;  // 0 ~ 100
  hygiene: number; // 0 ~ 100
  fun: number;     // 0 ~ 100
  mental: number;  // 0 ~ 100
  social: number;  // 0 ~ 100
}

export interface Stats {
  health: number;
  intelligence: number;
  charm: number;
  wealthUSD: number;
  totalEarningsUSD: number;
  occupation: string;
  annualSalaryUSD: number;
  careerLevel: number;
}

export type ScheduledActivity = 'Sleep' | 'WorkOrStudy' | 'Recreation' | 'FreeTime';

export type FurnitureType = 'Bed' | 'Desk' | 'Computer' | 'Fridge' | 'Shower' | 'Sofa' | 'Door';

export interface Furniture {
  id: string;
  type: FurnitureType;
  name: string;
  actionText: string;
  x: number; // grid coords
  y: number;
  width: number;
  height: number;
  color: string;
  accentColor: string;
  hungerDelta?: number;
  energyDelta?: number;
  hygieneDelta?: number;
  funDelta?: number;
  mentalDelta?: number;
  intelDelta?: number;
  wealthDelta?: number;
}

export interface EventChoice {
  label: string;
  hint: string;
  successRate: number; // 0.0 ~ 1.0
  healthDelta?: number;
  wealthDelta?: number;
  mentalDelta?: number;
  intelDelta?: number;
  charmDelta?: number;
  successOutcome: string;
  failureOutcome: string;
}

export interface LifeEvent {
  id: string;
  title: string;
  narrative: string;
  age: number;
  countryFilter?: string;
  choices: EventChoice[];
}

export interface LifeSummary {
  finalAge: number;
  causeOfDeath: string;
  totalEarningsUSD: number;
  finalWealthUSD: number;
  wealthPercentile: number;
  lifeDiff: number;
  epitaph: string;
}
