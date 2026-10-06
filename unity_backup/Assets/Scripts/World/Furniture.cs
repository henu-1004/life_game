using UnityEngine;

namespace LifeGame.World
{
    public enum FurnitureType
    {
        Bed,
        Fridge,
        Desk,
        Computer,
        Shower,
        Sofa,
        Door
    }

    public class Furniture : MonoBehaviour
    {
        [Header("Furniture Settings")]
        public FurnitureType furnitureType;
        public string furnitureName = "Furniture";
        public string actionDescription = "이용 중";
        public Transform interactionPoint;

        [Header("Needs Replenishment Rates (per real second)")]
        public float hungerDelta = 0f;
        public float energyDelta = 0f;
        public float hygieneDelta = 0f;
        public float funDelta = 0f;
        public float mentalDelta = 0f;

        [Header("Skill & Asset Gains")]
        public float intelligenceDelta = 0f;
        public float wealthPerHour = 0f;

        public bool isOccupied = false;

        private void Awake()
        {
            if (interactionPoint == null)
            {
                var point = new GameObject("InteractionPoint");
                point.transform.SetParent(this.transform);
                point.transform.localPosition = new Vector3(0, -0.6f, 0);
                interactionPoint = point.transform;
            }
        }

        public Vector3 GetInteractionPosition()
        {
            return interactionPoint != null ? interactionPoint.position : transform.position;
        }

        private void OnMouseDown()
        {
            // 플레이어 직접 클릭 시 상호작용 지시
            var pawn = FindObjectOfType<LifeGame.Pawn.PawnController>();
            if (pawn != null)
            {
                pawn.CommandInteractWith(this);
            }
        }
    }
}
