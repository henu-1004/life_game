using System;
using System.Collections.Generic;
using UnityEngine;

namespace LifeGame.Data
{
    [Serializable]
    public class EventChoice
    {
        public string choiceLabel;
        public string requirementHint;
        public float baseSuccessRate = 1.0f; // 0.0 ~ 1.0
        public float healthDelta;
        public float wealthDelta;
        public float mentalDelta;
        public float intelligenceDelta;
        public float charmDelta;
        public string successOutcome;
        public string failureOutcome;
    }

    [Serializable]
    public class LifeEventData
    {
        public string eventId;
        public string title;
        [TextArea(3, 6)]
        public string narrativeText;
        public int triggerAge;
        public string specificCountryId; // null or empty for global
        public List<EventChoice> choices = new List<EventChoice>();
    }

    public static class EventDatabase
    {
        private static List<LifeEventData> events;

        public static List<LifeEventData> GetAllEvents()
        {
            if (events == null) Initialize();
            return events;
        }

        public static void Initialize()
        {
            events = new List<LifeEventData>
            {
                new LifeEventData
                {
                    eventId = "EVT_CHILDHOOD_SICKNESS",
                    title = "유아기 고열과 질병",
                    narrativeText = "면역력이 약한 어린 시절, 갑작스러운 고열과 감염 증상이 찾아왔습니다. 부모님이 당신을 안고 다급히 판단을 내려야 합니다.",
                    triggerAge = 3,
                    choices = new List<EventChoice>
                    {
                        new EventChoice
                        {
                            choiceLabel = "병원 응급실로 직행해 정밀 치료를 받는다",
                            requirementHint = "의료비 $500 지출",
                            baseSuccessRate = 0.95f,
                            wealthDelta = -500f,
                            healthDelta = 15f,
                            mentalDelta = 5f,
                            successOutcome = "신속한 의료 처치 덕분에 후유증 없이 건강을 온전히 회복했습니다.",
                            failureOutcome = "치료를 받았으나 약간의 호흡기 약화가 남았습니다."
                        },
                        new EventChoice
                        {
                            choiceLabel = "민간요법과 해열제로 집에서 간호한다",
                            requirementHint = "비용 절약, 건강 리스크 있음",
                            baseSuccessRate = 0.65f,
                            wealthDelta = -30f,
                            healthDelta = -10f,
                            mentalDelta = -10f,
                            successOutcome = "다행히 며칠간의 사투 끝에 열이 내렸습니다.",
                            failureOutcome = "열이 지속되어 기초 체력에 영구적인 손상을 입었습니다."
                        }
                    }
                },
                new LifeEventData
                {
                    eventId = "EVT_TEEN_STUDY_VS_REBELLION",
                    title = "사춘기의 방황과 진로",
                    narrativeText = "중학교 시절, 주변 친구들이 유흥과 탈선에 빠져들며 당신에게도 같이 어울리자고 권유합니다. 한편 다가오는 시험도 코앞입니다.",
                    triggerAge = 14,
                    choices = new List<EventChoice>
                    {
                        new EventChoice
                        {
                            choiceLabel = "친구들의 유혹을 뿌리치고 도서관에서 공부에 매진한다",
                            requirementHint = "지능 상승, 멘탈 소모",
                            baseSuccessRate = 0.85f,
                            intelligenceDelta = 15f,
                            mentalDelta = -10f,
                            charmDelta = -5f,
                            successOutcome = "성적이 수직 상승하며 우등생으로 자리매김했습니다.",
                            failureOutcome = "스트레스로 인해 약간의 번아웃 증상을 겪었습니다."
                        },
                        new EventChoice
                        {
                            choiceLabel = "친구들과 어울리며 인맥과 길거리 사교성을 키운다",
                            requirementHint = "매력 상승, 학업 소홀",
                            baseSuccessRate = 0.80f,
                            intelligenceDelta = -8f,
                            charmDelta = 18f,
                            mentalDelta = 10f,
                            successOutcome = "넓은 인맥과 능숙한 대인 관계 기술을 얻었습니다.",
                            failureOutcome = "위험한 패싸움에 휘말려 징계를 받았습니다."
                        }
                    }
                },
                new LifeEventData
                {
                    eventId = "EVT_CAREER_ENTRANCE",
                    title = "성인기의 첫 번째 선택: 진로와 청춘",
                    narrativeText = "사회에 첫 발을 내딛는 청년기. 인생의 경제적 궤도를 결정지을 중요한 선택의 순간이 찾아왔습니다.",
                    triggerAge = 20,
                    choices = new List<EventChoice>
                    {
                        new EventChoice
                        {
                            choiceLabel = "학자금 대출을 내어 고등 교육/명문 대학에 진학한다",
                            requirementHint = "지능 필요, 부채 발생, 장기 소득 포텐셜 ↑",
                            baseSuccessRate = 0.85f,
                            wealthDelta = -4000f,
                            intelligenceDelta = 25f,
                            mentalDelta = -10f,
                            successOutcome = "전문 학위를 취득하여 고소득 직군 취업의 문을 열었습니다.",
                            failureOutcome = "학점 경쟁에 밀려 부채만 안고 졸업했습니다."
                        },
                        new EventChoice
                        {
                            choiceLabel = "곧바로 산업 전선에 뛰어들어 실전 기술과 돈을 모은다",
                            requirementHint = "즉각적 현금 흐름 창출, 노동 강도 ↑",
                            baseSuccessRate = 0.90f,
                            wealthDelta = 3500f,
                            healthDelta = -5f,
                            intelligenceDelta = 5f,
                            successOutcome = "젊은 나이에 또래보다 빠른 초기 종잣돈을 모았습니다.",
                            failureOutcome = "열악한 노동 조건으로 피로가 누적되었습니다."
                        },
                        new EventChoice
                        {
                            choiceLabel = "빚을 내어 작은 스타트업/창업에 올인 도전한다",
                            requirementHint = "대박 또는 파산 위험 (성공 확률 50%)",
                            baseSuccessRate = 0.50f,
                            wealthDelta = 15000f,
                            mentalDelta = 20f,
                            charmDelta = 15f,
                            successOutcome = "시장의 틈새를 공략하여 초년기에 큰 사업 성공을 거두었습니다!",
                            failureOutcome = "자본금 부족으로 폐업하고 빚더미에 앉았습니다."
                        }
                    }
                },
                new LifeEventData
                {
                    eventId = "EVT_MIDLIFE_INVESTMENT",
                    title = "중년의 갈림길: 위험한 투자 기회",
                    narrativeText = "사회생활 15년 차, 한 지인이 확실한 수익을 보장한다는 해외 부동산 및 신흥 기술 투자 포트폴리오를 제안했습니다.",
                    triggerAge = 38,
                    choices = new List<EventChoice>
                    {
                        new EventChoice
                        {
                            choiceLabel = "여유 자산의 상당 부분을 공격적으로 베팅한다",
                            requirementHint = "고수익 or 원금 손실 위험",
                            baseSuccessRate = 0.55f,
                            wealthDelta = 30000f,
                            mentalDelta = 15f,
                            successOutcome = "투자 자산이 3배 폭등하여 계층 상승의 기틀을 마련했습니다!",
                            failureOutcome = "시장 급락으로 인해 모아둔 투자금 절반을 날렸습니다."
                        },
                        new EventChoice
                        {
                            choiceLabel = "유혹을 거절하고 안전한 정기예금과 연금에 집중한다",
                            requirementHint = "안정적 수익, 위험 제로",
                            baseSuccessRate = 1.0f,
                            wealthDelta = 3000f,
                            mentalDelta = 5f,
                            successOutcome = "인플레이션을 견디며 차분하게 노후 자금을 불렸습니다.",
                            failureOutcome = "대박은 없었지만 평온한 가계를 유지했습니다."
                        }
                    }
                },
                new LifeEventData
                {
                    eventId = "EVT_SENIOR_HEALTH",
                    title = "노년의 고비: 몸의 경고 신호",
                    narrativeText = "어느덧 환갑을 넘긴 나이. 정기 검진에서 심혈관 및 관절에 심각한 경고 신호가 감지되었습니다.",
                    triggerAge = 62,
                    choices = new List<EventChoice>
                    {
                        new EventChoice
                        {
                            choiceLabel = "자산을 아끼지 않고 최고 수준의 정밀 시술과 요양에 투자한다",
                            requirementHint = "의료비 $12,000 지출, 수명 연장",
                            baseSuccessRate = 0.90f,
                            wealthDelta = -12000f,
                            healthDelta = 25f,
                            mentalDelta = 10f,
                            successOutcome = "명의의 시술을 성공적으로 받고 10년 이상 건강한 일상을 되찾았습니다.",
                            failureOutcome = "고액을 지출했으나 기력 회복이 더딥니다."
                        },
                        new EventChoice
                        {
                            choiceLabel = "무리한 치료 대신 식단 관리와 가벼운 산책으로 자생력을 기른다",
                            requirementHint = "비용 절감, 건강 관리 실패 위험",
                            baseSuccessRate = 0.60f,
                            wealthDelta = -500f,
                            healthDelta = -10f,
                            mentalDelta = -5f,
                            successOutcome = "자연 친화적 요양으로 몸의 균형을 되찾았습니다.",
                            failureOutcome = "지병이 만성화되어 일상생활에 피로가 자주 찾아옵니다."
                        }
                    }
                }
            };
        }
    }
}
