import { useT } from "../i18n";

interface Props {
  onBack: () => void;
}

export default function Privacy({ onBack }: Props) {
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
        {t("privacy.back")}
      </button>

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        {t("privacy.title")}
      </h1>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
        {t("privacy.p1")}
      </p>

      <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
        <div className="card">
          <div className="flex gap-3">
            <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <div>
              <p>{t("privacy.p2")}</p>
            </div>
          </div>
        </div>

        <p>{t("privacy.p3")}</p>
        <p>{t("privacy.p4")}</p>
        <p>{t("privacy.p5")}</p>
        <p>{t("privacy.p6")}</p>
      </div>
    </div>
  );
}
