import { useDropzone } from "react-dropzone";
import type { CompressedFile } from "../types";
import { useT } from "../i18n";
import FileItem from "./FileItem";

interface Props {
  files: CompressedFile[];
  onRemove: (id: string) => void;
  onAddMore: (newFiles: File[]) => void;
  onRetry: (file: CompressedFile) => void;
  isCompressing: boolean;
}

export default function FileList({ files, onRemove, onAddMore, onRetry, isCompressing }: Props) {
  const { t } = useT();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onAddMore,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/avif": [".avif"],
    },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 20 - files.length,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {t("fileList.selected", { count: files.length })}
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {t("fileList.addMoreHint")}
        </span>
      </div>

      {files.map((file) => (
        <FileItem key={file.id} file={file} onRemove={onRemove} onRetry={onRetry} isCompressing={isCompressing} />
      ))}

      {files.length < 20 && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4
            text-center cursor-pointer transition-all
            hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5
            ${isDragActive ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" : ""}`}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {t("fileList.addMore", { current: files.length, max: 20 })}
          </p>
        </div>
      )}
    </div>
  );
}
