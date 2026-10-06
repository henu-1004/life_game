using System;
using UnityEngine;

namespace LifeGame.Pawn
{
    public class PawnMover : MonoBehaviour
    {
        public float moveSpeed = 3.5f;
        public bool isMoving = false;

        private Vector3 targetPosition;
        private Action onArrivedCallback;
        private SpriteRenderer spriteRenderer;

        private void Awake()
        {
            spriteRenderer = GetComponentInChildren<SpriteRenderer>();
            targetPosition = transform.position;
        }

        public void MoveTo(Vector3 destination, Action onArrived = null)
        {
            targetPosition = new Vector3(destination.x, destination.y, transform.position.z);
            onArrivedCallback = onArrived;
            isMoving = true;

            // 좌우 방향에 따른 스프라이트 반전
            if (spriteRenderer != null)
            {
                if (targetPosition.x < transform.position.x)
                    spriteRenderer.flipX = true;
                else if (targetPosition.x > transform.position.x)
                    spriteRenderer.flipX = false;
            }
        }

        public void StopMoving()
        {
            isMoving = false;
            onArrivedCallback = null;
        }

        private void Update()
        {
            if (!isMoving) return;

            float step = moveSpeed * Time.deltaTime;
            transform.position = Vector3.MoveTowards(transform.position, targetPosition, step);

            // 간단한 걸음 흔들림 애니메이션 (바운스)
            if (spriteRenderer != null)
            {
                float bounce = Mathf.Sin(Time.time * 12f) * 0.08f;
                spriteRenderer.transform.localPosition = new Vector3(0, bounce, 0);
            }

            if (Vector3.Distance(transform.position, targetPosition) < 0.05f)
            {
                transform.position = targetPosition;
                isMoving = false;
                if (spriteRenderer != null) spriteRenderer.transform.localPosition = Vector3.zero;

                var callback = onArrivedCallback;
                onArrivedCallback = null;
                callback?.Invoke();
            }
        }
    }
}
