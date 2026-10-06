import React from 'react';
import { LifeSummary, CountryData, Stats, ParentBackground } from '../types';
import { Award, RotateCcw, Skull, TrendingUp, Heart, Brain, Sparkles } from 'lucide-react';

interface LifeReportModalProps {
  summary: LifeSummary;
  country: CountryData;
  parentBg: ParentBackground;
  stats: Stats;
  onReincarnate: (mode: 'random' | 'custom') => void;
}

export const LifeReportModal: React.FC<LifeReportModalProps> = ({
  summary,
  country,
  parentBg,
  stats,
  onReincarnate
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 text-center border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2">
            <Skull className="w-3.5 h-3.5" /> 생애 완주 & 임종
          </div>
          <h2 className="text-3xl font-extrabold text-amber-400 tracking-tight">
            인생 결산 리포트: 80억 지수
          </h2>
          <p className="text-slate-400 text-sm mt-1 italic">
            {summary.epitaph}
          </p>
        </div>

        {/* Body Stats */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Identity Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">출생 국가</span>
              <p className="font-bold text-white text-sm mt-1 flex items-center gap-1">
                <span>{country.flagEmoji}</span> {country.countryName.split(' ')[0]}
              </p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">출생 계층</span>
              <p className="font-bold text-white text-sm mt-1">
                {parentBg.bracketName.split(' ')[0]}
              </p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">향년 / 사인</span>
              <p className="font-bold text-rose-400 text-sm mt-1">
                {summary.finalAge}세 ({summary.causeOfDeath.slice(0, 10)}...)
              </p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">최종 직업</span>
              <p className="font-bold text-amber-300 text-sm mt-1">
                {stats.occupation}
              </p>
            </div>
          </div>

          {/* 8-Billion Global Percentile Bar */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              지구 80억 인류와의 비교 데이터
            </h4>

            {/* Income Percentile */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">생애 누적 총소득: ${summary.totalEarningsUSD.toLocaleString()}</span>
                <span className="text-emerald-400 font-bold">
                  지구 상위 {(100 - summary.wealthPercentile).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-400 rounded-full transition-all duration-1000"
                  style={{ width: `${summary.wealthPercentile}%` }}
                />
              </div>
            </div>

            {/* Longevity compared to Country Expectancy */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">출생 국가 평균 기대수명 ({country.lifeExpectancyYears}세) 대비:</span>
              <span className={`font-bold ${summary.lifeDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {summary.lifeDiff >= 0 ? `+${summary.lifeDiff.toFixed(1)}년 더 장수` : `${Math.abs(summary.lifeDiff).toFixed(1)}년 조기 마감`}
              </span>
            </div>

            {/* Attributes summary */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">최종 지능</span>
                <p className="font-bold text-blue-400 text-sm">{Math.round(stats.intelligence)} / 100</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">최종 매력</span>
                <p className="font-bold text-pink-400 text-sm">{Math.round(stats.charm)} / 100</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">남긴 유산 자산</span>
                <p className="font-bold text-amber-400 text-sm">${Math.round(stats.wealthUSD).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-950/90 border-t border-slate-800 grid grid-cols-2 gap-3">
          <button
            onClick={() => onReincarnate('random')}
            className="py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4" /> 다시 80억 무작위 환생
          </button>
          <button
            onClick={() => onReincarnate('custom')}
            className="py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-blue-400" /> 국가 직접 선택으로 환생
          </button>
        </div>
      </div>
    </div>
  );
};
