using UnityEngine;

namespace LifeGame.World
{
    public class RoomBuilder : MonoBehaviour
    {
        [Header("Room Dimensions")]
        public int roomWidth = 14;
        public int roomHeight = 10;
        public float tileSize = 1.0f;

        [Header("Colors (Procedural Sprites)")]
        public Color floorColor = new Color(0.85f, 0.80f, 0.72f); // 따뜻한 원목 바닥
        public Color wallColor = new Color(0.35f, 0.32f, 0.28f);  // 차분한 벽체
        public Color bedColor = new Color(0.25f, 0.45f, 0.80f);   // 침대 (블루)
        public Color deskColor = new Color(0.60f, 0.40f, 0.20f);  // 책상 (우드)
        public Color computerColor = new Color(0.15f, 0.15f, 0.15f); // PC
        public Color fridgeColor = new Color(0.90f, 0.90f, 0.92f); // 냉장고
        public Color showerColor = new Color(0.40f, 0.75f, 0.85f); // 샤워실
        public Color sofaColor = new Color(0.75f, 0.35f, 0.35f);   // 소파
        public Color doorColor = new Color(0.50f, 0.30f, 0.15f);   // 현관문

        private Sprite defaultSprite;

        private void Awake()
        {
            defaultSprite = CreateSolidSprite(32, 32, Color.white);
        }

        public void BuildDefaultRoom()
        {
            if (defaultSprite == null) defaultSprite = CreateSolidSprite(32, 32, Color.white);

            var worldParent = new GameObject("Generated_Room");
            worldParent.transform.SetParent(this.transform);

            // 1. 바닥(Floor) 생성
            var floorRoot = new GameObject("Floors");
            floorRoot.transform.SetParent(worldParent.transform);
            float startX = -roomWidth / 2f + 0.5f;
            float startY = -roomHeight / 2f + 0.5f;

            for (int x = 0; x < roomWidth; x++)
            {
                for (int y = 0; y < roomHeight; y++)
                {
                    var tile = new GameObject($"Tile_{x}_{y}");
                    tile.transform.SetParent(floorRoot.transform);
                    tile.transform.position = new Vector3(startX + x * tileSize, startY + y * tileSize, 1f);

                    var sr = tile.AddComponent<SpriteRenderer>();
                    sr.sprite = defaultSprite;
                    // 바닥 타일 미세 체크 패턴
                    bool alt = (x + y) % 2 == 0;
                    sr.color = alt ? floorColor : floorColor * 0.96f;
                    sr.sortingOrder = -10;
                }
            }

            // 2. 벽(Walls) 생성
            var wallRoot = new GameObject("Walls");
            wallRoot.transform.SetParent(worldParent.transform);

            for (int x = -1; x <= roomWidth; x++)
            {
                CreateWallTile(wallRoot, startX + x * tileSize, startY - 1 * tileSize);
                CreateWallTile(wallRoot, startX + x * tileSize, startY + roomHeight * tileSize);
            }
            for (int y = 0; y < roomHeight; y++)
            {
                CreateWallTile(wallRoot, startX - 1 * tileSize, startY + y * tileSize);
                CreateWallTile(wallRoot, startX + roomWidth * tileSize, startY + y * tileSize);
            }

            // 3. 가구(Furniture) 배치
            var furnRoot = new GameObject("Furnitures");
            furnRoot.transform.SetParent(worldParent.transform);

            // 침대 (좌측 상단)
            CreateFurniture(furnRoot, FurnitureType.Bed, "편안한 침대", "수면 중... (피로 회복)",
                new Vector3(startX + 1.5f, startY + roomHeight - 2f, 0),
                new Vector2(1.8f, 2.2f), bedColor,
                eDelta: 18f, hDelta: -1.5f);

            // 책상 & 공부 공간 (좌측 중앙)
            CreateFurniture(furnRoot, FurnitureType.Desk, "공부 책상", "공부 및 자격증 준비 중...",
                new Vector3(startX + 1.5f, startY + roomHeight - 5.5f, 0),
                new Vector2(1.8f, 1.2f), deskColor,
                intelDelta: 1.2f, eDelta: -2f, funD: -1f, mentalD: -0.5f);

            // 컴퓨터 책상 (중앙 상단)
            CreateFurniture(furnRoot, FurnitureType.Computer, "데스크탑 PC", "게임 및 주식 확인 중...",
                new Vector3(startX + 5.5f, startY + roomHeight - 2f, 0),
                new Vector2(1.5f, 1.2f), computerColor,
                funD: 15f, mentalD: 3f, eDelta: -1.5f, wealthGain: 5f);

            // 냉장고 / 부엌 코너 (우측 상단)
            CreateFurniture(furnRoot, FurnitureType.Fridge, "양문형 냉장고", "식사 및 영양 섭취 중...",
                new Vector3(startX + roomWidth - 2.5f, startY + roomHeight - 2f, 0),
                new Vector2(1.5f, 1.8f), fridgeColor,
                hDelta: 25f, funD: 2f);

            // 샤워실 (우측 중앙)
            CreateFurniture(furnRoot, FurnitureType.Shower, "욕실 & 샤워부스", "샤워 및 청결 유지 중...",
                new Vector3(startX + roomWidth - 2.5f, startY + roomHeight - 5.5f, 0),
                new Vector2(1.6f, 1.8f), showerColor,
                hygieneD: 30f, mentalD: 5f);

            // 안락 소파 (중앙)
            CreateFurniture(furnRoot, FurnitureType.Sofa, "거실 소파", "휴식 및 TV 시청 중...",
                new Vector3(startX + 6.0f, startY + 2.5f, 0),
                new Vector2(2.2f, 1.2f), sofaColor,
                eDelta: 6f, funD: 8f, mentalD: 6f);

            // 현관문 (하단 중앙)
            CreateFurniture(furnRoot, FurnitureType.Door, "현관문", "외출 및 출근/등교 중...",
                new Vector3(startX + 6.0f, startY - 0.2f, 0),
                new Vector2(1.6f, 0.8f), doorColor,
                wealthGain: 20f, eDelta: -3f, funD: -2f);
        }

        private void CreateWallTile(GameObject parent, float x, float y)
        {
            var wall = new GameObject("Wall");
            wall.transform.SetParent(parent.transform);
            wall.transform.position = new Vector3(x, y, 0);

            var sr = wall.AddComponent<SpriteRenderer>();
            sr.sprite = defaultSprite;
            sr.color = wallColor;
            sr.sortingOrder = 0;

            var col = wall.AddComponent<BoxCollider2D>();
            col.size = Vector2.one;
        }

        private Furniture CreateFurniture(GameObject parent, FurnitureType type, string name, string actionText,
            Vector3 pos, Vector2 size, Color color,
            float hDelta = 0, float eDelta = 0, float hygieneD = 0, float funD = 0, float mentalD = 0,
            float intelDelta = 0, float wealthGain = 0)
        {
            var obj = new GameObject(name);
            obj.transform.SetParent(parent.transform);
            obj.transform.position = pos;

            var sr = obj.AddComponent<SpriteRenderer>();
            sr.sprite = defaultSprite;
            sr.color = color;
            sr.size = size;
            sr.sortingOrder = 1;
            obj.transform.localScale = new Vector3(size.x, size.y, 1f);

            var col = obj.AddComponent<BoxCollider2D>();
            col.size = Vector2.one;

            var furn = obj.AddComponent<Furniture>();
            furn.furnitureType = type;
            furn.furnitureName = name;
            furn.actionDescription = actionText;
            furn.hungerDelta = hDelta;
            furn.energyDelta = eDelta;
            furn.hygieneDelta = hygieneD;
            furn.funDelta = funD;
            furn.mentalDelta = mentalD;
            furn.intelligenceDelta = intelDelta;
            furn.wealthPerHour = wealthGain;

            var interactObj = new GameObject("InteractionPoint");
            interactObj.transform.SetParent(obj.transform);
            interactObj.transform.localPosition = new Vector3(0, -0.6f / size.y, 0);
            furn.interactionPoint = interactObj.transform;

            return furn;
        }

        public static Sprite CreateSolidSprite(int width, int height, Color color)
        {
            var tex = new Texture2D(width, height);
            Color[] pixels = new Color[width * height];
            for (int i = 0; i < pixels.Length; i++) pixels[i] = color;
            tex.SetPixels(pixels);
            tex.filterMode = FilterMode.Point;
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, width, height), new Vector2(0.5f, 0.5f), 32);
        }
    }
}
