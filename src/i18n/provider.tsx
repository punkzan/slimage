import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Lang, Locale, LangMeta } from "./types";
import zhCN from "./zh-CN";
import en from "./en";
import ru from "./ru";
import de from "./de";
import ko from "./ko";
import ja from "./ja";
import fr from "./fr";
import ar from "./ar";

const LOCALES: Record<Lang, Locale> = {
  "zh-CN": zhCN,
  en,
  ru,
  de,
  ko,
  ja,
  fr,
  ar,
};

/** 所有可用语言，按展示顺序排列 */
export const LANGS: LangMeta[] = [
  { code: "zh-CN", native: "中文", en: "Chinese" },
  { code: "en",    native: "English", en: "English" },
  { code: "ja",    native: "日本語", en: "Japanese" },
  { code: "ko",    native: "한국어", en: "Korean" },
  { code: "ru",    native: "Русский", en: "Russian" },
  { code: "de",    native: "Deutsch", en: "German" },
  { code: "fr",    native: "Français", en: "French" },
  { code: "ar",    native: "العربية", en: "Arabic" },
] as const;

const ALL_CODES: readonly Lang[] = LANGS.map((l) => l.code);

const STORAGE_KEY = "slimage-lang";

// -------- Context --------
interface I18nCtx {
  lang: Lang;
  t: (key: keyof Locale, vars?: Record<string, string | number>) => string;
  setLang: (lang: Lang) => void;
}

const ctx = createContext<I18nCtx | null>(null);

function resolveDefaultLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (ALL_CODES as readonly string[]).includes(stored)) return stored as Lang;
  } catch {}
  if (typeof navigator !== "undefined") {
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith("zh")) return "zh-CN";
    if (nav.startsWith("ja")) return "ja";
    if (nav.startsWith("ko")) return "ko";
    if (nav.startsWith("ru")) return "ru";
    if (nav.startsWith("de")) return "de";
    if (nav.startsWith("fr")) return "fr";
    if (nav.startsWith("ar")) return "ar";
  }
  return "en";
}

// -------- Provider --------
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(resolveDefaultLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    // 设置 HTML dir 属性，阿拉伯语为 RTL
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, []);

  const t = useCallback(
    (key: keyof Locale, vars?: Record<string, string | number>) => {
      let template = LOCALES[lang][key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          template = template.replace(`{${k}}`, String(v));
        }
      }
      return template;
    },
    [lang]
  );

  return <ctx.Provider value={{ lang, t, setLang }}>{children}</ctx.Provider>;
}

// -------- Hook --------
export function useT() {
  const c = useContext(ctx);
  if (!c) throw new Error("useT must be used inside I18nProvider");
  return c;
}
