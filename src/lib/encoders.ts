// ============================================================
// 编码器抽象层
//
// Phase 1: Canvas API 基础压缩 (已完成)
// Phase 4: jSquash WASM 编码器 — MozJPEG / libwebp / Oxipng / libavif
//   底层引擎与 TinyPNG/Squoosh 完全相同，压缩质量追平
// ============================================================

import type { ImageFormat } from "../types";

export interface EncodeParams {
  format: ImageFormat;
  quality: number; // 0-100
  maxWidth?: number;
}

export interface EncodeResult {
  blob: Blob;
  width: number;
  height: number;
}

// ---- 图片加载 ----

async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function getImageData(img: HTMLImageElement, w: number, h: number): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

// ---- Phase 4: WASM 编码器初始化 ----

type WasmEncoder = (data: ImageData, quality: number) => Promise<Blob>;

let _wasmReady = false;
let _wasmJpeg: WasmEncoder | null = null;
let _wasmWebp: WasmEncoder | null = null;
let _wasmAvif: WasmEncoder | null = null;
let _wasmPng: ((data: ImageData) => Promise<Blob>) | null = null;
let _wasmOxipng: ((buffer: ArrayBuffer, level: number) => Promise<ArrayBuffer>) | null = null;

async function initWasmEncoders(): Promise<void> {
  if (_wasmReady) return;

  try {
    // 并行加载所有 WASM 编码器
    const results = await Promise.allSettled([
      import("@jsquash/jpeg").then((m) => {
        _wasmJpeg = async (data, q) => {
          const buf = await m.encode(data, { quality: q });
          return new Blob([buf], { type: "image/jpeg" });
        };
      }),
      import("@jsquash/webp").then((m) => {
        _wasmWebp = async (data, q) => {
          const buf = await m.encode(data, { quality: q });
          return new Blob([buf], { type: "image/webp" });
        };
      }),
      import("@jsquash/avif").then((m) => {
        _wasmAvif = async (data, q) => {
          const buf = await m.encode(data, { quality: q, qualityAlpha: -1 });
          return new Blob([buf], { type: "image/avif" });
        };
      }),
      import("@jsquash/png").then((m) => {
        _wasmPng = async (data) => {
          const buf = await m.encode(data);
          return new Blob([buf], { type: "image/png" });
        };
      }),
      import("@jsquash/oxipng").then((m) => {
        _wasmOxipng = async (buffer, level) => {
          return m.optimise(buffer, { level });
        };
      }),
    ]);

    // 检查哪些加载失败
    for (const r of results) {
      if (r.status === "rejected") {
        console.warn("[Slimage] WASM encoder init failed:", r.reason);
      }
    }
  } catch (err) {
    console.warn("[Slimage] WASM encoder init error:", err);
  }

  _wasmReady = true;
}

// ---- Canvas 降级方案 ----

function canvasEncode(img: HTMLImageElement, params: EncodeParams): Promise<Blob> {
  return new Promise((resolve, reject) => {
    let { width, height } = img;
    if (params.maxWidth && width > params.maxWidth) {
      height = Math.round(height * (params.maxWidth / width));
      width = params.maxWidth;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, width, height);

    const mimeType =
      params.format === "jpeg"
        ? "image/jpeg"
        : params.format === "webp"
          ? "image/webp"
          : "image/png";

    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      mimeType,
      params.quality / 100
    );
  });
}

// ---- 统一入口 ----

/**
 * 压缩单张图片
 *
 * 策略: WASM 优先 → Canvas 降级
 *   - JPEG:  MozJPEG WASM (trellis quantization, 比 Canvas 小 10-15%)
 *   - WebP:  libwebp WASM (与 Canvas 基本持平，但更多控制)
 *   - PNG:   @jsquash/png + Oxipng 无损优化
 *   - AVIF:  libavif WASM (Canvas 不支持 AVIF 编码)
 */
export async function compressImage(
  file: File,
  params: EncodeParams
): Promise<EncodeResult> {
  // 加载图片
  const img = await loadImage(file);

  // 尺寸约束
  let { width, height } = img;
  if (params.maxWidth && width > params.maxWidth) {
    height = Math.round(height * (params.maxWidth / width));
    width = params.maxWidth;
  }

  // 尝试 WASM 编码
  try {
    await initWasmEncoders();
    const imageData = getImageData(img, width, height);

    switch (params.format) {
      case "jpeg": {
        if (_wasmJpeg) {
          const blob = await _wasmJpeg(imageData, params.quality);
          return { blob, width, height };
        }
        break;
      }
      case "webp": {
        if (_wasmWebp) {
          const blob = await _wasmWebp(imageData, params.quality);
          return { blob, width, height };
        }
        break;
      }
      case "avif": {
        if (_wasmAvif) {
          const blob = await _wasmAvif(imageData, params.quality);
          return { blob, width, height };
        }
        break;
      }
      case "png": {
        if (_wasmPng) {
          const pngBlob = await _wasmPng(imageData);
          // 尝试 Oxipng 无损压缩
          if (_wasmOxipng) {
            try {
              const optBuf = await _wasmOxipng(await pngBlob.arrayBuffer(), 3);
              const optBlob = new Blob([optBuf], { type: "image/png" });
              if (optBlob.size < pngBlob.size) {
                return { blob: optBlob, width, height };
              }
            } catch {
              // Oxipng 失败，回退到未优化的 PNG
            }
          }
          return { blob: pngBlob, width, height };
        }
        break;
      }
    }
  } catch (err) {
    console.warn("[Slimage] WASM encoding failed, falling back to Canvas:", err);
  }

  // Canvas 降级
  const blob = await canvasEncode(img, params);
  return { blob, width, height };
}
