using System;
using System.Collections.Generic;
using UnityEngine;

namespace LifeGame.Data
{
    [Serializable]
    public class ParentBackground
    {
        public int incomeQuintile;          // 1 (최하위 20%) ~ 5 (상위 20%)
        public string incomeBracketName;    // "취약 계층", "서민층", "중산층", "상류층", "초부유층"
        public string fatherJob;
        public string motherJob;
        public float startingHouseholdSavingsUSD;
        public string housingType;
        public float parentingSupportFactor; // 0.5 ~ 1.5
    }

    public static class DemographicsDatabase
    {
        private static List<CountryData> countries;

        public static List<CountryData> Countries
        {
            get
            {
                if (countries == null) Initialize();
                return countries;
            }
        }

        public static void Initialize()
        {
            countries = new List<CountryData>
            {
                new CountryData(
                    "IN", "인도 (India)", "남아시아", 1428000000, 17.85f,
                    2600f, 70.4f, 28.3f, 48f, 52f, 58f,
                    "INR", "₹", "🇮🇳",
                    "세계 최대 인구 대국. 고도성장과 IT 허브가 공존하지만 빈부격차와 지역별 인프라 편차가 극심합니다.",
                    new List<string> { "수질/대기오염", "치열한 계층경쟁", "의료 인프라 불균형" }
                ),
                new CountryData(
                    "CN", "중국 (China)", "동아시아", 1411000000, 17.63f,
                    12700f, 78.2f, 6.8f, 72f, 75f, 79f,
                    "CNY", "¥", "🇨🇳",
                    "거대한 경제 규모와 급속한 현대화. 입시(가오카오)와 취업 경쟁이 매우 치열합니다.",
                    new List<string> { "초경쟁 입시", "번아웃", "환경 요인" }
                ),
                new CountryData(
                    "US", "미국 (United States)", "북미", 340000000, 4.25f,
                    76300f, 77.5f, 5.4f, 85f, 88f, 62f,
                    "USD", "$", "🇺🇸",
                    "기회의 땅이자 높은 소득. 하지만 의료비 부담과 총기/치안 이슈가 상존합니다.",
                    new List<string> { "초고액 의료비", "학자금 부채", "치안 불안정" }
                ),
                new CountryData(
                    "NG", "나이지리아 (Nigeria)", "아프리카", 224000000, 2.80f,
                    2180f, 53.6f, 72.0f, 32f, 40f, 38f,
                    "NGN", "₦", "🇳🇬",
                    "아프리카의 거인이자 빠른 인구 증가. 열악한 보건 인프라와 높은 영유아 사망률을 극복해야 합니다.",
                    new List<string> { "풍토병(말라리아)", "영양실조", "인프라 부족" }
                ),
                new CountryData(
                    "BR", "브라질 (Brazil)", "남미", 216000000, 2.70f,
                    8900f, 72.8f, 13.5f, 56f, 60f, 45f,
                    "BRL", "R$", "🇧🇷",
                    "열정적인 문화와 풍부한 천연자원. 치안과 경제 변동성이 큰 도전 과제입니다.",
                    new List<string> { "치안 위험", "경제 불황", "도시 범죄" }
                ),
                new CountryData(
                    "KR", "대한민국 (South Korea)", "동아시아", 51700000, 0.64f,
                    33000f, 83.6f, 2.4f, 92f, 95f, 86f,
                    "KRW", "₩", "🇰🇷",
                    "세계 최고 수준의 치안과 건강보험, 높은 교육열. 하지만 극단적인 스트레스와 주거비가 특징입니다.",
                    new List<string> { "학업/취업 스트레스", "비싼 주거비", "노인 빈곤 위험" }
                ),
                new CountryData(
                    "JP", "일본 (Japan)", "동아시아", 125000000, 1.56f,
                    34000f, 84.8f, 1.8f, 93f, 92f, 90f,
                    "JPY", "¥", "🇯🇵",
                    "안정된 사회 인프라와 세계 최고 수준의 장수 국가. 초고령화와 지진 등 자연재해가 변수입니다.",
                    new List<string> { "자연재해", "사회적 고립/히키코모리", "저성장" }
                ),
                new CountryData(
                    "DE", "독일 (Germany)", "유럽", 84000000, 1.05f,
                    48700f, 81.0f, 3.1f, 90f, 91f, 82f,
                    "EUR", "€", "🇩🇪",
                    "유럽 최대 경제국. 탄탄한 사회보장제도와 직업 교육 시스템이 잘 갖추어져 있습니다.",
                    new List<string> { "고세율", "에너지/생활비 부담", "만성 질환" }
                ),
                new CountryData(
                    "NO", "노르웨이 (Norway)", "유럽", 5500000, 0.07f,
                    106000f, 83.2f, 1.9f, 96f, 96f, 93f,
                    "NOK", "kr", "🇳🇴",
                    "복지 천국이자 최상위 행복지수. 스폰될 확률이 0.07%에 불과한 희귀한 행운의 땅입니다.",
                    new List<string> { "백야/극야 계절우울증", "높은 물가" }
                ),
                new CountryData(
                    "SO", "소말리아 (Somalia)", "아프리카", 18000000, 0.22f,
                    500f, 56.5f, 75.0f, 18f, 22f, 20f,
                    "SOS", "Sh", "🇸🇴",
                    "극심한 분쟁과 가뭄, 취약한 행정력. 생존 자체가 가장 치열한 도전이 되는 하드코어 지역입니다.",
                    new List<string> { "전쟁 및 분쟁", "기근", "의료 공백" }
                )
            };
        }

        /// <summary>
        /// 실제 지구 80억 인구 비율에 따라 국가를 랜덤 롤링합니다.
        /// </summary>
        public static CountryData RollRandomCountryByPopulation()
        {
            if (countries == null) Initialize();

            float totalWeight = 0f;
            foreach (var c in countries) totalWeight += c.populationSharePercent;

            float roll = UnityEngine.Random.Range(0f, totalWeight);
            float cumulative = 0f;

            foreach (var c in countries)
            {
                cumulative += c.populationSharePercent;
                if (roll <= cumulative) return c;
            }

            return countries[0];
        }

        public static CountryData GetCountryById(string id)
        {
            if (countries == null) Initialize();
            return countries.Find(c => c.countryId.Equals(id, StringComparison.OrdinalIgnoreCase)) ?? countries[0];
        }

        /// <summary>
        /// 출생 국가의 경제/사회 지표에 따른 부모 계층(소득 5분위)을 생성합니다.
        /// </summary>
        public static ParentBackground GenerateParentBackground(CountryData country)
        {
            // 1분위 (25%), 2분위 (25%), 3분위 (25%), 4분위 (18%), 5분위 (7%)
            int quintile = 1;
            float roll = UnityEngine.Random.Range(0f, 100f);
            if (roll < 25f) quintile = 1;
            else if (roll < 50f) quintile = 2;
            else if (roll < 75f) quintile = 3;
            else if (roll < 93f) quintile = 4;
            else quintile = 5;

            var bg = new ParentBackground();
            bg.incomeQuintile = quintile;

            switch (quintile)
            {
                case 1:
                    bg.incomeBracketName = "취약 계층 (하위 20%)";
                    bg.fatherJob = "일용직 근로자";
                    bg.motherJob = "가사 및 파트타임";
                    bg.housingType = "단칸방 / 노후 주택";
                    bg.startingHouseholdSavingsUSD = country.gdpPerCapitaUSD * 0.15f;
                    bg.parentingSupportFactor = 0.6f;
                    break;
                case 2:
                    bg.incomeBracketName = "서민층 (소득 2분위)";
                    bg.fatherJob = "소상공인 / 운전기사";
                    bg.motherJob = "서비스직 노동자";
                    bg.housingType = "작은 연립주택";
                    bg.startingHouseholdSavingsUSD = country.gdpPerCapitaUSD * 0.5f;
                    bg.parentingSupportFactor = 0.8f;
                    break;
                case 3:
                    bg.incomeBracketName = "중산층 (소득 3분위)";
                    bg.fatherJob = "일반 회사원";
                    bg.motherJob = "교사 / 사무직";
                    bg.housingType = "일반 아파트";
                    bg.startingHouseholdSavingsUSD = country.gdpPerCapitaUSD * 1.5f;
                    bg.parentingSupportFactor = 1.0f;
                    break;
                case 4:
                    bg.incomeBracketName = "상류 중산층 (소득 4분위)";
                    bg.fatherJob = "전문직 (엔지니어/금융)";
                    bg.motherJob = "공무원 / 연구원";
                    bg.housingType = "신축 대형 아파트";
                    bg.startingHouseholdSavingsUSD = country.gdpPerCapitaUSD * 4.0f;
                    bg.parentingSupportFactor = 1.25f;
                    break;
                case 5:
                    bg.incomeBracketName = "초부유층 (상위 7%)";
                    bg.fatherJob = "기업 임원 / 사업가";
                    bg.motherJob = "전문직 / 자산 관리";
                    bg.housingType = "고급 펜트하우스 / 저택";
                    bg.startingHouseholdSavingsUSD = country.gdpPerCapitaUSD * 15.0f;
                    bg.parentingSupportFactor = 1.5f;
                    break;
            }

            return bg;
        }
    }
}
