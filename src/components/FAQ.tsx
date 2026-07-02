import { useState } from "react";
import { useT } from "../i18n";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useT();

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <section id="faq" className="max-w-3xl mx-auto w-full px-3 sm:px-4 py-12 sm:py-16">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-6 sm:mb-8">
        {t("faq.title")}
      </h2>
      <div className="space-y-3">
        {faqs.map((item, i) => (
          <div key={i} className="card transition-colors">
            <button
              className="w-full flex items-center justify-between text-left"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="font-medium text-gray-800 dark:text-gray-200">{item.q}</span>
              <svg
                className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed animate-slide-up">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
