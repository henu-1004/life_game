using UnityEngine;
using LifeGame.Core;
using LifeGame.World;
using LifeGame.Pawn;
using LifeGame.UI;

namespace LifeGame.Bootstrap
{
    public class GameInitializer : MonoBehaviour
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void AutoBootstrap()
        {
            if (FindObjectOfType<GameManager>() == null)
            {
                var bootstrapper = new GameObject("[GameInitializer]");
                bootstrapper.AddComponent<GameInitializer>();
            }
        }

        private void Awake()
        {
            SetupCamera();
            SetupCoreManagers();
            SetupWorldAndRoom();
            var pawn = SetupPawn();
            SetupUI();

            // 카메라 타깃 연결
            var camCtrl = Camera.main != null ? Camera.main.GetComponent<CameraController>() : null;
            if (camCtrl != null && pawn != null)
            {
                camCtrl.target = pawn.transform;
            }
        }

        private void SetupCamera()
        {
            Camera cam = Camera.main;
            if (cam == null)
            {
                var camObj = new GameObject("Main Camera");
                cam = camObj.AddComponent<Camera>();
                cam.tag = "MainCamera";
                camObj.AddComponent<AudioListener>();
            }

            cam.orthographic = true;
            cam.orthographicSize = 6.5f;
            cam.backgroundColor = new Color(0.12f, 0.12f, 0.14f);
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.transform.position = new Vector3(0, 0, -10f);

            if (cam.GetComponent<CameraController>() == null)
            {
                cam.gameObject.AddComponent<CameraController>();
            }
        }

        private void SetupCoreManagers()
        {
            var coreRoot = new GameObject("Core_Managers");

            if (FindObjectOfType<TimeManager>() == null)
                coreRoot.AddComponent<TimeManager>();

            if (FindObjectOfType<EventEngine>() == null)
                coreRoot.AddComponent<EventEngine>();

            if (FindObjectOfType<GameManager>() == null)
                coreRoot.AddComponent<GameManager>();
        }

        private void SetupWorldAndRoom()
        {
            if (FindObjectOfType<RoomBuilder>() == null)
            {
                var roomObj = new GameObject("World_RoomBuilder");
                var builder = roomObj.AddComponent<RoomBuilder>();
                builder.BuildDefaultRoom();
            }
        }

        private GameObject SetupPawn()
        {
            if (FindObjectOfType<PawnController>() != null)
            {
                return FindObjectOfType<PawnController>().gameObject;
            }

            var pawnObj = new GameObject("Player_Pawn");
            pawnObj.transform.position = new Vector3(0, 0, 0);

            // 비주얼 스프라이트 생성
            var spriteChild = new GameObject("Sprite");
            spriteChild.transform.SetParent(pawnObj.transform);
            spriteChild.transform.localPosition = Vector3.zero;

            var sr = spriteChild.AddComponent<SpriteRenderer>();
            sr.sprite = CreateCircularSprite(32, new Color(0.95f, 0.82f, 0.35f)); // 따뜻한 골드 옐로우
            sr.sortingOrder = 5;

            // 컴포넌트 추가
            var mover = pawnObj.AddComponent<PawnMover>();
            var needs = pawnObj.AddComponent<PawnNeeds>();
            var stats = pawnObj.AddComponent<PawnStats>();
            var sched = pawnObj.AddComponent<PriorityScheduler>();
            var ctrl = pawnObj.AddComponent<PawnController>();

            var col = pawnObj.AddComponent<CircleCollider2D>();
            col.radius = 0.5f;

            return pawnObj;
        }

        private void SetupUI()
        {
            var uiRoot = new GameObject("UI_Root");

            if (FindObjectOfType<GameHUD>() == null)
                uiRoot.AddComponent<GameHUD>();

            if (FindObjectOfType<ModeSelectUI>() == null)
                uiRoot.AddComponent<ModeSelectUI>();

            if (FindObjectOfType<EventPopupUI>() == null)
                uiRoot.AddComponent<EventPopupUI>();

            if (FindObjectOfType<LifeReportUI>() == null)
                uiRoot.AddComponent<LifeReportUI>();
        }

        private static Sprite CreateCircularSprite(int size, Color color)
        {
            var tex = new Texture2D(size, size);
            Color[] pixels = new Color[size * size];
            float radius = size / 2f;
            Vector2 center = new Vector2(radius, radius);

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float dist = Vector2.Distance(new Vector2(x, y), center);
                    if (dist <= radius - 1)
                    {
                        // 안쪽 채우기
                        pixels[y * size + x] = color;
                    }
                    else if (dist <= radius)
                    {
                        // 테두리 안티에일리어싱
                        pixels[y * size + x] = Color.Lerp(color, Color.clear, dist - (radius - 1));
                    }
                    else
                    {
                        pixels[y * size + x] = Color.clear;
                    }
                }
            }

            tex.SetPixels(pixels);
            tex.filterMode = FilterMode.Bilinear;
            tex.Apply();

            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), 32);
        }
    }
}
