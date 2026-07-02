import type { ImageFormat } from "../types";
import { useT } from "../i18n";

interface Props {
  quality: number;
  onQualityChange: (q: number) => void;
  outputFormat: ImageFormat | "keep";
  onOutputFormatChange: (f: ImageFormat | "keep") => void;
  disabled?: boolean;
}

export default function ControlBar({
  quality,
  onQualityChange,
  outputFormat,
  onOutputFormatChange,
  disabled,
}: Props) {
  const { t } = useT();

  const formatLabels = {
    keep: t("control.keepFormat"),
    webp: "WebP",
    jpeg: "JPEG",
    png: "PNG",
    avif: "AVIF",
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("control.quality")}
            </label>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {quality}%
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(e) => onQualityChange(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer
              accent-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400 dark:text-gray-500">{t("control.smallerFile")}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{t("control.higherQuality")}</span>
          </div>
        </div>

        <div className="shrink-0">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
            {t("control.outputFormat")}
          </label>
          <select
            value={outputFormat}
            onChange={(e) => onOutputFormatChange(e.target.value as ImageFormat | "keep")}
            disabled={disabled}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(Object.keys(formatLabels) as (ImageFormat | "keep")[]).map((k) => (
              <option key={k} value={k}>
                {formatLabels[k]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
