import React, { useState } from 'react';
import { CountryData } from '../types';
import { COUNTRIES } from '../data/demographics';
import { Globe, Shuffle, Flag, Award, ShieldAlert, Sparkles } from 'lucide-react';

interface ModeSelectModalProps {
  onStart: (mode: 'random' | 'custom', country?: CountryData) => void;
}

export const ModeSelectModal: React.FC<ModeSelectModalProps> = ({ onStart }) => {
  const [tab, setTab] = useState<'random' | 'custom'>('random');
  const [selectedCountryId, setSelectedCountryId] = useState<string>('KR');

  const selectedCountry = COUNTRIES.find(c => c.countryId === selectedCountryId) || COUNTRIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-6 text-center border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
            <Globe className="w-3.5 h-3.5" /> 실제 지구 인구 통계 기반 라이프 시뮬레이터
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            PROJECT 1 / 8,000,000,000
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            80억 분의 1의 확률로 지구 어딘가에 스폰되어 살아가는 일생의 여정
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 p-3 gap-2 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => setTab('random')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              tab === 'random'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-orange-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" /> 80억 분의 1 무작위 스폰
          </button>
          <button
            onClick={() => setTab('custom')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              tab === 'custom'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Flag className="w-4 h-4" /> 국가 직접 선택 (샌드박스)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {tab === 'random' ? (
            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-3">
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> 리얼 확률 생성기
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  실제 지구 80억 인구의 가중치를 100% 반영하여 당신의 탄생지가 무작위로 추첨됩니다:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">남아시아/동아시아:</span>
                    <span className="font-bold text-amber-400 block text-sm mt-0.5">약 35.5%</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">아프리카 대륙:</span>
                    <span className="font-bold text-amber-400 block text-sm mt-0.5">약 18.0%</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">대한민국:</span>
                    <span className="font-bold text-emerald-400 block text-sm mt-0.5">약 0.64%</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">북미 (미국 등):</span>
                    <span className="font-bold text-blue-400 block text-sm mt-0.5">약 4.2%</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">유럽 복지국:</span>
                    <span className="font-bold text-purple-400 block text-sm mt-0.5">약 1.1%</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">노르웨이:</span>
                    <span className="font-bold text-pink-400 block text-sm mt-0.5">0.07% (초희귀)</span>
                  </div>
                </div>
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200">
                  💡 부모의 소득 계층(1~5분위)과 선천적 유전 특성(천재, 병약함, 강철체력 등)도 함께 부여됩니다.
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country Selection List */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2">
                <span className="text-xs font-semibold text-slate-400 px-1">국가 선택</span>
                {COUNTRIES.map(c => (
                  <button
                    key={c.countryId}
                    onClick={() => setSelectedCountryId(c.countryId)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between border transition-all ${
                      selectedCountryId === c.countryId
                        ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{c.flagEmoji} {c.countryName}</span>
                    <span className="text-xs text-slate-400 font-mono">${c.gdpPerCapitaUSD.toLocaleString()}</span>
                  </button>
                ))}
              </div>

              {/* Selected Country Specs */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span className="text-2xl">{selectedCountry.flagEmoji}</span> {selectedCountry.countryName}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                    {selectedCountry.continent}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">1인당 GDP:</span>
                    <p className="font-bold text-white font-mono">${selectedCountry.gdpPerCapitaUSD.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">평균 기대수명:</span>
                    <p className="font-bold text-white">{selectedCountry.lifeExpectancyYears}세</p>
                  </div>
                  <div>
                    <span className="text-slate-400">영유아 사망률:</span>
                    <p className="font-bold text-rose-400">{selectedCountry.infantMortalityPer1000}/1000명</p>
                  </div>
                  <div>
                    <span className="text-slate-400">보건 인프라:</span>
                    <p className="font-bold text-emerald-400">{selectedCountry.healthcareIndex} / 100</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {selectedCountry.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Start Button */}
        <div className="p-5 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => onStart(tab, tab === 'custom' ? selectedCountry : undefined)}
            className="w-full py-4 px-6 rounded-xl font-extrabold text-base transition-all bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Sparkles className="w-5 h-5" />
            {tab === 'random' ? '지구 80억 분의 1 확률로 태어나기' : `${selectedCountry.countryName}에서 인생 시작`}
          </button>
        </div>
      </div>
    </div>
  );
};
