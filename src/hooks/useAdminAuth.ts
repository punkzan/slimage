// ============================================================
// useAdminAuth — 管理员身份认证（localStorage 持久化）
// 流程：输入密码 → 写入会话（含密码） → 24小时有效
// 密码配置：DEFAULT_ADMIN_PASSWORD（前端预校验 + API 服务端校验）
// API 写操作时从 session 读取密码，通过 x-admin-password 头发送
// ============================================================

import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "slimage-admin-session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 小时

/**
 * 默认管理员密码（前端预校验用）。
 * 服务端通过 ADMIN_PASSWORD 环境变量校验（默认也是这个值）。
 * 修改密码：在 Vercel → Settings → Environment Variables 设置 ADMIN_PASSWORD
 */
const DEFAULT_ADMIN_PASSWORD = "slimage2024";

interface AdminSession {
  expiresAt: number;
  /** 仅作存储标记位，避免空对象被识别为有效会话 */
  ok: true;
  /** 管理员密码（用于 API 写操作时的服务端校验） */
  password: string;
}

function loadSession(): boolean {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed?.ok || !parsed?.expiresAt) return false;
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function saveSession(password: string): void {
  try {
    const data: AdminSession = {
      ok: true,
      expiresAt: Date.now() + SESSION_TTL_MS,
      password,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    /* 忽略（隐私模式） */
  }
}

function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* 忽略 */
  }
}

export interface UseAdminAuth {
  isAdmin: boolean;
  /** 校验密码并写入会话（24小时有效） */
  login: (password: string) => Promise<boolean>;
  /** 清除会话 */
  logout: () => void;
}

export function useAdminAuth(): UseAdminAuth {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(loadSession());
  }, []);

  const login = useCallback(async (password: string) => {
    if (password !== DEFAULT_ADMIN_PASSWORD) return false;
    saveSession(password);
    setIsAdmin(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setIsAdmin(false);
  }, []);

  return { isAdmin, login, logout };
}
