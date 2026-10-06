using System;
using UnityEngine;
using LifeGame.Core;
using LifeGame.Data;
using LifeGame.Pawn;

namespace LifeGame.UI
{
    public class EventPopupUI : MonoBehaviour
    {
        private bool isVisible = false;
        private LifeEventData currentEvent;
        private PawnController targetPawn;
        private Action<EventChoice> onChoiceSelected;

        private string outcomeText = null;
        private GUIStyle titleStyle;
        private GUIStyle narrativeStyle;
        private GUIStyle choiceBtnStyle;
        private bool stylesInited = false;

        public void DisplayEvent(LifeEventData evt, PawnController pawn, Action<EventChoice> onSelect)
        {
            currentEvent = evt;
            targetPawn = pawn;
            onChoiceSelected = onSelect;
            outcomeText = null;
            isVisible = true;
        }

        private void InitStyles()
        {
            if (stylesInited) return;

            titleStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 20,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter,
                normal = { textColor = Color.yellow }
            };

            narrativeStyle = new GUIStyle(GUI.skin.box)
            {
                fontSize = 14,
                alignment = TextAnchor.UpperLeft,
                wordWrap = true,
                padding = new RectOffset(15, 15, 15, 15)
            };

            choiceBtnStyle = new GUIStyle(GUI.skin.button)
            {
                fontSize = 13,
                wordWrap = true,
                padding = new RectOffset(10, 10, 10, 10)
            };

            stylesInited = true;
        }

        private void OnGUI()
        {
            if (!isVisible || currentEvent == null) return;

            InitStyles();

            float w = 550f;
            float h = 420f;
            float x = (Screen.width - w) / 2f;
            float y = (Screen.height - h) / 2f;

            GUI.Box(new Rect(x, y, w, h), "");
            GUILayout.BeginArea(new Rect(x + 20, y + 20, w - 40, h - 40));

            GUILayout.Label($"⚡ [운명의 분기점] {currentEvent.title}", titleStyle);
            GUILayout.Space(10);

            if (outcomeText == null)
            {
                // 사건 설명
                GUILayout.Box(currentEvent.narrativeText, narrativeStyle, GUILayout.Height(130));
                GUILayout.Space(15);
                GUILayout.Label("선택지를 결정하세요:");

                // 선택지 버튼들
                foreach (var choice in currentEvent.choices)
                {
                    string btnLabel = $"▶ {choice.choiceLabel}\n   ({choice.requirementHint})";
                    if (GUILayout.Button(btnLabel, choiceBtnStyle, GUILayout.Height(45)))
                    {
                        bool success = UnityEngine.Random.value <= choice.baseSuccessRate;
                        outcomeText = success ? $"[성공!] {choice.successOutcome}" : $"[실패] {choice.failureOutcome}";
                        onChoiceSelected?.Invoke(choice);
                    }
                    GUILayout.Space(5);
                }
            }
            else
            {
                // 선택 결과 출력
                GUILayout.Box($"결과:\n\n{outcomeText}", narrativeStyle, GUILayout.Height(230));
                GUILayout.FlexibleSpace();

                if (GUILayout.Button("인생 계속하기 (시간 재개)", GUILayout.Height(45)))
                {
                    isVisible = false;
                    currentEvent = null;
                    outcomeText = null;
                    if (TimeManager.Instance != null) TimeManager.Instance.SetSpeed(1.0f);
                }
            }

            GUILayout.EndArea();
        }
    }
}
