// ============================================================
// 工具函数
// ============================================================

/** 生成唯一 ID */
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** 格式化文件大小 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** 根据扩展名判断图片格式 */
export function detectFormat(filename: string): "png" | "jpeg" | "webp" | "avif" {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "png";
    case "jpg":
    case "jpeg":
      return "jpeg";
    case "webp":
      return "webp";
    case "avif":
      return "avif";
    default:
      return "png";
  }
}

/** 文件是否在支持列表中 */
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];

export function isAllowedType(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type);
}

/** 创建 ObjectURL 并自动注册 revoke */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/** 释放 ObjectURL */
export function revokeUrl(url: string): void {
  URL.revokeObjectURL(url);
}
