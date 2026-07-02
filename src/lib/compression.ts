// ============================================================
// 压缩编排层
//
// 职责：
//  1. 单个文件压缩流程编排
//  2. 批量压缩并发控制
//  3. ZIP 打包
// ============================================================

import type { CompressedFile, ImageFormat } from "../types";
import { uid, detectFormat, createPreviewUrl } from "./utils";
import { compressImage } from "./encoders";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface ProcessSettings {
  quality: number;
  outputFormat: ImageFormat | "keep";
}

const MAX_WIDTH = 3840; // 4K 上限，避免浏览器 OOM

/** 创建文件记录 (初始状态) */
export function createFileRecord(file: File): CompressedFile {
  return {
    id: uid(),
    originalFile: file,
    originalSize: file.size,
    compressedBlob: null,
    compressedSize: null,
    ratio: null,
    status: "idle",
    format: detectFormat(file.name),
    previewUrl: createPreviewUrl(file),
    compressedUrl: null,
  };
}

/** 压缩单个文件 (异步，更新 CompressedFile 的各个字段) */
export async function processFile(
  record: CompressedFile,
  settings: ProcessSettings
): Promise<CompressedFile> {
  try {
    record.status = "compressing";
    record.error = undefined;

    const targetFormat: ImageFormat =
      settings.outputFormat === "keep" ? record.format : settings.outputFormat;

    const result = await compressImage(record.originalFile, {
      format: targetFormat,
      quality: settings.quality,
      maxWidth: MAX_WIDTH,
    });

    record.compressedBlob = result.blob;
    record.compressedSize = result.blob.size;
    record.ratio = Math.round(
      ((record.originalSize - result.blob.size) / record.originalSize) * 100
    );
    record.compressedUrl = URL.createObjectURL(result.blob);
    record.status = "done";
  } catch (err) {
    record.status = "error";
    record.error = err instanceof Error ? err.message : "压缩失败";
  }
  return record;
}

/** 并发批量压缩 (限制并发数避免浏览器卡顿) */
export async function processBatch(
  records: CompressedFile[],
  settings: ProcessSettings,
  concurrency = 2,
  onProgress?: (done: number, total: number, currentName: string) => void
): Promise<CompressedFile[]> {
  const total = records.length;
  let completed = 0;
  const results: CompressedFile[] = [];

  for (let i = 0; i < records.length; i += concurrency) {
    const batch = records.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((r) => {
        onProgress?.(completed, total, r.originalFile.name);
        return processFile(r, settings);
      })
    );
    results.push(...batchResults);
    completed += batch.length;
    onProgress?.(completed, total, "");
  }

  return results;
}

/** ZIP 打包下载 */
export async function downloadAllAsZip(records: CompressedFile[]): Promise<void> {
  const zip = new JSZip();
  const doneFiles = records.filter((r) => r.status === "done" && r.compressedBlob);

  for (const file of doneFiles) {
    const ext = file.format === "jpeg" ? "jpg" : file.format;
    const name = file.originalFile.name.replace(/\.[^.]+$/, "") + "_compressed." + ext;
    zip.file(name, file.compressedBlob!);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "slimage-compressed.zip");
}

/** 单独下载 */
export function downloadSingle(record: CompressedFile): void {
  if (!record.compressedBlob) return;
  const ext = record.format === "jpeg" ? "jpg" : record.format;
  const name = record.originalFile.name.replace(/\.[^.]+$/, "") + "_compressed." + ext;
  saveAs(record.compressedBlob, name);
}
