// ============================================================
// Web Worker: 在后台线程中执行压缩，不阻塞 UI
//
// Phase 1: Canvas 方案在 Worker 中意义不大 (本身就是异步的)
//          此处先保留 Worker 骨架，Phase 2 WASM 编码器需要时接入
// ============================================================

export interface WorkerRequest {
  id: string;
  file: File;
  format: "png" | "jpeg" | "webp" | "avif";
  quality: number;
  maxWidth?: number;
}

export interface WorkerResponse {
  id: string;
  blob?: Blob;
  error?: string;
}

// ---- Phase 1: Worker 降级方案 (直接在主线程处理) ----

// 映射 image type -> mime string
const mimeMap: Record<string, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
};

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, file, format, quality, maxWidth } = e.data;
  try {
    const img = await loadImage(file);
    let w = img.width;
    let h = img.height;
    if (maxWidth && w > maxWidth) {
      const ratio = maxWidth / w;
      w = maxWidth;
      h = Math.round(h * ratio);
    }

    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await canvas.convertToBlob({
      type: mimeMap[format] ?? "image/png",
      quality: quality / 100,
    });

    self.postMessage({ id, blob } satisfies WorkerResponse);
  } catch (err) {
    self.postMessage({
      id,
      error: err instanceof Error ? err.message : "压缩失败",
    } satisfies WorkerResponse);
  }
};

function loadImage(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}
