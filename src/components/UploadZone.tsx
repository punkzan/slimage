import { useDropzone } from "react-dropzone";
import { useT } from "../i18n";

interface Props {
  onFilesAdded: (files: File[]) => void;
}

export default function UploadZone({ onFilesAdded }: Props) {
  const { t } = useT();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesAdded,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/avif": [".avif"],
    },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 20,
  });

  return (
    <div className="text-center animate-fade-in">
      <div className="mx-auto w-48 h-48 sm:w-64 sm:h-64 mb-2 relative">
        <svg className="w-full h-full" viewBox="0 0 256 256" fill="none">
          <rect x="28" y="32" width="200" height="160" rx="16" className="fill-indigo-100 dark:fill-indigo-500/20" />
          <rect x="38" y="42" width="180" height="140" rx="8" className="fill-white dark:fill-gray-900" />
          <path d="M48 156 L95 72 L142 156" className="fill-indigo-200 dark:fill-indigo-500/30" />
          <path d="M95 72 L142 156 L190 88 L228 156" className="fill-indigo-400/60 dark:fill-indigo-500/50" />
          <circle cx="180" cy="70" r="16" className="fill-yellow-400/80 dark:fill-yellow-400/60" />
          <rect x="180" y="136" width="48" height="40" rx="8" className="fill-green-100 dark:fill-green-500/20" />
          <rect x="185" y="141" width="38" height="30" rx="4" className="fill-green-400/60 dark:fill-green-400/40" />
          <path d="M200 146 L200 166 M196 162 L200 166 L204 162" className="stroke-green-600 dark:stroke-green-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M196 150 L200 146 L204 150" className="stroke-green-600 dark:stroke-green-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3">
        {t("upload.title")}
      </h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
        {t("upload.subtitle")}
      </p>

      <div {...getRootProps()} className={`dropzone !p-8 sm:!p-12 ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {isDragActive ? t("upload.dragActive") : t("upload.dragIdle")}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t("upload.clickHint")}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">PNG</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">JPEG</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">WebP</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">AVIF</span>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t("upload.maxFiles", { max: 20, size: 5 })}
          </p>
        </div>
      </div>
    </div>
  );
}
