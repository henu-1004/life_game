using System;
using UnityEngine;
using LifeGame.Core;
using LifeGame.Pawn;

namespace LifeGame.UI
{
    public class LifeReportUI : MonoBehaviour
    {
        private bool isVisible = false;
        private PawnController deceasedPawn;
        private int finalAge;
        private string causeOfDeath;
        private string epitaph;
        private float globalWealthPercentile;

        private GUIStyle titleStyle;
        private GUIStyle epitaphStyle;
        private GUIStyle statBoxStyle;
        private bool stylesInited = false;

        public void ShowLifeSummary(PawnController pawn, int age, string cause)
        {
            deceasedPawn = pawn;
            finalAge = age;
            causeOfDeath = cause;

            // 글로벌 소득 백분위 계산 (지구 80억 인구 기준 간이 모델)
            float lifetimeUSD = pawn.stats.totalLifetimeEarningsUSD;
            if (lifetimeUSD > 1500000) globalWealthPercentile = 99.5f; // 상위 0.5%
            else if (lifetimeUSD > 800000) globalWealthPercentile = 96.0f; // 상위 4%
            else if (lifetimeUSD > 300000) globalWealthPercentile = 85.0f; // 상위 15%
            else if (lifetimeUSD > 100000) globalWealthPercentile = 65.0f; // 상위 35%
            else if (lifetimeUSD > 30000) globalWealthPercentile = 40.0f;
            else globalWealthPercentile = 15.0f;

            // 묘비명 생성
            if (age < 10) epitaph = "\"지구라는 별에 잠시 피었다 진 작고 순수한 꽃송이\"";
            else if (lifetimeUSD > 500000) epitaph = "\"치열한 자본주의의 파도를 넘어 남다른 족적을 남긴 자\"";
            else if (pawn.stats.intelligence > 75) epitaph = "\"지혜와 앎을 탐구하며 세상을 밝힌 탐구자\"";
            else epitaph = "\"주어진 운명 속에서 묵묵히 자신의 자리를 지켜낸 평범한 영웅\"";

            isVisible = true;
        }

        private void InitStyles()
        {
            if (stylesInited) return;

            titleStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 24,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter,
                normal = { textColor = new Color(1f, 0.85f, 0.4f) }
            };

            epitaphStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 15,
                fontStyle = FontStyle.Italic,
                alignment = TextAnchor.MiddleCenter,
                normal = { textColor = Color.cyan }
            };

            statBoxStyle = new GUIStyle(GUI.skin.box)
            {
                fontSize = 13,
                alignment = TextAnchor.UpperLeft,
                padding = new RectOffset(15, 15, 15, 15)
            };

            stylesInited = true;
        }

        private void OnGUI()
        {
            if (!isVisible || deceasedPawn == null) return;

            InitStyles();

            float w = 620f;
            float h = 530f;
            float x = (Screen.width - w) / 2f;
            float y = (Screen.height - h) / 2f;

            GUI.Box(new Rect(x, y, w, h), "");
            GUILayout.BeginArea(new Rect(x + 20, y + 20, w - 40, h - 40));

            GUILayout.Label("⚰️ 인생 결산 리포트 (The 8-Billion Index)", titleStyle);
            GUILayout.Space(5);
            GUILayout.Label(epitaph, epitaphStyle);
            GUILayout.Space(10);

            var c = deceasedPawn.stats.birthCountry;
            float lifeDiff = finalAge - (c != null ? c.lifeExpectancyYears : 70f);
            string lifeDiffStr = lifeDiff >= 0 ? $"+{lifeDiff:F1}년 더 장수" : $"{Mathf.Abs(lifeDiff):F1}년 조기 마감";

            string report =
                $"[ 신상 정보 ]\n" +
                $"• 출생: {c?.flagEmoji} {c?.countryName} ({deceasedPawn.stats.parentBackground?.incomeBracketName})\n" +
                $"• 향년: {finalAge}세 (원인: {causeOfDeath})\n" +
                $"• 최종 직업: {deceasedPawn.stats.currentOccupation}\n\n" +
                $"📊 [지구 80억 통계와의 비교]\n" +
                $"• 생애 총소득: ${deceasedPawn.stats.totalLifetimeEarningsUSD:N0} (지구 전체 상위 {100f - globalWealthPercentile:F1}%)\n" +
                $"• 최종 보유 자산: ${deceasedPawn.stats.currentWealthUSD:N0}\n" +
                $"• 수명 지표: 출생국 기대 수명({c?.lifeExpectancyYears}세) 대비 {lifeDiffStr}\n" +
                $"• 달성 스텟: 지능 {deceasedPawn.stats.intelligence:F0} | 매력 {deceasedPawn.stats.charm:F0} | 건강 {deceasedPawn.stats.health:F0}";

            GUILayout.Box(report, statBoxStyle, GUILayout.Height(280));

            GUILayout.FlexibleSpace();

            GUILayout.BeginHorizontal();
            if (GUILayout.Button("🎲 다시 80억 무작위 환생", GUILayout.Height(50)))
            {
                isVisible = false;
                GameManager.Instance.StartNewLife(GameMode.Random80Billion, null);
            }
            if (GUILayout.Button("🏳️ 국가 직접 선택으로 환생", GUILayout.Height(50)))
            {
                isVisible = false;
                var modeUI = FindObjectOfType<ModeSelectUI>();
                if (modeUI != null) modeUI.Show();
            }
            GUILayout.EndHorizontal();

            GUILayout.EndArea();
        }
    }
}
