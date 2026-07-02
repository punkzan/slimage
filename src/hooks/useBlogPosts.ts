// ============================================================
// useBlogPosts — 经验分享文章本地持久化（localStorage）
// 增删改：addPost / updatePost / removePost
// 数据结构：BlogPost = { id, title, body, createdAt, icon }
// 持久化：localStorage key = "slimage-blog-posts"
// ============================================================

import { useCallback, useEffect, useState } from "react";

export type BlogIcon = "image" | "sliders" | "stack" | "expand" | "lightbulb";

export interface BlogPost {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  icon: BlogIcon;
}

const STORAGE_KEY = "slimage-blog-posts";

/** 默认预置文章（首次访问时填充，确保页面始终有内容） */
const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "default-1",
    title: "选择合适的输出格式",
    body: "照片类图片建议输出为 JPEG 或 WebP，图标和截图类建议使用 PNG。如果需要最佳压缩率，可以尝试 AVIF 格式（注意旧浏览器兼容性）。WebP 在大多数场景下是文件大小和兼容性的最佳平衡点。",
    createdAt: Date.now() - 4 * 86400000,
    icon: "image",
  },
  {
    id: "default-2",
    title: "合理调整压缩质量",
    body: "一般来说，70-85 的质量值可以在文件大小和画质之间取得最佳平衡。对于网页展示用途的图片，60-70 通常就足够了，人眼几乎无法分辨差异。而需要打印或高清展示的图片，建议使用 85-95。",
    createdAt: Date.now() - 3 * 86400000,
    icon: "sliders",
  },
  {
    id: "default-3",
    title: "批量处理提高效率",
    body: "Slimage 支持一次处理最多 20 张图片。处理完成后可以一键打包下载 ZIP 文件。建议将同类型的图片（如产品图、文章配图）放在同一批次处理，这样可以统一设置压缩参数，大大提高工作效率。",
    createdAt: Date.now() - 2 * 86400000,
    icon: "stack",
  },
  {
    id: "default-4",
    title: "先缩放再压缩",
    body: "如果原始图片分辨率远大于实际使用场景（例如用 4000px 宽的照片做网页头图），建议先用其他工具将图片缩放到目标尺寸，再用 Slimage 压缩。这样能获得更小的文件体积。Slimage 会自动将超大图片缩放到合理尺寸，但预先缩放效果更好。",
    createdAt: Date.now() - 1 * 86400000,
    icon: "expand",
  },
];

function load(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BlogPost[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* 解析失败：使用默认值 */
  }
  return DEFAULT_POSTS;
}

function save(posts: BlogPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* 写入失败：忽略（可能是隐私模式） */
  }
}

function makeId(): string {
  return `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface NewBlogPost {
  title: string;
  body: string;
  icon: BlogIcon;
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // 客户端首次挂载后从 localStorage 加载（避免 SSR 不一致）
  useEffect(() => {
    setPosts(load());
    setHydrated(true);
  }, []);

  // 任何变更后写回 localStorage
  useEffect(() => {
    if (!hydrated) return;
    save(posts);
  }, [posts, hydrated]);

  const addPost = useCallback((data: NewBlogPost) => {
    setPosts((prev) => [
      {
        id: makeId(),
        title: data.title.trim() || "未命名文章",
        body: data.body.trim(),
        createdAt: Date.now(),
        icon: data.icon,
      },
      ...prev,
    ]);
  }, []);

  const updatePost = useCallback((id: string, data: NewBlogPost) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              title: data.title.trim() || "未命名文章",
              body: data.body.trim(),
              icon: data.icon,
            }
          : p
      )
    );
  }, []);

  const removePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetToDefault = useCallback(() => {
    setPosts(DEFAULT_POSTS);
  }, []);

  return { posts, addPost, updatePost, removePost, resetToDefault };
}
