using System;
using System.Collections.Generic;
using UnityEngine;
using LifeGame.Core;
using LifeGame.World;

namespace LifeGame.Pawn
{
    [RequireComponent(typeof(PawnMover), typeof(PawnNeeds), typeof(PawnStats))]
    [RequireComponent(typeof(PriorityScheduler))]
    public class PawnController : MonoBehaviour
    {
        public PawnMover mover { get; private set; }
        public PawnNeeds needs { get; private set; }
        public PawnStats stats { get; private set; }
        public PriorityScheduler scheduler { get; private set; }

        [Header("State")]
        public string currentActionDescription = "대기 중";
        public Furniture currentInteractingFurniture;
        public bool isPlayerForcedAction = false;
        private float nextScheduleCheckTime = 0f;

        private void Awake()
        {
            mover = GetComponent<PawnMover>();
            needs = GetComponent<PawnNeeds>();
            stats = GetComponent<PawnStats>();
            scheduler = GetComponent<PriorityScheduler>();
        }

        private void Update()
        {
            if (TimeManager.Instance != null && TimeManager.Instance.isPaused) return;

            // 1. 욕구 자연 감쇠
            needs.TickDecay(Time.deltaTime);

            // 2. 가구 상호작용 중일 경우 스텟/욕구 갱신
            if (currentInteractingFurniture != null && !mover.isMoving)
            {
                ApplyFurnitureEffects(currentInteractingFurniture, Time.deltaTime);
            }

            // 3. 자율 AI 루틴 스케줄링 (플레이어 강제 명령 중이 아닐 때)
            if (!isPlayerForcedAction && !mover.isMoving && Time.time >= nextScheduleCheckTime)
            {
                nextScheduleCheckTime = Time.time + 3.0f; // 3초마다 루틴 갱신 점검
                EvaluateAutonomousAction();
            }
        }

        private void ApplyFurnitureEffects(Furniture f, float dt)
        {
            needs.ModifyNeed("hunger", f.hungerDelta * dt);
            needs.ModifyNeed("energy", f.energyDelta * dt);
            needs.ModifyNeed("hygiene", f.hygieneDelta * dt);
            needs.ModifyNeed("fun", f.funDelta * dt);
            needs.ModifyNeed("mental", f.mentalDelta * dt);

            if (f.intelligenceDelta > 0)
            {
                stats.intelligence = Mathf.Clamp(stats.intelligence + f.intelligenceDelta * dt * 0.1f, 0f, 100f);
            }
            if (f.wealthPerHour > 0)
            {
                stats.currentWealthUSD += f.wealthPerHour * dt * 0.2f;
            }

            currentActionDescription = f.actionDescription;

            // 완충 시 자동 완료 (예: 수면 100% 도달, 배고픔 100% 도달)
            if (f.furnitureType == FurnitureType.Bed && needs.energy >= 99f)
            {
                FinishInteraction();
            }
            else if (f.furnitureType == FurnitureType.Fridge && needs.hunger >= 98f)
            {
                FinishInteraction();
            }
            else if (f.furnitureType == FurnitureType.Shower && needs.hygiene >= 98f)
            {
                FinishInteraction();
            }
        }

        /// <summary>
        /// 플레이어가 직접 가구를 클릭하여 강제 상호작용 명령을 내립니다.
        /// </summary>
        public void CommandInteractWith(Furniture furniture)
        {
            if (furniture == null) return;

            FinishInteraction();
            isPlayerForcedAction = true;
            currentActionDescription = $"{furniture.furnitureName}(으)로 직접 이동 중...";

            mover.MoveTo(furniture.GetInteractionPosition(), () =>
            {
                currentInteractingFurniture = furniture;
                currentActionDescription = furniture.actionDescription;
            });
        }

        /// <summary>
        /// 24시간 스케줄 및 욕구 우선순위에 따라 자율 행동 대상을 탐색합니다.
        /// </summary>
        private void EvaluateAutonomousAction()
        {
            int currentHour = TimeManager.Instance != null ? TimeManager.Instance.currentHour : 12;
            string label;
            FurnitureType targetType = scheduler.DetermineRequiredFurniture(currentHour, needs, out label);

            // 해당 타입의 가구 검색
            Furniture[] allFurniture = FindObjectsOfType<Furniture>();
            Furniture bestTarget = null;
            float closestDist = float.MaxValue;

            foreach (var f in allFurniture)
            {
                if (f.furnitureType == targetType)
                {
                    float dist = Vector3.Distance(transform.position, f.transform.position);
                    if (dist < closestDist)
                    {
                        closestDist = dist;
                        bestTarget = f;
                    }
                }
            }

            if (bestTarget != null && bestTarget != currentInteractingFurniture)
            {
                FinishInteraction();
                currentActionDescription = label;
                mover.MoveTo(bestTarget.GetInteractionPosition(), () =>
                {
                    currentInteractingFurniture = bestTarget;
                    currentActionDescription = bestTarget.actionDescription;
                });
            }
        }

        public void FinishInteraction()
        {
            currentInteractingFurniture = null;
            isPlayerForcedAction = false;
        }
    }
}
