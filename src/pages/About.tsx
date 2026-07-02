import { useT } from "../i18n";

interface Props {
  onBack: () => void;
}

export default function About({ onBack }: Props) {
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
        {t("about.back")}
      </button>

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
        {t("about.title")}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10">
        {t("about.intro")}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          {t("about.mission")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {t("about.missionText")}
        </p>
      </section>

      <section className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/5 dark:to-purple-500/5 border border-indigo-100 dark:border-indigo-500/20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </span>
          {t("about.tech")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {t("about.techText")}
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: t("about.feature1.label"), sub: t("about.feature1.sub") },
          { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: t("about.feature2.label"), sub: t("about.feature2.sub") },
          { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064", label: t("about.feature3.label"), sub: t("about.feature3.sub") },
          { icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01", label: t("about.feature4.label"), sub: t("about.feature4.sub") },
        ].map((item, i) => (
          <div key={i} className="card flex items-start gap-3 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
            </span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
