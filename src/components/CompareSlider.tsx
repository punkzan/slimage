import { useRef, useState, useCallback } from "react";
import { useT } from "../i18n";

interface Props {
  before: string;
  after: string;
}

export default function CompareSlider({ before, after }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const { t } = useT();

  const handleMove = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(percent);
    },
    []
  );

  const handleMouseDown = useCallback(() => {
    setDragging(true);
    const onMove = (e: MouseEvent) => handleMove(e.clientX);
    const onUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [handleMove]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{t("compare.original")}</span>
        <span>{t("compare.compressed")}</span>
      </div>
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-xl
          border border-gray-200 dark:border-gray-700 select-none cursor-ew-resize
          bg-gray-50 dark:bg-gray-900"
        onMouseDown={handleMouseDown}
        onTouchMove={handleTouchMove}
      >
        <img
          src={after}
          alt={t("compare.compressed")}
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={before}
            alt={t("compare.original")}
            className="absolute inset-0 w-full h-full object-contain"
            style={{ width: containerRef.current?.clientWidth }}
            draggable={false}
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
          style={{ left: `${position}%` }}
        />

        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9
            bg-white dark:bg-gray-800 rounded-full shadow-lg border-2
            flex items-center justify-center transition-transform duration-100
            ${dragging ? "scale-110 border-indigo-600" : "border-indigo-500 dark:border-indigo-400"}`}
          style={{ left: `${position}%` }}
        >
          <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
