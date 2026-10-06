using System;
using System.Collections.Generic;
using UnityEngine;
using LifeGame.Data;

namespace LifeGame.Pawn
{
    public class PawnStats : MonoBehaviour
    {
        [Header("Character Identity")]
        public string characterName = "플레이어";
        public CountryData birthCountry;
        public ParentBackground parentBackground;
        public List<TraitData> traits = new List<TraitData>();

        [Header("Core Attributes (0 ~ 100)")]
        [Range(0, 100)] public float health = 85f;
        [Range(0, 100)] public float intelligence = 50f;
        [Range(0, 100)] public float charm = 50f;

        [Header("Financial & Career")]
        public float currentWealthUSD = 500f;
        public float annualSalaryUSD = 0f;
        public string currentOccupation = "미취학 아동";
        public int careerLevel = 0;

        [Header("Life Milestones")]
        public float totalLifetimeEarningsUSD = 0f;
        public int yearsEducated = 0;
        public bool isEmployed = false;
        public bool isMarried = false;
        public int childrenCount = 0;

        public void InitializeFromBirth(CountryData country, ParentBackground bg, List<TraitData> initialTraits)
        {
            birthCountry = country;
            parentBackground = bg;
            traits = initialTraits ?? new List<TraitData>();

            // 부모 자산 일부 상속/지원금
            currentWealthUSD = bg.startingHouseholdSavingsUSD;
            currentOccupation = "유아 (0세)";

            // 국가별/특성별 기초 보정치
            health = Mathf.Clamp(75f + (country.healthcareIndex * 0.2f), 40f, 98f);
            intelligence = 45f + (country.educationIndex * 0.1f);
            charm = UnityEngine.Random.Range(40f, 65f);

            foreach (var t in traits)
            {
                health = Mathf.Clamp(health + t.healthBonus, 10f, 100f);
                charm = Mathf.Clamp(charm + t.charmBonus, 10f, 100f);
            }
        }

        public void ProcessYearlySettlement(int age)
        {
            // 나이대별 기본 신분 업데이트
            UpdateOccupationByAge(age);

            // 소득 및 생활비 정산
            if (annualSalaryUSD > 0)
            {
                float taxRate = 0.20f;
                float netIncome = annualSalaryUSD * (1f - taxRate);
                float livingCost = annualSalaryUSD * 0.65f;
                float annualSavings = netIncome - livingCost;

                currentWealthUSD += annualSavings;
                totalLifetimeEarningsUSD += netIncome;
            }

            // 노화에 따른 자연 건강 감쇠 (50세 이후 가속)
            if (age > 45)
            {
                float decayRate = (age - 45) * 0.18f;
                health = Mathf.Clamp(health - decayRate, 0f, 100f);
            }
        }

        private void UpdateOccupationByAge(int age)
        {
            if (age < 7)
            {
                currentOccupation = "미취학 아동";
                annualSalaryUSD = 0;
            }
            else if (age < 14)
            {
                currentOccupation = "초등학생";
                annualSalaryUSD = 0;
            }
            else if (age < 20)
            {
                currentOccupation = "중·고등학생";
                annualSalaryUSD = 0;
            }
            else if (age == 20 && !isEmployed)
            {
                // 성인 진입: 초기 일자리 자동 배정
                AssignInitialJob();
            }
        }

        private void AssignInitialJob()
        {
            isEmployed = true;
            float baseCountryGDP = birthCountry != null ? birthCountry.gdpPerCapitaUSD : 15000f;

            if (intelligence >= 75f)
            {
                currentOccupation = "전문직 / 엔지니어";
                careerLevel = 2;
                annualSalaryUSD = baseCountryGDP * 2.2f;
            }
            else if (intelligence >= 55f)
            {
                currentOccupation = "일반 사무직 / 공무원";
                careerLevel = 1;
                annualSalaryUSD = baseCountryGDP * 1.1f;
            }
            else
            {
                currentOccupation = "서비스 / 생산직 근로자";
                careerLevel = 0;
                annualSalaryUSD = baseCountryGDP * 0.7f;
            }
        }
    }
}
