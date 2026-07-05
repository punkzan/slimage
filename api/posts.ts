// ============================================================
// /api/posts — 经验分享文章 CRUD（Vercel Serverless Function）
// 存储：Vercel KV (Redis)
// GET    /api/posts        → 公开读取所有文章
// POST   /api/posts        → 管理员新增文章（需 x-admin-password 头）
// PUT    /api/posts        → 管理员编辑文章（需 x-admin-password 头）
// DELETE /api/posts        → 管理员删除文章（需 x-admin-password 头）
// ============================================================

import { kv } from "@vercel/kv";

interface BlogPost {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  icon: string;
  titleKey?: string;
  bodyKey?: string;
}

const KV_KEY = "blog:posts";

/** 默认预置文章（首次访问或 KV 为空时填充） */
const DEFAULT_POSTS: BlogPost[] = [
  { id: "default-1", title: "", body: "", titleKey: "blog.tip1.title", bodyKey: "blog.tip1.body", createdAt: Date.now() - 4 * 86400000, icon: "image" },
  { id: "default-2", title: "", body: "", titleKey: "blog.tip2.title", bodyKey: "blog.tip2.body", createdAt: Date.now() - 3 * 86400000, icon: "sliders" },
  { id: "default-3", title: "", body: "", titleKey: "blog.tip3.title", bodyKey: "blog.tip3.body", createdAt: Date.now() - 2 * 86400000, icon: "stack" },
  { id: "default-4", title: "", body: "", titleKey: "blog.tip4.title", bodyKey: "blog.tip4.body", createdAt: Date.now() - 1 * 86400000, icon: "expand" },
];

/** 校验管理员密码 */
function verifyAdmin(req: any): boolean {
  const password = req.headers["x-admin-password"];
  const adminPassword = process.env.ADMIN_PASSWORD || "slimage2024";
  return password === adminPassword;
}

/**
 * 检查 KV / Redis 是否可用。
 * 兼容多套环境变量：
 *   - 旧版 Vercel KV：KV_REST_API_URL + KV_REST_API_TOKEN
 *   - 新版 Upstash Redis（Vercel Marketplace）：KV_REST_API_URL + KV_REST_API_TOKEN（同名）
 *   - 通用 Redis URL：REDIS_URL / KV_URL
 *   @vercel/kv 内部会自动识别这些环境变量。
 */
function isKvAvailable(): boolean {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) return true;
  if (process.env.REDIS_URL) return true;
  if (process.env.KV_URL) return true;
  return false;
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-password");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const kvReady = isKvAvailable();

  // ============ GET：公开读取 ============
  if (req.method === "GET") {
    try {
      if (!kvReady) {
        return res.status(200).json({ posts: DEFAULT_POSTS, fallback: true });
      }
      let posts = await kv.get<BlogPost[]>(KV_KEY);
      if (!posts || posts.length === 0) {
        posts = DEFAULT_POSTS;
        await kv.set(KV_KEY, posts);
      }
      return res.status(200).json({ posts });
    } catch {
      return res.status(200).json({ posts: DEFAULT_POSTS, fallback: true });
    }
  }

  // ============ 以下为写操作，需管理员权限 ============
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!kvReady) {
    return res.status(503).json({ error: "Vercel KV is not configured. Please set up KV storage in Vercel dashboard." });
  }

  // ============ POST：新增文章 ============
  if (req.method === "POST") {
    try {
      const posts = (await kv.get<BlogPost[]>(KV_KEY)) || DEFAULT_POSTS;
      const newPost: BlogPost = {
        id: `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        title: (req.body.title || "").trim() || "未命名文章",
        body: (req.body.body || "").trim(),
        createdAt: Date.now(),
        icon: req.body.icon || "lightbulb",
      };
      const updated = [newPost, ...posts];
      await kv.set(KV_KEY, updated);
      return res.status(201).json({ post: newPost, posts: updated });
    } catch {
      return res.status(500).json({ error: "Failed to add post" });
    }
  }

  // ============ PUT：编辑文章 ============
  if (req.method === "PUT") {
    try {
      const posts = (await kv.get<BlogPost[]>(KV_KEY)) || DEFAULT_POSTS;
      const { id, title, body, icon } = req.body;
      const updated = posts.map((p) =>
        p.id === id
          ? {
              ...p,
              title: (title || "").trim() || "未命名文章",
              body: (body || "").trim(),
              icon: icon || p.icon,
              titleKey: undefined,
              bodyKey: undefined,
            }
          : p
      );
      await kv.set(KV_KEY, updated);
      return res.status(200).json({ posts: updated });
    } catch {
      return res.status(500).json({ error: "Failed to update post" });
    }
  }

  // ============ DELETE：删除文章 ============
  if (req.method === "DELETE") {
    try {
      const posts = (await kv.get<BlogPost[]>(KV_KEY)) || DEFAULT_POSTS;
      const { id } = req.body;
      const updated = posts.filter((p) => p.id !== id);
      await kv.set(KV_KEY, updated);
      return res.status(200).json({ posts: updated });
    } catch {
      return res.status(500).json({ error: "Failed to delete post" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
