// ============================================================
// useAdminAuth — 管理员身份认证（localStorage 持久化）
// 流程：输入密码 → 写入会话 → 24小时有效
// 密码配置：DEFAULT_ADMIN_PASSWORD（仅前端演示用，生产请用后端校验）
// ============================================================

import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "slimage-admin-session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 小时

/**
 * 默认管理员密码。
 * 这是前端演示用的简单鉴权，真实场景应在服务端校验。
 * 如需修改密码，只改这里这一行即可。
 */
const DEFAULT_ADMIN_PASSWORD = "slimage2024";

interface AdminSession {
  expiresAt: number;
  /** 仅作存储标记位，避免空对象被识别为有效会话 */
  ok: true;
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

function saveSession(): void {
  try {
    const data: AdminSession = {
      ok: true,
      expiresAt: Date.now() + SESSION_TTL_MS,
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
    saveSession();
    setIsAdmin(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setIsAdmin(false);
  }, []);

  return { isAdmin, login, logout };
}
