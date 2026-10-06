using System;
using System.Collections.Generic;
using UnityEngine;
using LifeGame.Data;
using LifeGame.Pawn;
using LifeGame.World;
using LifeGame.UI;

namespace LifeGame.Core
{
    public enum GameMode
    {
        Random80Billion,
        CountrySelect
    }

    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("References")]
        public PawnController playerPawn;
        public RoomBuilder roomBuilder;

        [Header("State")]
        public GameMode currentMode;
        public bool isGameActive = false;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);

            DemographicsDatabase.Initialize();
            TraitDatabase.Initialize();
            EventDatabase.Initialize();
        }

        private void Start()
        {
            if (roomBuilder == null) roomBuilder = FindObjectOfType<RoomBuilder>();
            if (playerPawn == null) playerPawn = FindObjectOfType<PawnController>();

            // 룸 빌드가 안 되어있으면 룸 생성
            if (roomBuilder != null && FindObjectOfType<Furniture>() == null)
            {
                roomBuilder.BuildDefaultRoom();
            }

            // 모드 선택 UI 띄우기 (또는 기본 80억 랜덤 시작)
            var modeUI = FindObjectOfType<ModeSelectUI>();
            if (modeUI != null)
            {
                modeUI.Show();
            }
            else
            {
                StartNewLife(GameMode.Random80Billion, null);
            }
        }

        public void StartNewLife(GameMode mode, string selectedCountryId = null)
        {
            currentMode = mode;

            CountryData country = (mode == GameMode.CountrySelect && !string.IsNullOrEmpty(selectedCountryId))
                ? DemographicsDatabase.GetCountryById(selectedCountryId)
                : DemographicsDatabase.RollRandomCountryByPopulation();

            var parentBg = DemographicsDatabase.GenerateParentBackground(country);
            var traits = TraitDatabase.RollStartingTraits(2);

            if (playerPawn == null)
            {
                playerPawn = FindObjectOfType<PawnController>();
            }

            if (playerPawn != null)
            {
                playerPawn.stats.InitializeFromBirth(country, parentBg, traits);
                playerPawn.transform.position = Vector3.zero;
            }

            if (TimeManager.Instance != null)
            {
                TimeManager.Instance.currentAge = 0;
                TimeManager.Instance.currentYear = 2024;
                TimeManager.Instance.SetSpeed(1.0f);
            }

            isGameActive = true;

            var hud = FindObjectOfType<GameHUD>();
            if (hud != null) hud.RefreshAll();
        }

        public void RestartGame()
        {
            StartNewLife(currentMode);
        }
    }
}
