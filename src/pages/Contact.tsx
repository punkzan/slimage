import { useT } from "../i18n";

interface Props {
  onBack: () => void;
}

export default function Contact({ onBack }: Props) {
  const { t } = useT();

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t("contact.back")}
      </button>

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
        {t("contact.title")}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10">
        {t("contact.intro")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="card flex items-start gap-4 animate-slide-up" style={{ animationDelay: "0s" }}>
          <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t("contact.email")}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">contact@slimage.app</p>
          </div>
        </div>

        <div className="card flex items-start gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <span className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t("contact.wechat")}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">SlimageApp</p>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 dark:text-gray-500 animate-fade-in">
        {t("contact.response")}
      </p>
    </div>
  );
}
