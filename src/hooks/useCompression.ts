// ============================================================
// useCompression — 压缩编排 Hook
// ============================================================

import { useState, useCallback } from "react";
import type { CompressedFile, ImageFormat } from "../types";
import { processBatch } from "../lib/compression";

export interface CompressionSettings {
  quality: number;
  outputFormat: ImageFormat | "keep";
}

export function useCompression() {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, currentName: "" });

  const startCompression = useCallback(
    async (
      files: CompressedFile[],
      settings: CompressionSettings,
      onComplete: (results: CompressedFile[]) => void
    ) => {
      const pending = files.filter((f) => f.status === "idle");
      if (pending.length === 0) return;

      setIsCompressing(true);
      setProgress({ done: 0, total: pending.length, currentName: "" });

      try {
        const results = await processBatch(pending, settings, 2, (done, total, currentName) => {
          setProgress({ done, total, currentName });
        });
        onComplete(results);
      } finally {
        setIsCompressing(false);
      }
    },
    []
  );

  /** 单文件重试 */
  const retryFile = useCallback(
    async (
      file: CompressedFile,
      settings: CompressionSettings
    ): Promise<CompressedFile> => {
      const { processFile } = await import("../lib/compression");
      file.status = "idle";
      return processFile(file, settings);
    },
    []
  );

  return { isCompressing, progress, startCompression, retryFile };
}
