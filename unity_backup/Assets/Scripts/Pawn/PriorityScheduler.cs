using System;
using UnityEngine;
using LifeGame.World;

namespace LifeGame.Pawn
{
    public enum ScheduledActivity
    {
        Sleep,
        WorkOrStudy,
        Recreation,
        FreeTime
    }

    public class PriorityScheduler : MonoBehaviour
    {
        // 24시간 스케줄 배열 (0시 ~ 23시)
        public ScheduledActivity[] hourlySchedule = new ScheduledActivity[24];

        private void Awake()
        {
            SetupDefaultRoutine();
        }

        public void SetupDefaultRoutine()
        {
            for (int h = 0; h < 24; h++)
            {
                if (h >= 23 || h < 7)
                {
                    hourlySchedule[h] = ScheduledActivity.Sleep; // 23:00 ~ 07:00 수면
                }
                else if (h >= 8 && h < 18)
                {
                    hourlySchedule[h] = ScheduledActivity.WorkOrStudy; // 08:00 ~ 18:00 학업/노동
                }
                else if (h >= 18 && h < 21)
                {
                    hourlySchedule[h] = ScheduledActivity.Recreation; // 18:00 ~ 21:00 취미/여가
                }
                else
                {
                    hourlySchedule[h] = ScheduledActivity.FreeTime; // 기타 자유 시간
                }
            }
        }

        public FurnitureType DetermineRequiredFurniture(int currentHour, PawnNeeds needs, out string actionLabel)
        {
            // 1순위: 응급 생체 욕구 (Rimworld Critical Need)
            if (needs.energy < 20f)
            {
                actionLabel = "탈진 직전! 침대로 이동합니다.";
                return FurnitureType.Bed;
            }
            if (needs.hunger < 25f)
            {
                actionLabel = "극심한 허기! 냉장고로 이동합니다.";
                return FurnitureType.Fridge;
            }
            if (needs.hygiene < 20f)
            {
                actionLabel = "청결 위생 불량! 샤워실로 이동합니다.";
                return FurnitureType.Shower;
            }

            // 2순위: 24시간 정규 스케줄
            ScheduledActivity scheduled = hourlySchedule[Mathf.Clamp(currentHour, 0, 23)];

            switch (scheduled)
            {
                case ScheduledActivity.Sleep:
                    actionLabel = "취침 시간입니다.";
                    return FurnitureType.Bed;

                case ScheduledActivity.WorkOrStudy:
                    actionLabel = "집중 학업 및 업무 시간입니다.";
                    return (UnityEngine.Random.value > 0.5f) ? FurnitureType.Desk : FurnitureType.Computer;

                case ScheduledActivity.Recreation:
                    actionLabel = "취미 및 휴식 시간입니다.";
                    return (UnityEngine.Random.value > 0.5f) ? FurnitureType.Computer : FurnitureType.Sofa;

                case ScheduledActivity.FreeTime:
                default:
                    if (needs.hunger < 60f)
                    {
                        actionLabel = "식사를 위해 이동합니다.";
                        return FurnitureType.Fridge;
                    }
                    if (needs.fun < 60f)
                    {
                        actionLabel = "여가 활동을 합니다.";
                        return FurnitureType.Sofa;
                    }
                    actionLabel = "자유 시간 휴식";
                    return FurnitureType.Sofa;
            }
        }
    }
}
