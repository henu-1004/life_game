using System;
using System.Collections.Generic;
using UnityEngine;
using LifeGame.Core;
using LifeGame.Data;

namespace LifeGame.UI
{
    public class ModeSelectUI : MonoBehaviour
    {
        private bool isVisible = true;
        private int selectedTab = 0; // 0: 80억 랜덤, 1: 국가 직접 선택
        private int selectedCountryIndex = 0;
        private Vector2 scrollPos;

        private GUIStyle titleStyle;
        private GUIStyle subTitleStyle;
        private GUIStyle descStyle;
        private bool stylesInited = false;

        public void Show()
        {
            isVisible = true;
            if (TimeManager.Instance != null) TimeManager.Instance.SetSpeed(0f);
        }

        public void Hide()
        {
            isVisible = false;
        }

        private void InitStyles()
        {
            if (stylesInited) return;

            titleStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 24,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter,
                normal = { textColor = Color.cyan }
            };

            subTitleStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 14,
                alignment = TextAnchor.MiddleCenter,
                normal = { textColor = Color.yellow }
            };

            descStyle = new GUIStyle(GUI.skin.box)
            {
                fontSize = 13,
                alignment = TextAnchor.UpperLeft,
                padding = new RectOffset(15, 15, 15, 15)
            };

            stylesInited = true;
        }

        private void OnGUI()
        {
            if (!isVisible) return;

            InitStyles();

            float w = 620f;
            float h = 500f;
            float x = (Screen.width - w) / 2f;
            float y = (Screen.height - h) / 2f;

            GUI.Box(new Rect(x, y, w, h), "");
            GUILayout.BeginArea(new Rect(x + 20, y + 20, w - 40, h - 40));

            GUILayout.Label("Project 1 / 8,000,000,000", titleStyle);
            GUILayout.Label("실제 지구 통계 데이터 기반 랜덤 인생 시뮬레이션", subTitleStyle);
            GUILayout.Space(15);

            // 상단 탭 선택
            GUILayout.BeginHorizontal();
            if (GUILayout.Toggle(selectedTab == 0, "🎲 80억 분의 1 무작위 스폰", "Button", GUILayout.Height(35)))
            {
                selectedTab = 0;
            }
            if (GUILayout.Toggle(selectedTab == 1, "🏳️ 국가 직접 선택 (샌드박스)", "Button", GUILayout.Height(35)))
            {
                selectedTab = 1;
            }
            GUILayout.EndHorizontal();

            GUILayout.Space(15);

            if (selectedTab == 0)
            {
                // 80억 랜덤 스폰 모드 설명
                GUILayout.Box(
                    "🌍 [리얼 80억 분의 1 무작위 출생 모드]\n\n" +
                    "• 실제 지구 인구 통계 비율에 따라 당신의 출생 국가가 결정됩니다.\n" +
                    "  - 남아시아/동아시아 스폰 확률: 약 35%\n" +
                    "  - 아프리카 대륙 스폰 확률: 약 18%\n" +
                    "  - 대한민국 스폰 확률: 약 0.64%\n" +
                    "• 부모의 소득 수준(1~5분위)과 유전적 특성이 완전 무작위로 부여됩니다.\n" +
                    "• 당신의 운명을 시험해 보세요!",
                    descStyle, GUILayout.Height(230)
                );

                GUILayout.FlexibleSpace();

                if (GUILayout.Button("✨ 무작위 지구 인생 시작하기", GUILayout.Height(50)))
                {
                    Hide();
                    GameManager.Instance.StartNewLife(GameMode.Random80Billion, null);
                }
            }
            else
            {
                // 국가 직접 선택 모드
                var countries = DemographicsDatabase.Countries;
                GUILayout.BeginHorizontal();

                // 좌측: 국가 목록 스크롤
                scrollPos = GUILayout.BeginScrollView(scrollPos, GUILayout.Width(220), GUILayout.Height(240));
                for (int i = 0; i < countries.Count; i++)
                {
                    var c = countries[i];
                    bool isSelected = (i == selectedCountryIndex);
                    if (GUILayout.Toggle(isSelected, $"{c.flagEmoji} {c.countryName}", "Button", GUILayout.Height(28)))
                    {
                        selectedCountryIndex = i;
                    }
                }
                GUILayout.EndScrollView();

                // 우측: 선택된 국가 상세 정보
                if (selectedCountryIndex >= 0 && selectedCountryIndex < countries.Count)
                {
                    var sc = countries[selectedCountryIndex];
                    string info = $"[ {sc.flagEmoji} {sc.countryName} ]\n" +
                                  $"• 1인당 GDP: ${sc.gdpPerCapitaUSD:N0}\n" +
                                  $"• 기대 수명: {sc.lifeExpectancyYears}세\n" +
                                  $"• 영유아 사망률: {sc.infantMortalityPer1000}/1000명\n" +
                                  $"• 보건 지수: {sc.healthcareIndex}/100 | 치안: {sc.safetyIndex}/100\n\n" +
                                  $"{sc.description}";

                    GUILayout.Box(info, descStyle, GUILayout.Width(330), GUILayout.Height(240));
                }

                GUILayout.EndHorizontal();

                GUILayout.FlexibleSpace();

                if (GUILayout.Button($"🚀 {countries[selectedCountryIndex].countryName}에서 태어나기", GUILayout.Height(45)))
                {
                    Hide();
                    GameManager.Instance.StartNewLife(GameMode.CountrySelect, countries[selectedCountryIndex].countryId);
                }
            }

            GUILayout.EndArea();
        }
    }
}
