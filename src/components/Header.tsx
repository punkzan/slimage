import { useState, useRef, useEffect } from "react";
import { useT, LANGS } from "../i18n";

export type Page = "home" | "about" | "privacy" | "contact" | "blog";

interface Props {
  dark: boolean;
  onToggleDark: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { page: Page; labelKey: string }[] = [
  { page: "home", labelKey: "header.home" },
  { page: "about", labelKey: "header.about" },
  { page: "privacy", labelKey: "header.privacy" },
  { page: "contact", labelKey: "header.contact" },
  { page: "blog", labelKey: "header.blog" },
];

export default function Header({ dark, onToggleDark, currentPage, onNavigate }: Props) {
  const { t, lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target) && mobileLangRef.current && !mobileLangRef.current.contains(target)) {
        setOpen(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(target)) {
        setMobileNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm">
            S
          </span>
          Slimage
        </button>

        {/* 桌面端导航 */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-4 lg:gap-6 text-sm text-gray-600 dark:text-gray-400">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`transition-colors ${
                  currentPage === item.page
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {t(item.labelKey as any)}
              </button>
            ))}
          </nav>

          {/* 语言选择器 */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="h-9 px-2.5 rounded-lg flex items-center gap-1.5 transition-colors
                hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400
                text-sm font-medium"
              title={t("header.langSwitch")}
            >
              <span>{current.native}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg
                py-1 overflow-hidden z-50 animate-scale-in origin-top-right">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setLang(l.code); setOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 transition-colors
                      ${l.code === lang
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                  >
                    <span>{l.native}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{l.en}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 暗色模式切换 */}
          <button
            type="button"
            onClick={onToggleDark}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors
              hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            title={dark ? t("header.themeLight") : t("header.themeDark")}
            aria-label={dark ? t("header.themeLight") : t("header.themeDark")}
          >
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* 移动端汉堡菜单按钮 */}
        <div className="flex sm:hidden items-center gap-2">
          <div ref={mobileLangRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="h-9 px-2 rounded-lg flex items-center gap-1 transition-colors
                hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400
                text-sm font-medium"
              title={t("header.langSwitch")}
            >
              <span>{current.native}</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg
                py-1 overflow-hidden z-50 animate-scale-in origin-top-right">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setLang(l.code); setOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 transition-colors
                      ${l.code === lang
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                  >
                    <span>{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onToggleDark}
            className="w-9 h-9 rounded-lg flex items-center justify-center
              hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <div ref={mobileNavRef} className="relative">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center
                hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {mobileNavOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg
                py-1 overflow-hidden z-50 animate-scale-in origin-top-right">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => { onNavigate(item.page); setMobileNavOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors
                      ${currentPage === item.page
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                  >
                    {t(item.labelKey as any)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
