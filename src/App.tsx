import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CountryData, ParentBackground, Trait, Needs, Stats, ScheduledActivity, Furniture, LifeEvent, EventChoice, LifeSummary } from './types';
import { COUNTRIES, rollRandomCountry, generateParentBackground } from './data/demographics';
import { rollStartingTraits } from './data/traits';
import { LIFE_EVENTS } from './data/events';
import { DEFAULT_FURNITURE } from './engine/furnitureData';
import { GameCanvas } from './engine/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { ModeSelectModal } from './components/ModeSelectModal';
import { ScheduleModal } from './components/ScheduleModal';
import { EventModal } from './components/EventModal';
import { LifeReportModal } from './components/LifeReportModal';

export const App: React.FC = () => {
  // Modal states
  const [isModeSelectOpen, setIsModeSelectOpen] = useState<boolean>(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [activeEvent, setActiveEvent] = useState<LifeEvent | null>(null);
  const [lifeSummary, setLifeSummary] = useState<LifeSummary | null>(null);

  // Character Core
  const [country, setCountry] = useState<CountryData>(COUNTRIES[5]); // Default Korea
  const [parentBg, setParentBg] = useState<ParentBackground>(() => generateParentBackground(COUNTRIES[5]));
  const [traits, setTraits] = useState<Trait[]>(() => rollStartingTraits(2));

  // Needs & Stats
  const [needs, setNeeds] = useState<Needs>({
    hunger: 80,
    energy: 85,
    hygiene: 90,
    fun: 75,
    mental: 85,
    social: 70
  });

  const [stats, setStats] = useState<Stats>({
    health: 85,
    intelligence: 50,
    charm: 50,
    wealthUSD: 1000,
    totalEarningsUSD: 0,
    occupation: '미취학 아동 (0세)',
    annualSalaryUSD: 0,
    careerLevel: 0
  });

  // Time & Routine
  const [age, setAge] = useState<number>(0);
  const [year, setYear] = useState<number>(2024);
  const [hour, setHour] = useState<number>(8);
  const [speed, setSpeed] = useState<number>(1);
  const [schedule, setSchedule] = useState<ScheduledActivity[]>(() => {
    const s: ScheduledActivity[] = new Array(24).fill('FreeTime');
    for (let h = 0; h < 24; h++) {
      if (h >= 23 || h < 7) s[h] = 'Sleep';
      else if (h >= 8 && h < 18) s[h] = 'WorkOrStudy';
      else if (h >= 18 && h < 21) s[h] = 'Recreation';
    }
    return s;
  });

  // Pawn 2D Position & Navigation
  const [pawnPos, setPawnPos] = useState<{ x: number; y: number }>({ x: 6, y: 5 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [activeFurniture, setActiveFurniture] = useState<Furniture | null>(null);
  const [currentAction, setCurrentAction] = useState<string>('주변을 둘러보는 중...');
  const [isPlayerForced, setIsPlayerForced] = useState<boolean>(false);
  const [triggeredEventIds, setTriggeredEventIds] = useState<string[]>([]);

  const isMentalBroken = needs.mental <= 20;

  // 1. New Life Setup
  const handleStartLife = (mode: 'random' | 'custom', chosenCountry?: CountryData) => {
    const selectedCountry = mode === 'random' ? rollRandomCountry() : (chosenCountry || COUNTRIES[5]);
    const bg = generateParentBackground(selectedCountry);
    const initialTraits = rollStartingTraits(2);

    setCountry(selectedCountry);
    setParentBg(bg);
    setTraits(initialTraits);

    // Initial stats
    const initialHealth = Math.min(98, Math.max(40, 75 + selectedCountry.healthcareIndex * 0.2 + (initialTraits.find(t => t.id === 'IRON_BODY') ? 15 : 0)));
    const initialIntel = 45 + selectedCountry.educationIndex * 0.1 + (initialTraits.find(t => t.id === 'GENIUS') ? 10 : 0);
    const initialCharm = 50 + (initialTraits.find(t => t.id === 'CHARISMATIC') ? 20 : 0);

    setStats({
      health: initialHealth,
      intelligence: initialIntel,
      charm: initialCharm,
      wealthUSD: bg.savingsUSD,
      totalEarningsUSD: 0,
      occupation: '미취학 아동 (0세)',
      annualSalaryUSD: 0,
      careerLevel: 0
    });

    setNeeds({
      hunger: 80,
      energy: 85,
      hygiene: 90,
      fun: 75,
      mental: 85,
      social: 70
    });

    setAge(0);
    setYear(2024);
    setHour(8);
    setSpeed(1);
    setPawnPos({ x: 6, y: 5 });
    setTargetPos(null);
    setActiveFurniture(null);
    setCurrentAction('지구에 첫 숨을 내쉬었습니다.');
    setIsPlayerForced(false);
    setTriggeredEventIds([]);

    setIsModeSelectOpen(false);
    setLifeSummary(null);
  };

  // 2. Direct Player Override Command (Click Furniture)
  const handleSelectFurniture = (furniture: Furniture) => {
    setIsPlayerForced(true);
    setActiveFurniture(null);
    setCurrentAction(`${furniture.name}(으)로 직접 이동 중...`);
    // target position is slightly in front of furniture
    setTargetPos({ x: furniture.x + furniture.width / 2, y: furniture.y + furniture.height + 0.5 });
  };

  // 3. Autonomous Routine Scheduler Evaluation
  const evaluateAutonomousAction = useCallback(() => {
    if (isPlayerForced || targetPos !== null) return;

    // 1st priority: Emergency biological need
    let neededType: string | null = null;
    if (needs.energy < 22) neededType = 'Bed';
    else if (needs.hunger < 25) neededType = 'Fridge';
    else if (needs.hygiene < 20) neededType = 'Shower';
    else if (needs.mental < 25) neededType = 'Sofa';

    // 2nd priority: Scheduled routine
    if (!neededType) {
      const scheduled = schedule[hour];
      if (scheduled === 'Sleep') neededType = 'Bed';
      else if (scheduled === 'WorkOrStudy') neededType = Math.random() > 0.5 ? 'Desk' : 'Computer';
      else if (scheduled === 'Recreation') neededType = Math.random() > 0.5 ? 'Computer' : 'Sofa';
      else neededType = needs.hunger < 60 ? 'Fridge' : 'Sofa';
    }

    const targetFurn = DEFAULT_FURNITURE.find(f => f.type === neededType) || DEFAULT_FURNITURE[0];
    if (activeFurniture?.id !== targetFurn.id) {
      setActiveFurniture(null);
      setCurrentAction(`일과에 따라 ${targetFurn.name}(으)로 이동 중...`);
      setTargetPos({ x: targetFurn.x + targetFurn.width / 2, y: targetFurn.y + targetFurn.height + 0.5 });
    }
  }, [isPlayerForced, targetPos, needs, schedule, hour, activeFurniture]);

  // 4. Annual Settlement & Mortality Roll
  const processYearlySettlement = (newAge: number) => {
    // 1. Mortality check
    if (newAge <= 3) {
      const infantChance = (country.infantMortalityPer1000 / 1000) * 100;
      if (Math.random() * 100 < (stats.health > 80 ? infantChance * 0.5 : infantChance)) {
        triggerDeath('열악한 보건 환경으로 인한 영유아 감염병');
        return;
      }
    }

    if (newAge >= 60 || stats.health <= 5) {
      const oldAgeDeathChance = Math.max(0, (newAge - country.lifeExpectancyYears) * 8) + 3;
      if (Math.random() * 100 < oldAgeDeathChance || stats.health <= 0) {
        triggerDeath(stats.health <= 10 ? '누적된 만성 질환 합병증' : '노환으로 인한 평화로운 임종');
        return;
      }
    }

    // 2. Career & Occupation updates
    setStats(prev => {
      let occ = prev.occupation;
      let salary = prev.annualSalaryUSD;

      if (newAge < 7) {
        occ = `미취학 아동 (${newAge}세)`;
        salary = 0;
      } else if (newAge < 14) {
        occ = `초등학생 (${newAge}세)`;
        salary = 0;
      } else if (newAge < 20) {
        occ = `중·고등학생 (${newAge}세)`;
        salary = 0;
      } else if (newAge === 20 && prev.annualSalaryUSD === 0) {
        // Initial Job assignment
        if (prev.intelligence >= 75) {
          occ = '전문직 연구원 / 엔지니어';
          salary = country.gdpPerCapitaUSD * 2.2;
        } else if (prev.intelligence >= 55) {
          occ = '일반 사무직 / 공무원';
          salary = country.gdpPerCapitaUSD * 1.1;
        } else {
          occ = '서비스 / 생산직 근로자';
          salary = country.gdpPerCapitaUSD * 0.7;
        }
      }

      // Savings & Earnings
      let savings = prev.wealthUSD;
      let totalEarn = prev.totalEarningsUSD;
      if (salary > 0) {
        const net = salary * 0.8;
        const livingCost = salary * 0.65;
        savings += (net - livingCost);
        totalEarn += net;
      }

      // Old age health decay
      let health = prev.health;
      if (newAge > 45) {
        health = Math.max(0, health - (newAge - 45) * 0.16);
      }

      return {
        ...prev,
        occupation: occ,
        annualSalaryUSD: salary,
        wealthUSD: savings,
        totalEarningsUSD: totalEarn,
        health
      };
    });

    // 3. Life Events Trigger check
    const matchedEvent = LIFE_EVENTS.find(
      e => e.age === newAge && !triggeredEventIds.includes(e.id)
    );

    if (matchedEvent) {
      setTriggeredEventIds(prev => [...prev, matchedEvent.id]);
      setSpeed(0); // Pause simulation
      setActiveEvent(matchedEvent);
    }
  };

  const triggerDeath = (cause: string) => {
    setSpeed(0);
    const earnings = stats.totalEarningsUSD;
    let percentile = 25;
    if (earnings > 1500000) percentile = 99.5;
    else if (earnings > 800000) percentile = 96.0;
    else if (earnings > 300000) percentile = 85.0;
    else if (earnings > 100000) percentile = 65.0;
    else if (earnings > 30000) percentile = 40.0;

    let epitaph = '"주어진 운명 속에서 묵묵히 자신의 자리를 지켜낸 평범한 영웅"';
    if (age < 10) epitaph = '"지구라는 별에 잠시 피었다 진 작고 순수한 꽃송이"';
    else if (earnings > 500000) epitaph = '"치열한 자본주의의 파도를 넘어 남다른 족적을 남긴 자"';
    else if (stats.intelligence > 75) epitaph = '"지혜와 앎을 탐구하며 세상을 밝힌 탐구자"';

    setLifeSummary({
      finalAge: age,
      causeOfDeath: cause,
      totalEarningsUSD: earnings,
      finalWealthUSD: stats.wealthUSD,
      wealthPercentile: percentile,
      lifeDiff: age - country.lifeExpectancyYears,
      epitaph
    });
  };

  // 5. Game Loop Tick
  useEffect(() => {
    if (speed === 0 || isModeSelectOpen || activeEvent || lifeSummary) return;

    // 1 year = 60s at 1x speed. 24 hours per year -> 1 hour = 2.5s / speed
    const tickIntervalMs = 100;
    const hourDurationSeconds = 2.5 / speed;
    let accumulatedTime = 0;

    const interval = setInterval(() => {
      accumulatedTime += tickIntervalMs / 1000;

      // Smooth Pawn Movement to target
      if (targetPos) {
        setPawnPos(curr => {
          const dx = targetPos.x - curr.x;
          const dy = targetPos.y - curr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const step = 0.35 * speed;

          if (dist < step) {
            // Arrived
            const arrivedFurn = DEFAULT_FURNITURE.find(
              f => Math.abs(f.x + f.width / 2 - targetPos.x) < 1 && Math.abs(f.y + f.height + 0.5 - targetPos.y) < 1
            );
            setActiveFurniture(arrivedFurn || null);
            setTargetPos(null);
            if (arrivedFurn) setCurrentAction(arrivedFurn.actionText);
            return targetPos;
          } else {
            return {
              x: curr.x + (dx / dist) * step,
              y: curr.y + (dy / dist) * step
            };
          }
        });
      }

      // Needs decay and active furniture effects
      const dt = (tickIntervalMs / 1000) * speed;
      setNeeds(prev => {
        let hungerD = -1.8 * dt;
        let energyD = -1.4 * dt;
        let hygieneD = -1.0 * dt;
        let funD = -1.2 * dt;
        let mentalD = -0.8 * dt;
        let socialD = -0.9 * dt;

        if (activeFurniture) {
          if (activeFurniture.hungerDelta) hungerD = activeFurniture.hungerDelta * dt;
          if (activeFurniture.energyDelta) energyD = activeFurniture.energyDelta * dt;
          if (activeFurniture.hygieneDelta) hygieneD = activeFurniture.hygieneDelta * dt;
          if (activeFurniture.funDelta) funD = activeFurniture.funDelta * dt;
          if (activeFurniture.mentalDelta) mentalD = activeFurniture.mentalDelta * dt;
        }

        // Low needs penalty to mental
        let mentalPenalty = 0;
        if (prev.hunger < 20) mentalPenalty += 1.5 * dt;
        if (prev.energy < 15) mentalPenalty += 2.0 * dt;

        return {
          hunger: Math.max(0, Math.min(100, prev.hunger + hungerD)),
          energy: Math.max(0, Math.min(100, prev.energy + energyD)),
          hygiene: Math.max(0, Math.min(100, prev.hygiene + hygieneD)),
          fun: Math.max(0, Math.min(100, prev.fun + funD)),
          mental: Math.max(0, Math.min(100, prev.mental + mentalD - mentalPenalty)),
          social: Math.max(0, Math.min(100, prev.social + socialD))
        };
      });

      // Hour elapsed check
      if (accumulatedTime >= hourDurationSeconds) {
        accumulatedTime = 0;
        setHour(prevHour => {
          const nextHour = (prevHour + 1) % 24;
          if (nextHour === 0) {
            // New Year tick!
            setYear(y => y + 1);
            setAge(a => {
              const nextAge = a + 1;
              processYearlySettlement(nextAge);
              return nextAge;
            });
          }
          return nextHour;
        });

        // Trigger autonomous check every couple of hours
        evaluateAutonomousAction();
      }
    }, tickIntervalMs);

    return () => clearInterval(interval);
  }, [speed, isModeSelectOpen, activeEvent, lifeSummary, targetPos, activeFurniture, country, stats, evaluateAutonomousAction]);

  // 6. Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpeed(s => (s === 0 ? 1 : 0));
      } else if (e.key === '1') setSpeed(1);
      else if (e.key === '2') setSpeed(2);
      else if (e.key === '3') setSpeed(4);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden flex items-center justify-center font-sans">
      {/* 2D Top-down Canvas View */}
      <GameCanvas
        currentHour={hour}
        pawnPos={pawnPos}
        targetPos={targetPos}
        activeFurniture={activeFurniture}
        currentAction={currentAction}
        isMentalBroken={isMentalBroken}
        onSelectFurniture={handleSelectFurniture}
      />

      {/* RimWorld-style Game HUD */}
      {!isModeSelectOpen && (
        <GameHUD
          country={country}
          parentBg={parentBg}
          traits={traits}
          needs={needs}
          stats={stats}
          age={age}
          year={year}
          hour={hour}
          speed={speed}
          currentAction={currentAction}
          isMentalBroken={isMentalBroken}
          onSpeedChange={setSpeed}
          onOpenSchedule={() => setIsScheduleOpen(true)}
        />
      )}

      {/* Start / Mode Select Modal */}
      {isModeSelectOpen && (
        <ModeSelectModal onStart={handleStartLife} />
      )}

      {/* 24-Hour Routine Scheduler Modal */}
      {isScheduleOpen && (
        <ScheduleModal
          currentSchedule={schedule}
          onSave={newSchedule => {
            setSchedule(newSchedule);
            setIsPlayerForced(false);
          }}
          onClose={() => setIsScheduleOpen(false)}
        />
      )}

      {/* Life Event Dilemma Modal */}
      {activeEvent && (
        <EventModal
          event={activeEvent}
          onResolve={(choice, isSuccess) => {
            if (isSuccess) {
              setStats(s => ({
                ...s,
                health: Math.min(100, Math.max(0, s.health + (choice.healthDelta || 0))),
                wealthUSD: s.wealthUSD + (choice.wealthDelta || 0),
                intelligence: Math.min(100, Math.max(0, s.intelligence + (choice.intelDelta || 0))),
                charm: Math.min(100, Math.max(0, s.charm + (choice.charmDelta || 0)))
              }));
              setNeeds(n => ({
                ...n,
                mental: Math.min(100, Math.max(0, n.mental + (choice.mentalDelta || 0)))
              }));
            } else {
              setStats(s => ({
                ...s,
                health: Math.min(100, Math.max(0, s.health - 10)),
                wealthUSD: s.wealthUSD + (choice.wealthDelta ? choice.wealthDelta * 0.5 : 0)
              }));
              setNeeds(n => ({
                ...n,
                mental: Math.max(0, n.mental - 15)
              }));
            }
            setActiveEvent(null);
            setSpeed(1); // Resume
          }}
        />
      )}

      {/* Life Report / Mortality Modal */}
      {lifeSummary && (
        <LifeReportModal
          summary={lifeSummary}
          country={country}
          parentBg={parentBg}
          stats={stats}
          onReincarnate={mode => {
            if (mode === 'random') {
              handleStartLife('random');
            } else {
              setIsModeSelectOpen(true);
              setLifeSummary(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default App;
