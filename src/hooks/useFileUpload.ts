// ============================================================
// useFileUpload — 文件上传逻辑
// ============================================================

import { useState, useCallback } from "react";
import type { CompressedFile, RejectionInfo } from "../types";
import { createFileRecord } from "../lib/compression";
import { isAllowedType } from "../lib/utils";

const MAX_FILES = 20;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function useFileUpload() {
  const [files, setFiles] = useState<CompressedFile[]>([]);

  const addFiles = useCallback(
    (incoming: File[]): RejectionInfo[] => {
      const rejected: RejectionInfo[] = [];

      setFiles((prev) => {
        const remaining = MAX_FILES - prev.length;
        if (remaining <= 0) {
          rejected.push({ code: "maxCount", name: "" });
          return prev;
        }

        const existingKeys = new Set(
          prev.map((f) => `${f.originalFile.name}__${f.originalFile.size}`)
        );

        const valid: CompressedFile[] = [];

        for (const f of incoming) {
          if (!isAllowedType(f)) {
            rejected.push({ code: "invalidFormat", name: f.name });
            continue;
          }
          if (f.size > MAX_SIZE) {
            rejected.push({ code: "fileTooLarge", name: f.name, size: f.size });
            continue;
          }
          const key = `${f.name}__${f.size}`;
          if (existingKeys.has(key)) {
            rejected.push({ code: "duplicate", name: f.name });
            continue;
          }
          if (valid.length >= remaining) {
            rejected.push({ code: "maxCount", name: f.name });
            break;
          }

          existingKeys.add(key);
          valid.push(createFileRecord(f));
        }

        return [...prev, ...valid];
      });

      return rejected;
    },
    []
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
  }, []);

  return { files, setFiles, addFiles, removeFile, clearAll, maxFiles: MAX_FILES, maxSize: MAX_SIZE };
}
