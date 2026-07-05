// ============================================================
// blogApi — 经验分享文章 API 客户端
// 与 /api/posts 服务端函数通信
// ============================================================

export interface ApiBlogPost {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  icon: string;
  titleKey?: string;
  bodyKey?: string;
}

export interface NewPostData {
  title: string;
  body: string;
  icon: string;
}

/** 从 admin session 中读取密码 */
function getAdminPassword(): string | null {
  try {
    const raw = localStorage.getItem("slimage-admin-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.ok && parsed?.password) return parsed.password as string;
  } catch {
    /* ignore */
  }
  return null;
}

/** 获取所有文章 */
export async function fetchPosts(): Promise<{ posts: ApiBlogPost[]; fallback: boolean }> {
  const res = await fetch("/api/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  const data = await res.json();
  return { posts: data.posts || [], fallback: !!data.fallback };
}

/** 新增文章（管理员） */
export async function createPost(data: NewPostData): Promise<ApiBlogPost[]> {
  const password = getAdminPassword();
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password || "",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create post");
  }
  const data2 = await res.json();
  return data2.posts || [];
}

/** 编辑文章（管理员） */
export async function updatePost(id: string, data: NewPostData): Promise<ApiBlogPost[]> {
  const password = getAdminPassword();
  const res = await fetch("/api/posts", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password || "",
    },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update post");
  }
  const data2 = await res.json();
  return data2.posts || [];
}

/** 删除文章（管理员） */
export async function deletePost(id: string): Promise<ApiBlogPost[]> {
  const password = getAdminPassword();
  const res = await fetch("/api/posts", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password || "",
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete post");
  }
  const data = await res.json();
  return data.posts || [];
}
