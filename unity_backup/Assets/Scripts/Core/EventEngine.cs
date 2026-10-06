using System;
using System.Collections.Generic;
using UnityEngine;
using LifeGame.Data;
using LifeGame.Pawn;
using LifeGame.UI;

namespace LifeGame.Core
{
    public class EventEngine : MonoBehaviour
    {
        public static EventEngine Instance { get; private set; }

        private List<string> triggeredEventIds = new List<string>();

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Start()
        {
            if (TimeManager.Instance != null)
            {
                TimeManager.Instance.onYearElapsed += HandleYearElapsed;
            }
        }

        private void OnDestroy()
        {
            if (TimeManager.Instance != null)
            {
                TimeManager.Instance.onYearElapsed -= HandleYearElapsed;
            }
        }

        private void HandleYearElapsed(int age)
        {
            var pawn = FindObjectOfType<PawnController>();
            if (pawn == null) return;

            // 1. 연간 정산
            pawn.stats.ProcessYearlySettlement(age);

            // 2. 조기 사망 / 생존 롤링 (영유아 및 노년)
            if (CheckMortalityRoll(pawn, age))
            {
                return;
            }

            // 3. 나이대별 이벤트 트리거 검사
            CheckLifeEvents(pawn, age);
        }

        private bool CheckMortalityRoll(PawnController pawn, int age)
        {
            var country = pawn.stats.birthCountry;
            if (country == null) return false;

            // 영유아 시기(0~3세) 사망률 체크
            if (age <= 3)
            {
                // 천분율 기준
                float deathChancePercent = (country.infantMortalityPer1000 / 1000f) * 100f;
                // 건강 보너스에 따른 경감
                if (pawn.stats.health > 80f) deathChancePercent *= 0.5f;

                if (UnityEngine.Random.Range(0f, 100f) < deathChancePercent)
                {
                    TriggerDeath(pawn, "열악한 보건 환경으로 인한 영유아 감염병");
                    return true;
                }
            }

            // 노년기 자연사/질병 체크
            if (age >= 60 || pawn.stats.health <= 0f)
            {
                float baseDeathChance = Mathf.Max(0f, (age - country.lifeExpectancyYears) * 8f) + 2f;
                if (pawn.stats.health <= 10f) baseDeathChance += 40f;

                if (UnityEngine.Random.Range(0f, 100f) < baseDeathChance || pawn.stats.health <= 0f)
                {
                    string cause = pawn.stats.health <= 10f ? "누적된 만성 질환 합병증" : "노환으로 인한 평화로운 임종";
                    TriggerDeath(pawn, cause);
                    return true;
                }
            }

            return false;
        }

        private void CheckLifeEvents(PawnController pawn, int age)
        {
            var allEvents = EventDatabase.GetAllEvents();
            foreach (var evt in allEvents)
            {
                if (evt.triggerAge == age && !triggeredEventIds.Contains(evt.eventId))
                {
                    // 국가 필터 검사
                    if (!string.IsNullOrEmpty(evt.specificCountryId) &&
                        !evt.specificCountryId.Equals(pawn.stats.birthCountry?.countryId, StringComparison.OrdinalIgnoreCase))
                    {
                        continue;
                    }

                    triggeredEventIds.Add(evt.eventId);
                    TriggerEventPopup(evt, pawn);
                    break;
                }
            }
        }

        private void TriggerEventPopup(LifeEventData evt, PawnController pawn)
        {
            // 시간 일시정지
            TimeManager.Instance.SetSpeed(0f);

            var popupUI = FindObjectOfType<EventPopupUI>();
            if (popupUI != null)
            {
                popupUI.DisplayEvent(evt, pawn, (choice) =>
                {
                    ApplyEventChoice(choice, pawn);
                });
            }
        }

        private void ApplyEventChoice(EventChoice choice, PawnController pawn)
        {
            bool isSuccess = UnityEngine.Random.value <= choice.baseSuccessRate;

            pawn.stats.health = Mathf.Clamp(pawn.stats.health + choice.healthDelta, 0f, 100f);
            pawn.stats.currentWealthUSD += choice.wealthDelta;
            pawn.needs.mental = Mathf.Clamp(pawn.needs.mental + choice.mentalDelta, 0f, 100f);
            pawn.stats.intelligence = Mathf.Clamp(pawn.stats.intelligence + choice.intelligenceDelta, 0f, 100f);
            pawn.stats.charm = Mathf.Clamp(pawn.stats.charm + choice.charmDelta, 0f, 100f);
        }

        public void TriggerDeath(PawnController pawn, string cause)
        {
            TimeManager.Instance.SetSpeed(0f);
            var reportUI = FindObjectOfType<LifeReportUI>();
            if (reportUI != null)
            {
                reportUI.ShowLifeSummary(pawn, TimeManager.Instance.currentAge, cause);
            }
        }
    }
}
