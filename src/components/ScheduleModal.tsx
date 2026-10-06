import React, { useState } from 'react';
import { ScheduledActivity } from '../types';
import { Calendar, Check, Clock, X } from 'lucide-react';

interface ScheduleModalProps {
  currentSchedule: ScheduledActivity[];
  onSave: (newSchedule: ScheduledActivity[]) => void;
  onClose: () => void;
}

const ACTIVITIES: { type: ScheduledActivity; label: string; color: string; desc: string }[] = [
  { type: 'Sleep', label: '수면 (Sleep)', color: 'bg-blue-600 border-blue-400 text-blue-100', desc: '기력 회복, 침대 이용' },
  { type: 'WorkOrStudy', label: '공부 / 업무', color: 'bg-amber-600 border-amber-400 text-amber-100', desc: '학업/소득 증가, 책상/출근' },
  { type: 'Recreation', label: '취미 / 여가', color: 'bg-purple-600 border-purple-400 text-purple-100', desc: '재미/멘탈 회복, PC/소파' },
  { type: 'FreeTime', label: '자유 시간', color: 'bg-emerald-600 border-emerald-400 text-emerald-100', desc: '허기/위생 등 자율 충족' }
];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ currentSchedule, onSave, onClose }) => {
  const [schedule, setSchedule] = useState<ScheduledActivity[]>([...currentSchedule]);
  const [activeBrush, setActiveBrush] = useState<ScheduledActivity>('WorkOrStudy');

  const handleHourClick = (hour: number) => {
    const updated = [...schedule];
    updated[hour] = activeBrush;
    setSchedule(updated);
  };

  const applyPreset = (presetName: 'balanced' | 'study' | 'workaholic') => {
    const updated: ScheduledActivity[] = new Array(24).fill('FreeTime');
    if (presetName === 'balanced') {
      // 23~06 수면, 08~17 공부/업무, 18~21 여가
      for (let h = 0; h < 24; h++) {
        if (h >= 23 || h < 7) updated[h] = 'Sleep';
        else if (h >= 8 && h < 18) updated[h] = 'WorkOrStudy';
        else if (h >= 18 && h < 21) updated[h] = 'Recreation';
      }
    } else if (presetName === 'study') {
      // 00~06 수면, 07~23 공부 올인
      for (let h = 0; h < 24; h++) {
        if (h < 6) updated[h] = 'Sleep';
        else if (h >= 7 && h < 23) updated[h] = 'WorkOrStudy';
      }
    } else if (presetName === 'workaholic') {
      // 01~06 수면, 07~21 업무
      for (let h = 0; h < 24; h++) {
        if (h >= 1 && h < 6) updated[h] = 'Sleep';
        else if (h >= 7 && h < 22) updated[h] = 'WorkOrStudy';
        else updated[h] = 'Recreation';
      }
    }
    setSchedule(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">림월드식 24시간 일과 스케줄러</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Activity Palette Brush */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400">지정할 활동 브러시 선택:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ACTIVITIES.map(act => (
                <button
                  key={act.type}
                  onClick={() => setActiveBrush(act.type)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    activeBrush === act.type
                      ? `${act.color} ring-2 ring-white shadow-lg`
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>{act.label}</span>
                  <span className="text-[10px] opacity-75 font-normal">{act.desc.split(',')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 24 Hour Slots Grid */}
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-semibold text-slate-400">24시간 시간표 (클릭하여 채우기):</span>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
              {schedule.map((act, hour) => {
                const config = ACTIVITIES.find(a => a.type === act)!;
                return (
                  <button
                    key={hour}
                    onClick={() => handleHourClick(hour)}
                    className={`py-2 px-1 rounded-lg border text-center font-mono transition-transform active:scale-95 flex flex-col items-center justify-center ${config.color}`}
                  >
                    <span className="text-[10px] opacity-80">{hour.toString().padStart(2, '0')}:00</span>
                    <span className="text-xs font-black truncate w-full">{config.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Presets */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
            <span className="text-slate-400">빠른 프리셋:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => applyPreset('balanced')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                표준 균형
              </button>
              <button
                onClick={() => applyPreset('study')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium"
              >
                입시 올인
              </button>
              <button
                onClick={() => applyPreset('workaholic')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-medium"
              >
                워커홀릭
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium text-sm"
          >
            취소
          </button>
          <button
            onClick={() => {
              onSave(schedule);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> 루틴 적용하기
          </button>
        </div>
      </div>
    </div>
  );
};
