import React, { useState } from 'react';
import { LifeEvent, EventChoice } from '../types';
import { AlertCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface EventModalProps {
  event: LifeEvent;
  onResolve: (choice: EventChoice, isSuccess: boolean) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onResolve }) => {
  const [selectedChoice, setSelectedChoice] = useState<EventChoice | null>(null);
  const [outcome, setOutcome] = useState<{ isSuccess: boolean; text: string } | null>(null);

  const handleChoose = (choice: EventChoice) => {
    setSelectedChoice(choice);
    const isSuccess = Math.random() <= choice.successRate;
    setOutcome({
      isSuccess,
      text: isSuccess ? choice.successOutcome : choice.failureOutcome
    });
  };

  const handleContinue = () => {
    if (selectedChoice && outcome) {
      onResolve(selectedChoice, outcome.isSuccess);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-5 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 fill-current text-slate-950" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                나이: {event.age}세의 분기점
              </span>
              <h2 className="text-xl font-black mt-0.5">{event.title}</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!outcome ? (
            <>
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-slate-200 text-sm leading-relaxed">
                {event.narrative}
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  당신의 선택을 결정하세요:
                </span>
                {event.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoose(choice)}
                    className="w-full text-left p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 transition-all group flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                        {choice.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <span className="text-xs text-amber-400/90 font-medium">
                      조건 및 기대: {choice.hint} (성공률: {Math.round(choice.successRate * 100)}%)
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-5 py-2">
              <div className={`p-5 rounded-xl border flex items-start gap-3.5 ${
                outcome.isSuccess
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}>
                {outcome.isSuccess ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-base mb-1">
                    {outcome.isSuccess ? '선택 성공!' : '시련과 실패...'}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-200">
                    {outcome.text}
                  </p>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 transition-all shadow-lg active:scale-[0.99]"
              >
                인생 계속하기 (시간 재개)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
