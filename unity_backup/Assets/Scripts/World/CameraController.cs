using UnityEngine;

namespace LifeGame.World
{
    public class CameraController : MonoBehaviour
    {
        public Transform target;
        public float smoothSpeed = 5f;
        public float zoomSpeed = 2f;
        public float minZoom = 3f;
        public float maxZoom = 12f;

        private Camera cam;
        private Vector3 dragOrigin;
        private bool isDragging = false;

        private void Awake()
        {
            cam = GetComponent<Camera>();
            if (cam == null) cam = Camera.main;
        }

        private void LateUpdate()
        {
            HandleZoom();
            HandleMousePan();

            if (!isDragging && target != null)
            {
                Vector3 targetPos = new Vector3(target.position.x, target.position.y, transform.position.z);
                transform.position = Vector3.Lerp(transform.position, targetPos, smoothSpeed * Time.unscaledDeltaTime);
            }
        }

        private void HandleZoom()
        {
            if (cam == null) return;
            float scroll = Input.GetAxis("Mouse ScrollWheel");
            if (Mathf.Abs(scroll) > 0.01f)
            {
                cam.orthographicSize = Mathf.Clamp(cam.orthographicSize - scroll * zoomSpeed * 5f, minZoom, maxZoom);
            }
        }

        private void HandleMousePan()
        {
            if (Input.GetMouseButtonDown(2)) // 마우스 휠 클릭 드래그
            {
                dragOrigin = cam.ScreenToWorldPoint(Input.mousePosition);
                isDragging = true;
            }

            if (Input.GetMouseButton(2) && isDragging)
            {
                Vector3 diff = dragOrigin - cam.ScreenToWorldPoint(Input.mousePosition);
                transform.position += diff;
            }

            if (Input.GetMouseButtonUp(2))
            {
                isDragging = false;
            }
        }
    }
}
