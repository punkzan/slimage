import { useEffect, useRef, useState, type FormEvent } from "react";
import { useT } from "../i18n";
import { useBlogPosts, type BlogIcon, type BlogPost, type NewBlogPost } from "../hooks/useBlogPosts";
import { useAdminAuth } from "../hooks/useAdminAuth";

interface Props {
  onBack: () => void;
}

/** 5 个可选图标（heroicons 风格） */
const ICON_PATHS: Record<BlogIcon, string> = {
  image:
    "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  sliders:
    "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
  stack:
    "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  expand:
    "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
  lightbulb:
    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
};

const ICON_KEYS: BlogIcon[] = ["image", "sliders", "stack", "expand", "lightbulb"];

function Icon({ name, className = "w-5 h-5" }: { name: BlogIcon; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
    </svg>
  );
}

/* ================= 管理员登录对话框 ================= */
function AdminLoginDialog({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const { t } = useT();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { login } = useAdminAuth();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    const ok = await login(password);
    setSubmitting(false);
    if (ok) {
      onSuccess();
    } else {
      setError(t("blog.admin.loginError"));
      setPassword("");
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card max-w-sm w-full animate-scale-in">
        <div className="flex items-start gap-3 mb-5">
          <span className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </span>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("blog.admin.loginTitle")}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t("blog.admin.sessionHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t("blog.admin.passwordLabel")}
            </label>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder={t("blog.admin.passwordPlaceholder")}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1.5 animate-fade-in">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={onClose} className="btn-secondary">
              {t("blog.admin.cancel")}
            </button>
            <button
              type="submit"
              disabled={!password.trim() || submitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("blog.admin.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= 模态对话框：新增 / 编辑 ================= */
interface PostModalProps {
  mode: "add" | "edit";
  initial?: BlogPost;
  onSubmit: (data: NewBlogPost) => void;
  onClose: () => void;
}

function PostModal({ mode, initial, onSubmit, onClose }: PostModalProps) {
  const { t } = useT();
  // 编辑默认文章时，预填当前语言的翻译文本（而非 i18n 键）
  const initialTitle = initial ? (initial.titleKey ? t(initial.titleKey as any) : initial.title) : "";
  const initialBody = initial ? (initial.bodyKey ? t(initial.bodyKey as any) : initial.body) : "";
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [icon, setIcon] = useState<BlogIcon>(initial?.icon ?? "lightbulb");
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  // 进入时聚焦标题输入框
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 锁定背景滚动
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError(t("blog.modal.required"));
      return;
    }
    onSubmit({ title, body, icon });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card max-w-lg w-full max-h-[90vh] flex flex-col animate-scale-in">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {mode === "add" ? t("blog.modal.addTitle") : t("blog.modal.editTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-hidden">
          <div className="overflow-y-auto px-1 -mx-1 space-y-4 flex-shrink min-h-0">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("blog.modal.titleLabel")}
              </label>
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("blog.modal.titlePlaceholder")}
                maxLength={80}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("blog.modal.bodyLabel")}
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t("blog.modal.bodyPlaceholder")}
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("blog.modal.iconLabel")}
              </label>
              <div className="flex flex-wrap gap-2">
                {ICON_KEYS.map((k) => (
                  <button
                    type="button"
                    key={k}
                    onClick={() => setIcon(k)}
                    title={t(`blog.icon.${k}` as any)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                      ${icon === k
                        ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                  >
                    <Icon name={k} className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 animate-fade-in">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 flex-shrink-0 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={onClose} className="btn-secondary">
              {t("blog.modal.cancel")}
            </button>
            <button type="submit" className="btn-primary">
              {t("blog.modal.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= 确认删除对话框 ================= */
function ConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useT();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="card max-w-sm w-full animate-scale-in">
        <div className="flex items-start gap-3 mb-4">
          <span className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
            {t("blog.confirmDelete")}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="btn-secondary">
            {t("blog.confirmDeleteCancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
          >
            {t("blog.confirmDeleteOk")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= 主页面 ================= */
export default function Blog({ onBack }: Props) {
  const { t } = useT();
  const { posts, loading, error, usingFallback, addPost, updatePost, removePost } = useBlogPosts();
  const { isAdmin, logout } = useAdminAuth();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; post?: BlogPost } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = () => setModal({ mode: "add" });
  const handleEdit = (post: BlogPost) => setModal({ mode: "edit", post });
  const handleDeleteRequest = (id: string) => setPendingDelete(id);
  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      setSubmitting(true);
      await removePost(pendingDelete);
    } catch {
      /* error 已在 hook 中设置 */
    } finally {
      setSubmitting(false);
      setPendingDelete(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t("blog.back")}
      </button>

      <div className="flex items-end justify-between mb-2 gap-4 flex-wrap">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {t("blog.title")}
        </h1>
        {isAdmin ? (
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
              bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
              text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
            title={t("blog.admin.sessionHint")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {t("blog.admin.logoutBtn")}
          </button>
        ) : (
          <button
            onClick={() => setLoginOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
              bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium
              shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            {t("blog.admin.loginBtn")}
          </button>
        )}
      </div>

      {/* 管理员状态横幅 */}
      {isAdmin ? (
        <div className="mb-6 flex items-center gap-2 px-3 py-2 rounded-lg
          bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30
          text-sm text-emerald-700 dark:text-emerald-400 animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t("blog.admin.welcome")}</span>
        </div>
      ) : (
        <div className="mb-6 flex items-start gap-2.5 px-3 py-2.5 rounded-lg
          bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30
          text-sm text-amber-800 dark:text-amber-300 animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span className="leading-relaxed">{t("blog.admin.banner")}</span>
        </div>
      )}

      <p className="text-gray-500 dark:text-gray-400 mb-10">{t("blog.intro")}</p>

      {/* 加载中 */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <svg className="w-8 h-8 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {/* 错误提示 */}
      {error && !loading && (
        <div className="card text-center py-8 mb-6 border border-red-200 dark:border-red-500/30">
          <p className="text-sm text-red-500 dark:text-red-400 mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="text-xs text-indigo-500 hover:underline">
            点击刷新重试
          </button>
        </div>
      )}

      {/* Fallback 提示（本地开发或 KV 未配置） */}
      {usingFallback && isAdmin && !loading && (
        <div className="mb-6 flex items-start gap-2 px-3 py-2 rounded-lg
          bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30
          text-xs text-blue-700 dark:text-blue-400 animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="leading-relaxed">
            本地开发模式：文章仅存储在浏览器本地。生产环境请在 Vercel 中配置 KV 存储以实现全站共享。
          </span>
        </div>
      )}

      {!loading && !error && (posts.length === 0 ? (
        <div className="card text-center py-12 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
            <Icon name="lightbulb" className="w-8 h-8" />
          </div>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {t("blog.empty")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("blog.emptyHint")}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post, i) => (
            <article
              key={post.id}
              className="card animate-slide-up group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex gap-4">
                <span className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400">
                  <Icon name={post.icon} />
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {post.titleKey ? t(post.titleKey as any) : post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap break-words">
                    {post.bodyKey ? t(post.bodyKey as any) : post.body}
                  </p>
                </div>
                {/* 仅管理员可见编辑/删除按钮 */}
                {isAdmin && (
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => handleEdit(post)}
                      title={t("blog.editBtn")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400
                        hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(post.id)}
                      title={t("blog.deleteBtn")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400
                        hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}

          {/* 管理员专属：底部「+ 新增」按钮（顶部横幅已是欢迎态） */}
          {isAdmin && (
            <button
              onClick={handleAdd}
              className="w-full card border-2 border-dashed border-indigo-300 dark:border-indigo-500/40
                hover:border-indigo-500 dark:hover:border-indigo-400
                hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5
                flex items-center justify-center gap-2 py-5
                text-indigo-600 dark:text-indigo-400 font-medium transition-colors animate-fade-in"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {t("blog.addBtn")}
            </button>
          )}
        </div>
      ))}

      {modal && (
        <PostModal
          mode={modal.mode}
          initial={modal.post}
          onClose={() => setModal(null)}
          onSubmit={async (data) => {
            try {
              setSubmitting(true);
              if (modal.mode === "add") await addPost(data);
              else if (modal.post) await updatePost(modal.post.id, data);
              setModal(null);
            } catch {
              /* error 已在 hook 中设置 */
            } finally {
              setSubmitting(false);
            }
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {loginOpen && (
        <AdminLoginDialog
          onSuccess={() => setLoginOpen(false)}
          onClose={() => setLoginOpen(false)}
        />
      )}
    </div>
  );
}
