import React, { useRef, useEffect, useState } from 'react';
import { Furniture, FurnitureType } from '../types';
import { ROOM_WIDTH_TILES, ROOM_HEIGHT_TILES, DEFAULT_FURNITURE } from './furnitureData';

interface GameCanvasProps {
  currentHour: number;
  pawnPos: { x: number; y: number };
  targetPos: { x: number; y: number } | null;
  activeFurniture: Furniture | null;
  currentAction: string;
  isMentalBroken: boolean;
  onSelectFurniture: (furniture: Furniture) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentHour,
  pawnPos,
  targetPos,
  activeFurniture,
  currentAction,
  isMentalBroken,
  onSelectFurniture
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredFurniture, setHoveredFurniture] = useState<Furniture | null>(null);

  // Canvas Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. 계산용 타일 크기 및 오프셋
      const padding = 30;
      const availableW = width - padding * 2;
      const availableH = height - padding * 2;
      const tileSize = Math.min(availableW / ROOM_WIDTH_TILES, availableH / ROOM_HEIGHT_TILES);
      const offsetX = (width - tileSize * ROOM_WIDTH_TILES) / 2;
      const offsetY = (height - tileSize * ROOM_HEIGHT_TILES) / 2;

      // 배경 클리어
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, width, height);

      // 2. 방 바닥 (Wood Planks)
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#1e1b18';
      ctx.fillRect(offsetX - 10, offsetY - 10, ROOM_WIDTH_TILES * tileSize + 20, ROOM_HEIGHT_TILES * tileSize + 20);
      ctx.restore();

      // 바닥 타일 렌더링
      for (let tx = 0; tx < ROOM_WIDTH_TILES; tx++) {
        for (let ty = 0; ty < ROOM_HEIGHT_TILES; ty++) {
          const isAlt = (tx + ty) % 2 === 0;
          ctx.fillStyle = isAlt ? '#3b2f27' : '#332720';
          ctx.fillRect(offsetX + tx * tileSize, offsetY + ty * tileSize, tileSize - 1, tileSize - 1);
        }
      }

      // 3. 가구(Furniture) 렌더링
      DEFAULT_FURNITURE.forEach(f => {
        const fx = offsetX + f.x * tileSize;
        const fy = offsetY + f.y * tileSize;
        const fw = f.width * tileSize;
        const fh = f.height * tileSize;
        const isHovered = hoveredFurniture?.id === f.id;
        const isActive = activeFurniture?.id === f.id;

        // 가구 바닥 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.roundRect(fx + 4, fy + 6, fw, fh, 6);
        ctx.fill();

        // 가구 본체
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.roundRect(fx, fy, fw, fh, 6);
        ctx.fill();

        // 액센트 하이라이트 (테두리 및 상단 면)
        ctx.strokeStyle = isActive ? '#fbbf24' : isHovered ? '#60a5fa' : f.accentColor;
        ctx.lineWidth = isActive ? 3 : isHovered ? 2.5 : 1.5;
        ctx.stroke();

        // 활성화/호버 시 부드러운 발광
        if (isActive || isHovered) {
          ctx.fillStyle = isActive ? 'rgba(251, 191, 36, 0.15)' : 'rgba(96, 165, 250, 0.12)';
          ctx.fill();
        }

        // 가구 텍스트 & 아이콘 라벨
        ctx.fillStyle = '#f8fafc';
        ctx.font = `bold ${Math.max(11, Math.round(tileSize * 0.26))}px Pretendard, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(f.name, fx + fw / 2, fy + fh / 2 + 4);
      });

      // 4. 캐릭터 (Pawn) 렌더링
      const px = offsetX + pawnPos.x * tileSize;
      const py = offsetY + pawnPos.y * tileSize;
      const pawnRadius = tileSize * 0.36;

      // 발밑 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(px, py + pawnRadius * 0.8, pawnRadius * 0.9, pawnRadius * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // 바운스 효과 (이동 중일 때 가벼운 흔들림)
      const bounce = targetPos ? Math.sin(Date.now() * 0.015) * 3 : 0;

      // 캐릭터 몸체 (귀여운 골드/옐로우 폰)
      ctx.fillStyle = isMentalBroken ? '#ef4444' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(px, py + bounce, pawnRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 캐릭터 눈 (Face)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(px - pawnRadius * 0.35, py + bounce - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(px + pawnRadius * 0.35, py + bounce - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 입 (웃는 표정 or 멘탈붕괴 시 삐뚤어진 표정)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (isMentalBroken) {
        ctx.arc(px, py + bounce + 6, 4, Math.PI, 0); // 찡그림
      } else {
        ctx.arc(px, py + bounce + 2, 4, 0, Math.PI); // 미소
      }
      ctx.stroke();

      // 말풍선 / 상태 아이콘 표시 (헤드 위)
      ctx.save();
      const bubbleY = py + bounce - pawnRadius - 16;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(px - 45, bubbleY - 14, 90, 22, 11);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = '11px Pretendard, sans-serif';
      ctx.textAlign = 'center';
      const icon = isMentalBroken ? '⚠️ 멘탈붕괴!' : getFurnitureEmoji(activeFurniture?.type);
      ctx.fillText(icon, px, bubbleY);
      ctx.restore();

      // 5. 낮/밤 조명 필터 (Current Hour 0~24)
      let nightAlpha = 0;
      if (currentHour < 6 || currentHour >= 21) {
        nightAlpha = 0.42; // 심야
      } else if (currentHour < 8 || currentHour >= 18) {
        nightAlpha = 0.20; // 노을/여명
      }

      if (nightAlpha > 0) {
        ctx.fillStyle = `rgba(10, 15, 35, ${nightAlpha})`;
        ctx.fillRect(offsetX, offsetY, ROOM_WIDTH_TILES * tileSize, ROOM_HEIGHT_TILES * tileSize);

        // 침대/스탠드 조명 (따뜻한 원형 빛)
        const lightGrad = ctx.createRadialGradient(px, py, 10, px, py, tileSize * 2.5);
        lightGrad.addColorStop(0, 'rgba(253, 224, 71, 0.18)');
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(px - tileSize * 2.5, py - tileSize * 2.5, tileSize * 5, tileSize * 5);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentHour, pawnPos, targetPos, activeFurniture, hoveredFurniture, isMentalBroken]);

  // 마우스 이동 & 클릭 이벤트
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = 30;
    const availableW = canvas.width - padding * 2;
    const availableH = canvas.height - padding * 2;
    const tileSize = Math.min(availableW / ROOM_WIDTH_TILES, availableH / ROOM_HEIGHT_TILES);
    const offsetX = (canvas.width - tileSize * ROOM_WIDTH_TILES) / 2;
    const offsetY = (canvas.height - tileSize * ROOM_HEIGHT_TILES) / 2;

    const gridX = (x - offsetX) / tileSize;
    const gridY = (y - offsetY) / tileSize;

    const hit = DEFAULT_FURNITURE.find(
      f => gridX >= f.x && gridX <= f.x + f.width && gridY >= f.y && gridY <= f.y + f.height
    );

    setHoveredFurniture(hit || null);
    canvas.style.cursor = hit ? 'pointer' : 'default';
  };

  const handleClick = () => {
    if (hoveredFurniture) {
      onSelectFurniture(hoveredFurniture);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={960}
        height={600}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="rounded-xl shadow-2xl border border-slate-800"
      />
      {hoveredFurniture && (
        <div className="absolute bottom-6 bg-slate-900/90 text-amber-300 px-4 py-2 rounded-lg border border-amber-500/40 text-sm font-semibold shadow-lg backdrop-blur-md pointer-events-none">
          👆 클릭: [{hoveredFurniture.name}] 즉시 강제 이용 지시
        </div>
      )}
    </div>
  );
};

function getFurnitureEmoji(type?: FurnitureType): string {
  switch (type) {
    case 'Bed': return '💤 수면 중';
    case 'Desk': return '📖 공부 중';
    case 'Computer': return '💻 PC 이용 중';
    case 'Fridge': return '🍔 식사 중';
    case 'Shower': return '🚿 샤워 중';
    case 'Sofa': return '🛋️ 휴식 중';
    case 'Door': return '🏢 외출 근무 중';
    default: return '대기 중';
  }
}
