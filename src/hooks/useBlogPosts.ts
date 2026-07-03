// ============================================================
// useBlogPosts — 经验分享文章本地持久化（localStorage）
// 增删改：addPost / updatePost / removePost
// 数据结构：BlogPost = { id, title, body, createdAt, icon, titleKey?, bodyKey? }
// 持久化：localStorage key = "slimage-blog-posts-v2"
// 默认预置文章使用 i18n 键（titleKey/bodyKey），随语言切换
// 用户创建/编辑的文章使用纯文本（title/body），不随语言切换
// ============================================================

import { useCallback, useEffect, useState } from "react";

export type BlogIcon = "image" | "sliders" | "stack" | "expand" | "lightbulb";

export interface BlogPost {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  icon: BlogIcon;
  /** i18n 键（仅默认预置文章使用，渲染时优先于 title） */
  titleKey?: string;
  /** i18n 键（仅默认预置文章使用，渲染时优先于 body） */
  bodyKey?: string;
}

const STORAGE_KEY = "slimage-blog-posts-v2";

/** 默认预置文章（首次访问时填充，使用 i18n 键随语言切换） */
const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "default-1",
    title: "",
    body: "",
    titleKey: "blog.tip1.title",
    bodyKey: "blog.tip1.body",
    createdAt: Date.now() - 4 * 86400000,
    icon: "image",
  },
  {
    id: "default-2",
    title: "",
    body: "",
    titleKey: "blog.tip2.title",
    bodyKey: "blog.tip2.body",
    createdAt: Date.now() - 3 * 86400000,
    icon: "sliders",
  },
  {
    id: "default-3",
    title: "",
    body: "",
    titleKey: "blog.tip3.title",
    bodyKey: "blog.tip3.body",
    createdAt: Date.now() - 2 * 86400000,
    icon: "stack",
  },
  {
    id: "default-4",
    title: "",
    body: "",
    titleKey: "blog.tip4.title",
    bodyKey: "blog.tip4.body",
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
              // 编辑后移除 i18n 键，变为纯文本文章
              titleKey: undefined,
              bodyKey: undefined,
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
