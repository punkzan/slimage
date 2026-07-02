import { useState } from "react";
import type { CompressedFile } from "../types";
import { useT } from "../i18n";
import { formatSize, revokeUrl } from "../lib/utils";
import { downloadSingle } from "../lib/compression";
import CompareSlider from "./CompareSlider";

interface Props {
  file: CompressedFile;
  onRemove: (id: string) => void;
  onRetry?: (file: CompressedFile) => void;
  isCompressing?: boolean;
}

export default function FileItem({ file, onRemove, onRetry, isCompressing }: Props) {
  const [showCompare, setShowCompare] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { t } = useT();

  const handleRemove = () => {
    revokeUrl(file.previewUrl);
    if (file.compressedUrl) revokeUrl(file.compressedUrl);
    onRemove(file.id);
  };

  return (
    <div className="card animate-slide-up group">
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 shrink-0">
          {!imgLoaded && (
            <div className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          )}
          <img
            src={file.previewUrl}
            alt={file.originalFile.name}
            className="w-20 h-20 object-cover rounded-lg border border-gray-100 dark:border-gray-800
              transition-opacity duration-300"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 dark:text-gray-200 truncate text-sm" title={file.originalFile.name}>
            {file.originalFile.name}
          </p>

          {file.status === "idle" && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {formatSize(file.originalSize)}
            </p>
          )}

          {file.status === "compressing" && (
            <div className="mt-2">
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full
                    animate-pulse w-2/3"
                />
              </div>
              <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">
                {t("fileItem.compressProgress")}
              </p>
            </div>
          )}

          {file.status === "done" && file.compressedSize !== null && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 dark:text-gray-500 line-through">
                  {formatSize(file.originalSize)}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {formatSize(file.compressedSize)}
                </span>
                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">
                  -{file.ratio}%
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400
                    hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  onClick={() => downloadSingle(file)}
                >
                  {t("fileItem.download")}
                </button>
                <button
                  className="text-xs text-gray-400 dark:text-gray-600
                    hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  onClick={() => setShowCompare(!showCompare)}
                >
                  {showCompare ? t("fileItem.hideCompare") : t("fileItem.compare")}
                </button>
              </div>
            </div>
          )}

          {file.status === "error" && (
            <div className="mt-2 flex items-center gap-2">
              <p className="text-sm text-red-500 dark:text-red-400">
                {file.error ?? t("error.compressionFailed")}
              </p>
              {onRetry && !isCompressing && (
                <button
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400
                    hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors
                    px-2 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                  onClick={() => onRetry(file)}
                >
                  {t("fileItem.retry")}
                </button>
              )}
            </div>
          )}
        </div>

        <button
          className="text-gray-300 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400
            transition-all duration-150 opacity-0 group-hover:opacity-100 shrink-0 p-1"
          onClick={handleRemove}
          title={t("fileItem.remove")}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {showCompare && file.compressedUrl && (
        <div className="mt-4 animate-slide-up">
          <CompareSlider before={file.previewUrl} after={file.compressedUrl} />
        </div>
      )}
    </div>
  );
}
