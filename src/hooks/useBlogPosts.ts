// ============================================================
// useBlogPosts — 经验分享文章（Vercel KV 后端）
// 读取：GET /api/posts（公开）
// 增删改：POST/PUT/DELETE /api/posts（管理员）
// 本地开发 fallback：API 不可用时使用 localStorage
// ============================================================

import { useCallback, useEffect, useState } from "react";
import {
  fetchPosts,
  createPost as apiCreatePost,
  updatePost as apiUpdatePost,
  deletePost as apiDeletePost,
  type ApiBlogPost,
  type NewPostData,
} from "../lib/blogApi";

export type BlogIcon = "image" | "sliders" | "stack" | "expand" | "lightbulb";

export interface BlogPost {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  icon: BlogIcon;
  titleKey?: string;
  bodyKey?: string;
}

export interface NewBlogPost {
  title: string;
  body: string;
  icon: BlogIcon;
}

// ---- localStorage fallback（本地开发用） ----
const STORAGE_KEY = "slimage-blog-posts-v2";

const DEFAULT_POSTS: BlogPost[] = [
  { id: "default-1", title: "", body: "", titleKey: "blog.tip1.title", bodyKey: "blog.tip1.body", createdAt: Date.now() - 4 * 86400000, icon: "image" },
  { id: "default-2", title: "", body: "", titleKey: "blog.tip2.title", bodyKey: "blog.tip2.body", createdAt: Date.now() - 3 * 86400000, icon: "sliders" },
  { id: "default-3", title: "", body: "", titleKey: "blog.tip3.title", bodyKey: "blog.tip3.body", createdAt: Date.now() - 2 * 86400000, icon: "stack" },
  { id: "default-4", title: "", body: "", titleKey: "blog.tip4.title", bodyKey: "blog.tip4.body", createdAt: Date.now() - 1 * 86400000, icon: "expand" },
];

function loadLocal(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BlogPost[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_POSTS;
}

function saveLocal(posts: BlogPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* ignore */
  }
}

function makeId(): string {
  return `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---- 类型转换 ----
function toBlogPost(p: ApiBlogPost): BlogPost {
  return {
    id: p.id,
    title: p.title,
    body: p.body,
    createdAt: p.createdAt,
    icon: (p.icon as BlogIcon) || "lightbulb",
    titleKey: p.titleKey,
    bodyKey: p.bodyKey,
  };
}

// ---- Hook ----
export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  // 初次加载：从 API 获取
  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { posts: apiPosts, fallback } = await fetchPosts();
      if (fallback) {
        // KV 未配置 → 用 localStorage（可能包含之前新增的文章）
        setPosts(loadLocal());
        setUsingFallback(true);
      } else {
        setPosts(apiPosts.map(toBlogPost));
        setUsingFallback(false);
      }
    } catch {
      // API 不可用（本地开发），使用 localStorage fallback
      setPosts(loadLocal());
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPost = useCallback(
    async (data: NewBlogPost) => {
      try {
        if (usingFallback) {
          // 本地 fallback 模式
          const newPost: BlogPost = {
            id: makeId(),
            title: data.title.trim() || "未命名文章",
            body: data.body.trim(),
            createdAt: Date.now(),
            icon: data.icon,
          };
          setPosts((prev) => {
            const updated = [newPost, ...prev];
            saveLocal(updated);
            return updated;
          });
          return;
        }
        const updated = await apiCreatePost(data as NewPostData);
        setPosts(updated.map(toBlogPost));
      } catch (err) {
        setError(err instanceof Error ? err.message : "操作失败");
        throw err;
      }
    },
    [usingFallback]
  );

  const updatePost = useCallback(
    async (id: string, data: NewBlogPost) => {
      try {
        if (usingFallback) {
          setPosts((prev) => {
            const updated = prev.map((p) =>
              p.id === id
                ? {
                    ...p,
                    title: data.title.trim() || "未命名文章",
                    body: data.body.trim(),
                    icon: data.icon,
                    titleKey: undefined,
                    bodyKey: undefined,
                  }
                : p
            );
            saveLocal(updated);
            return updated;
          });
          return;
        }
        const updated = await apiUpdatePost(id, data as NewPostData);
        setPosts(updated.map(toBlogPost));
      } catch (err) {
        setError(err instanceof Error ? err.message : "操作失败");
        throw err;
      }
    },
    [usingFallback]
  );

  const removePost = useCallback(
    async (id: string) => {
      try {
        if (usingFallback) {
          setPosts((prev) => {
            const updated = prev.filter((p) => p.id !== id);
            saveLocal(updated);
            return updated;
          });
          return;
        }
        const updated = await apiDeletePost(id);
        setPosts(updated.map(toBlogPost));
      } catch (err) {
        setError(err instanceof Error ? err.message : "操作失败");
        throw err;
      }
    },
    [usingFallback]
  );

  return { posts, loading, error, usingFallback, addPost, updatePost, removePost, refresh };
}
