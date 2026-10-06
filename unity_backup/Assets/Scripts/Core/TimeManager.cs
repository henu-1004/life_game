using System;
using UnityEngine;

namespace LifeGame.Core
{
    public class TimeManager : MonoBehaviour
    {
        public static TimeManager Instance { get; private set; }

        [Header("Time Calibration")]
        public float baseYearDurationSeconds = 60f; // 1년 = 60초 (1분)
        public int startingYear = 2024;

        [Header("Current Time State")]
        public int currentAge = 0;
        public int currentYear = 2024;
        public int currentHour = 8; // 0 ~ 23시
        public float yearProgress = 0f; // 0.0 ~ 1.0

        [Header("Speed Control")]
        public float currentSpeedMultiplier = 1.0f; // 0 (정지), 1 (1배속), 2 (2배속), 4 (4배속)
        public bool isPaused => Mathf.Approximately(currentSpeedMultiplier, 0f);

        private float timerInYear = 0f;
        private float lastSavedSpeed = 1.0f;

        public event Action<int> onYearElapsed; // age 전달
        public event Action<int> onHourElapsed; // hour 전달
        public event Action<float> onSpeedChanged;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);

            currentYear = startingYear;
        }

        private void Update()
        {
            HandleKeyboardShortcuts();

            if (isPaused) return;

            float dt = Time.deltaTime * currentSpeedMultiplier;
            timerInYear += dt;
            yearProgress = Mathf.Clamp01(timerInYear / baseYearDurationSeconds);

            // 24시간 사이클 계산 (1년 동안 24시간이 4번 순환하거나 계절별 대표 하루 진행)
            int newHour = Mathf.FloorToInt(yearProgress * 24f) % 24;
            if (newHour != currentHour)
            {
                currentHour = newHour;
                onHourElapsed?.Invoke(currentHour);
            }

            // 1년 경과 (나이 증가)
            if (timerInYear >= baseYearDurationSeconds)
            {
                timerInYear = 0f;
                currentAge++;
                currentYear++;
                onYearElapsed?.Invoke(currentAge);
            }
        }

        private void HandleKeyboardShortcuts()
        {
            // 스페이스바: 일시정지 / 재개 토글
            if (Input.GetKeyDown(KeyCode.Space))
            {
                TogglePause();
            }
            // 1, 2, 3 숫자키: 배속 제어
            if (Input.GetKeyDown(KeyCode.Alpha1)) SetSpeed(1.0f);
            if (Input.GetKeyDown(KeyCode.Alpha2)) SetSpeed(2.0f);
            if (Input.GetKeyDown(KeyCode.Alpha3)) SetSpeed(4.0f);
        }

        public void SetSpeed(float speed)
        {
            currentSpeedMultiplier = Mathf.Max(0f, speed);
            if (currentSpeedMultiplier > 0) lastSavedSpeed = currentSpeedMultiplier;
            Time.timeScale = currentSpeedMultiplier;
            onSpeedChanged?.Invoke(currentSpeedMultiplier);
        }

        public void TogglePause()
        {
            if (isPaused)
            {
                SetSpeed(lastSavedSpeed > 0 ? lastSavedSpeed : 1.0f);
            }
            else
            {
                lastSavedSpeed = currentSpeedMultiplier;
                SetSpeed(0f);
            }
        }
    }
}
