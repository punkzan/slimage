// ============================================================
// 类型定义 — 贯穿整个应用的数据模型
// ============================================================

/** 支持的图片格式 */
export type ImageFormat = "png" | "jpeg" | "webp" | "avif";

/** 压缩状态 */
export type CompressionStatus = "idle" | "uploading" | "compressing" | "done" | "error";

/** 单个文件压缩结果 */
export interface CompressedFile {
  id: string;
  /** 原始 File 对象 */
  originalFile: File;
  /** 原始文件大小 (bytes) */
  originalSize: number;
  /** 压缩后 Blob */
  compressedBlob: Blob | null;
  /** 压缩后大小 (bytes) */
  compressedSize: number | null;
  /** 压缩率 (%) */
  ratio: number | null;
  /** 当前状态 */
  status: CompressionStatus;
  /** 错误信息 */
  error?: string;
  /** 文件类型 */
  format: ImageFormat;
  /** 原始图片 ObjectURL (用于预览) */
  previewUrl: string;
  /** 压缩后图片 ObjectURL */
  compressedUrl: string | null;
}

/** 压缩配置 */
export interface CompressionOptions {
  format: ImageFormat;
  quality: number; // 0-100
  maxWidth?: number;
  maxHeight?: number;
}

/** 文件添加被拒绝的原因 */
export type RejectionCode = "invalidFormat" | "fileTooLarge" | "maxCount" | "duplicate";

export interface RejectionInfo {
  code: RejectionCode;
  name: string;
  size?: number;
}

/** 批量汇总 */
export interface Summary {
  totalOriginal: number;
  totalCompressed: number;
  totalSaved: number;
  overallRatio: number;
  fileCount: number;
  successCount: number;
  errorCount: number;
}
