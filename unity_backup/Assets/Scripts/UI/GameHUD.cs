using System;
using UnityEngine;
using LifeGame.Core;
using LifeGame.Pawn;

namespace LifeGame.UI
{
    public class GameHUD : MonoBehaviour
    {
        private PawnController pawn;
        private GUIStyle headerStyle;
        private GUIStyle boldStyle;
        private GUIStyle cardStyle;
        private GUIStyle buttonStyle;
        private GUIStyle alertStyle;
        private bool stylesInitialized = false;

        private void Start()
        {
            pawn = FindObjectOfType<PawnController>();
        }

        public void RefreshAll()
        {
            pawn = FindObjectOfType<PawnController>();
        }

        private void InitStyles()
        {
            if (stylesInitialized) return;

            headerStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 18,
                fontStyle = FontStyle.Bold,
                normal = { textColor = Color.white }
            };

            boldStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 13,
                fontStyle = FontStyle.Bold,
                normal = { textColor = Color.yellow }
            };

            cardStyle = new GUIStyle(GUI.skin.box)
            {
                padding = new RectOffset(10, 10, 10, 10)
            };

            buttonStyle = new GUIStyle(GUI.skin.button)
            {
                fontSize = 13,
                fontStyle = FontStyle.Bold
            };

            alertStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 14,
                fontStyle = FontStyle.Bold,
                normal = { textColor = Color.red }
            };

            stylesInitialized = true;
        }

        private void OnGUI()
        {
            if (GameManager.Instance == null || !GameManager.Instance.isGameActive) return;
            if (pawn == null) pawn = FindObjectOfType<PawnController>();
            if (pawn == null) return;

            InitStyles();

            // 1. 상단 타임 & 배속 컨트롤 바 (Top Center)
            DrawTopBar();

            // 2. 좌측 상단: 캐릭터 신분 & 경제 정보
            DrawProfilePanel();

            // 3. 우측: 6대 욕구 상태 바 (RimWorld Style Needs)
            DrawNeedsPanel();

            // 4. 하단 중앙: 현재 진행 중인 행동 / 상태 표시
            DrawStatusBar();
        }

        private void DrawTopBar()
        {
            float width = 450f;
            float height = 55f;
            float x = (Screen.width - width) / 2f;
            float y = 10f;

            GUI.Box(new Rect(x, y, width, height), "", cardStyle);
            GUILayout.BeginArea(new Rect(x + 10, y + 5, width - 20, height - 10));
            GUILayout.BeginHorizontal();

            // 나이 및 시간 정보
            int age = TimeManager.Instance != null ? TimeManager.Instance.currentAge : 0;
            int year = TimeManager.Instance != null ? TimeManager.Instance.currentYear : 2024;
            int hour = TimeManager.Instance != null ? TimeManager.Instance.currentHour : 8;

            GUILayout.Label($"📅 {year}년 ({age}세) | 🕒 {hour:D2}:00", headerStyle);

            GUILayout.FlexibleSpace();

            // 배속 버튼 (정지, 1x, 2x, 4x)
            float speed = TimeManager.Instance != null ? TimeManager.Instance.currentSpeedMultiplier : 1f;

            if (GUILayout.Button(Mathf.Approximately(speed, 0f) ? "▶ 재생" : "⏸ 정지", buttonStyle, GUILayout.Width(60), GUILayout.Height(30)))
            {
                TimeManager.Instance.TogglePause();
            }
            if (GUILayout.Button("1x", buttonStyle, GUILayout.Width(35), GUILayout.Height(30)))
            {
                TimeManager.Instance.SetSpeed(1.0f);
            }
            if (GUILayout.Button("2x", buttonStyle, GUILayout.Width(35), GUILayout.Height(30)))
            {
                TimeManager.Instance.SetSpeed(2.0f);
            }
            if (GUILayout.Button("4x", buttonStyle, GUILayout.Width(35), GUILayout.Height(30)))
            {
                TimeManager.Instance.SetSpeed(4.0f);
            }

            GUILayout.EndHorizontal();
            GUILayout.EndArea();
        }

        private void DrawProfilePanel()
        {
            float width = 280f;
            float height = 210f;
            GUI.Box(new Rect(15, 15, width, height), "", cardStyle);

            GUILayout.BeginArea(new Rect(25, 20, width - 20, height - 10));

            var country = pawn.stats.birthCountry;
            var parent = pawn.stats.parentBackground;

            GUILayout.Label($"🌍 출생: {country?.flagEmoji} {country?.countryName}", boldStyle);
            GUILayout.Label($"🏠 가정: {parent?.incomeBracketName} ({parent?.housingType})");
            GUILayout.Label($"💼 직업: {pawn.stats.currentOccupation}");
            GUILayout.Label($"💰 자산: ${pawn.stats.currentWealthUSD:N0} (연봉: ${pawn.stats.annualSalaryUSD:N0})");
            GUILayout.Space(5);
            GUILayout.Label($"❤️ 건강: {pawn.stats.health:F0}/100 | 🧠 지능: {pawn.stats.intelligence:F0} | ✨ 매력: {pawn.stats.charm:F0}");

            // 선천적 특성
            if (pawn.stats.traits != null && pawn.stats.traits.Count > 0)
            {
                string traitsStr = "🧬 특성: ";
                foreach (var t in pawn.stats.traits) traitsStr += $"[{t.traitName}] ";
                GUILayout.Label(traitsStr);
            }

            GUILayout.EndArea();
        }

        private void DrawNeedsPanel()
        {
            float width = 230f;
            float height = 240f;
            float x = Screen.width - width - 15;
            GUI.Box(new Rect(x, 15, width, height), "", cardStyle);

            GUILayout.BeginArea(new Rect(x + 10, 20, width - 20, height - 10));
            GUILayout.Label("📊 캐릭터 욕구 (Needs)", boldStyle);
            GUILayout.Space(5);

            DrawNeedBar("🍞 허기 (Hunger)", pawn.needs.hunger, new Color(0.9f, 0.6f, 0.2f));
            DrawNeedBar("⚡ 기력 (Energy)", pawn.needs.energy, new Color(0.3f, 0.7f, 0.9f));
            DrawNeedBar("🧼 위생 (Hygiene)", pawn.needs.hygiene, new Color(0.2f, 0.8f, 0.6f));
            DrawNeedBar("🎮 재미 (Fun)", pawn.needs.fun, new Color(0.8f, 0.4f, 0.8f));
            DrawNeedBar("🧘 멘탈 (Mental)", pawn.needs.mental, new Color(0.9f, 0.3f, 0.4f));
            DrawNeedBar("💬 사교 (Social)", pawn.needs.social, new Color(0.4f, 0.6f, 0.9f));

            if (pawn.needs.isMentalBroken)
            {
                GUILayout.Label("⚠️ 멘탈 붕괴 상태!", alertStyle);
            }

            GUILayout.EndArea();
        }

        private void DrawNeedBar(string label, float value, Color barColor)
        {
            GUILayout.BeginHorizontal();
            GUILayout.Label(label, GUILayout.Width(110));
            GUILayout.Label($"{value:F0}%", GUILayout.Width(40));
            GUILayout.EndHorizontal();

            Rect r = GUILayoutUtility.GetRect(180, 10);
            GUI.Box(r, "");
            float fillWidth = (r.width - 2) * (value / 100f);
            Color oldColor = GUI.color;
            GUI.color = barColor;
            GUI.DrawTexture(new Rect(r.x + 1, r.y + 1, fillWidth, r.height - 2), Texture2D.whiteTexture);
            GUI.color = oldColor;
            GUILayout.Space(2);
        }

        private void DrawStatusBar()
        {
            float width = 500f;
            float height = 45f;
            float x = (Screen.width - width) / 2f;
            float y = Screen.height - height - 15f;

            GUI.Box(new Rect(x, y, width, height), "", cardStyle);
            GUILayout.BeginArea(new Rect(x + 10, y + 10, width - 20, height - 10));
            GUILayout.BeginHorizontal();

            GUILayout.Label("💡 현재 행동:", boldStyle, GUILayout.Width(90));
            GUILayout.Label(pawn.currentActionDescription, headerStyle);

            GUILayout.EndHorizontal();
            GUILayout.EndArea();
        }
    }
}
