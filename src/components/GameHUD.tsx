import React from 'react';
import { CountryData, ParentBackground, Trait, Needs, Stats } from '../types';
import { Play, Pause, FastForward, Calendar, Heart, Brain, Sparkles, DollarSign, Briefcase, Home, ShieldAlert } from 'lucide-react';

interface GameHUDProps {
  country: CountryData;
  parentBg: ParentBackground;
  traits: Trait[];
  needs: Needs;
  stats: Stats;
  age: number;
  year: number;
  hour: number;
  speed: number;
  currentAction: string;
  isMentalBroken: boolean;
  onSpeedChange: (speed: number) => void;
  onOpenSchedule: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  country,
  parentBg,
  traits,
  needs,
  stats,
  age,
  year,
  hour,
  speed,
  currentAction,
  isMentalBroken,
  onSpeedChange,
  onOpenSchedule
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 p-4 flex flex-col justify-between overflow-hidden">
      {/* 1. TOP BAR */}
      <div className="flex items-center justify-between w-full">
        {/* Left: Life Title & Stage */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-3">
          <span className="text-2xl">{country.flagEmoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">{country.countryName}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                {parentBg.bracketName.split(' ')[0]}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {stats.occupation}
            </p>
          </div>
        </div>

        {/* Center: Time, Year, Age & Speed Controls */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-5 py-2.5 shadow-xl flex items-center gap-4">
          <div className="text-center pr-3 border-r border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">GAME TIME</span>
            <span className="font-extrabold text-amber-400 text-sm font-mono">
              {year}년 ({age}세) | {hour.toString().padStart(2, '0')}:00
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onSpeedChange(speed === 0 ? 1 : 0)}
              className={`p-2 rounded-lg font-bold text-xs transition-all ${
                speed === 0 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="일시정지 (Spacebar)"
            >
              {speed === 0 ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onSpeedChange(1)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                speed === 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="1배속 (1)"
            >
              1x
            </button>
            <button
              onClick={() => onSpeedChange(2)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                speed === 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="2배속 (2)"
            >
              2x
            </button>
            <button
              onClick={() => onSpeedChange(4)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                speed === 4 ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="4배속 (3)"
            >
              4x
            </button>
          </div>

          <button
            onClick={onOpenSchedule}
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition-all"
          >
            <Calendar className="w-3.5 h-3.5" /> 24h 일과표
          </button>
        </div>

        {/* Right: Currency & Wealth */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">보유 자산</span>
            <span className="font-extrabold text-emerald-400 text-base font-mono">
              ${Math.round(stats.wealthUSD).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE PANELS (Left Profile & Right Needs) */}
      <div className="flex justify-between items-start my-auto w-full">
        {/* Left Side: Character Details & Traits */}
        <div className="pointer-events-auto w-64 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">캐릭터 프로필</h4>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1 text-slate-400"><Home className="w-3.5 h-3.5" /> 주거 환경:</span>
              <span className="font-medium">{parentBg.housingType}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1 text-slate-400"><Briefcase className="w-3.5 h-3.5" /> 연간 소득:</span>
              <span className="font-mono text-emerald-400">${Math.round(stats.annualSalaryUSD).toLocaleString()}/년</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">선천적 유전 특성</span>
            <div className="flex flex-wrap gap-1">
              {traits.map(t => (
                <span
                  key={t.id}
                  title={t.desc}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                    t.isPositive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="bg-slate-800/60 p-1.5 rounded-lg">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                <Heart className="w-3 h-3 text-rose-400" /> 건강
              </span>
              <span className="font-bold text-white font-mono">{Math.round(stats.health)}</span>
            </div>
            <div className="bg-slate-800/60 p-1.5 rounded-lg">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                <Brain className="w-3 h-3 text-blue-400" /> 지능
              </span>
              <span className="font-bold text-white font-mono">{Math.round(stats.intelligence)}</span>
            </div>
            <div className="bg-slate-800/60 p-1.5 rounded-lg">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                <Sparkles className="w-3 h-3 text-pink-400" /> 매력
              </span>
              <span className="font-bold text-white font-mono">{Math.round(stats.charm)}</span>
            </div>
          </div>
        </div>

        {/* Right Side: RimWorld 6 Needs Bars */}
        <div className="pointer-events-auto w-64 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">욕구 (Needs)</h4>
            {isMentalBroken && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded animate-pulse">
                <ShieldAlert className="w-3 h-3" /> 멘탈 붕괴!
              </span>
            )}
          </div>

          <NeedRow label="🍞 허기" value={needs.hunger} color="from-amber-500 to-orange-500" />
          <NeedRow label="⚡ 기력" value={needs.energy} color="from-blue-500 to-cyan-500" />
          <NeedRow label="🧼 위생" value={needs.hygiene} color="from-teal-500 to-emerald-500" />
          <NeedRow label="🎮 재미" value={needs.fun} color="from-purple-500 to-pink-500" />
          <NeedRow label="🧘 멘탈" value={needs.mental} color="from-rose-500 to-red-500" isDanger={needs.mental < 25} />
          <NeedRow label="💬 사교" value={needs.social} color="from-indigo-500 to-blue-500" />
        </div>
      </div>

      {/* 3. BOTTOM STATUS BAR */}
      <div className="flex justify-center w-full">
        <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-3 max-w-lg">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider shrink-0">
            현재 상태:
          </span>
          <span className="text-sm font-semibold text-white truncate">
            {currentAction}
          </span>
        </div>
      </div>
    </div>
  );
};

const NeedRow: React.FC<{ label: string; value: number; color: string; isDanger?: boolean }> = ({
  label,
  value,
  color,
  isDanger
}) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-slate-300 font-medium">{label}</span>
      <span className={`font-mono text-[11px] font-bold ${isDanger ? 'text-rose-400' : 'text-slate-400'}`}>
        {Math.round(value)}%
      </span>
    </div>
    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-300`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  </div>
);
