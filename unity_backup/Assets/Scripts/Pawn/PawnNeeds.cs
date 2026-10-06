using System;
using UnityEngine;

namespace LifeGame.Pawn
{
    [Serializable]
    public class PawnNeeds : MonoBehaviour
    {
        [Header("Needs (0 ~ 100)")]
        [Range(0, 100)] public float hunger = 80f;
        [Range(0, 100)] public float energy = 85f;
        [Range(0, 100)] public float hygiene = 90f;
        [Range(0, 100)] public float fun = 70f;
        [Range(0, 100)] public float mental = 85f;
        [Range(0, 100)] public float social = 65f;

        [Header("Base Decay Rates (per second)")]
        public float hungerDecay = 1.8f;
        public float energyDecay = 1.4f;
        public float hygieneDecay = 1.0f;
        public float funDecay = 1.2f;
        public float mentalDecay = 0.8f;
        public float socialDecay = 0.9f;

        public bool isMentalBroken = false;
        public Action<string> onMentalBreakTriggered;

        public void TickDecay(float deltaTime)
        {
            hunger = Mathf.Clamp(hunger - hungerDecay * deltaTime, 0f, 100f);
            energy = Mathf.Clamp(energy - energyDecay * deltaTime, 0f, 100f);
            hygiene = Mathf.Clamp(hygiene - hygieneDecay * deltaTime, 0f, 100f);
            fun = Mathf.Clamp(fun - funDecay * deltaTime, 0f, 100f);
            social = Mathf.Clamp(social - socialDecay * deltaTime, 0f, 100f);

            // 극심한 결핍 시 멘탈 급감
            float mentalPenalty = 0f;
            if (hunger < 20f) mentalPenalty += 2.0f;
            if (energy < 15f) mentalPenalty += 2.5f;
            if (hygiene < 15f) mentalPenalty += 1.0f;
            if (fun < 15f) mentalPenalty += 1.2f;

            mental = Mathf.Clamp(mental - (mentalDecay + mentalPenalty) * deltaTime, 0f, 100f);

            // 멘탈 붕괴 체크
            if (mental <= 15f && !isMentalBroken)
            {
                isMentalBroken = true;
                onMentalBreakTriggered?.Invoke("멘탈 붕괴! 극심한 스트레스로 인해 지시를 거부하고 방황합니다.");
            }
            else if (mental > 35f && isMentalBroken)
            {
                isMentalBroken = false;
            }
        }

        public void ModifyNeed(string needName, float delta)
        {
            switch (needName.ToLower())
            {
                case "hunger": hunger = Mathf.Clamp(hunger + delta, 0f, 100f); break;
                case "energy": energy = Mathf.Clamp(energy + delta, 0f, 100f); break;
                case "hygiene": hygiene = Mathf.Clamp(hygiene + delta, 0f, 100f); break;
                case "fun": fun = Mathf.Clamp(fun + delta, 0f, 100f); break;
                case "mental": mental = Mathf.Clamp(mental + delta, 0f, 100f); break;
                case "social": social = Mathf.Clamp(social + delta, 0f, 100f); break;
            }
        }

        public string GetMostUrgentNeed()
        {
            if (energy < 25f) return "energy";
            if (hunger < 25f) return "hunger";
            if (hygiene < 20f) return "hygiene";
            if (mental < 25f) return "mental";
            if (fun < 20f) return "fun";
            return null;
        }
    }
}
