using System;
using System.Collections.Generic;
using UnityEngine;

namespace LifeGame.Data
{
    [Serializable]
    public class TraitData
    {
        public string traitId;
        public string traitName;
        public string description;
        public bool isPositive;
        public float hungerDecayRate = 1.0f;
        public float energyDecayRate = 1.0f;
        public float studyEfficiency = 1.0f;
        public float workEfficiency = 1.0f;
        public float mentalResilience = 1.0f;
        public float healthBonus = 0f;
        public float charmBonus = 0f;

        public TraitData(string id, string name, string desc, bool positive)
        {
            traitId = id;
            traitName = name;
            description = desc;
            isPositive = positive;
        }
    }

    public static class TraitDatabase
    {
        private static List<TraitData> allTraits;

        public static void Initialize()
        {
            allTraits = new List<TraitData>
            {
                new TraitData("GENIUS", "수리 천재", "학업과 논리 기술 습득 속도가 40% 빠릅니다.", true)
                {
                    studyEfficiency = 1.4f
                },
                new TraitData("IRON_BODY", "강철 체력", "피로도가 30% 천천히 쌓이고 기초 건강도가 높습니다.", true)
                {
                    energyDecayRate = 0.7f,
                    healthBonus = 15f
                },
                new TraitData("CHARISMATIC", "타고난 매력", "사람들과 쉽게 친해지며 사회적 교류 시 재미와 멘탈이 크게 증가합니다.", true)
                {
                    charmBonus = 20f
                },
                new TraitData("WORKAHOLIC", "워커홀릭", "일과 공부를 할 때 멘탈 감소가 50% 적고 업무 성과가 높습니다.", true)
                {
                    workEfficiency = 1.3f,
                    mentalResilience = 1.2f
                },
                new TraitData("FRAGILE", "병약함", "체력이 약하고 건강 감소 질병에 취약합니다.", false)
                {
                    healthBonus = -20f,
                    energyDecayRate = 1.35f
                },
                new TraitData("ANXIOUS", "불안증 소인", "스트레스와 멘탈 감소 속도가 35% 빠릅니다.", false)
                {
                    mentalResilience = 0.65f
                },
                new TraitData("GLUTTON", "대식가", "허기 소모 속도가 40% 빠르지만 식사 시 재미가 회복됩니다.", false)
                {
                    hungerDecayRate = 1.4f
                },
                new TraitData("INSOMNIAC", "불면증", "수면 회복 속도가 느리고 쉽게 잠에서 깹니다.", false)
                {
                    energyDecayRate = 1.25f
                }
            };
        }

        public static List<TraitData> RollStartingTraits(int count = 2)
        {
            if (allTraits == null) Initialize();

            List<TraitData> pool = new List<TraitData>(allTraits);
            List<TraitData> selected = new List<TraitData>();

            for (int i = 0; i < count && pool.Count > 0; i++)
            {
                int idx = UnityEngine.Random.Range(0, pool.Count);
                selected.Add(pool[idx]);
                pool.RemoveAt(idx);
            }

            return selected;
        }
    }
}
