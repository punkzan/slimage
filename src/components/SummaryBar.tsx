import type { Summary } from "../types";
import { useT } from "../i18n";
import { formatSize } from "../lib/utils";

interface Props {
  summary: Summary;
}

export default function SummaryBar({ summary }: Props) {
  const { t } = useT();

  return (
    <div className="card bg-gradient-to-r from-indigo-50 to-purple-50
      dark:from-indigo-500/5 dark:to-purple-500/5 border-indigo-100 dark:border-indigo-500/20
      animate-scale-in relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-2 h-2 bg-indigo-300 dark:bg-indigo-500/40 rounded-full top-2 left-8 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0s" }} />
        <div className="absolute w-1.5 h-1.5 bg-green-300 dark:bg-green-500/40 rounded-full top-6 right-12 animate-ping" style={{ animationDuration: "1.8s", animationDelay: "0.2s" }} />
        <div className="absolute w-2 h-2 bg-purple-300 dark:bg-purple-500/40 rounded-full bottom-4 left-16 animate-ping" style={{ animationDuration: "1.3s", animationDelay: "0.4s" }} />
        <div className="absolute w-1.5 h-1.5 bg-yellow-300 dark:bg-yellow-500/40 rounded-full top-2 right-6 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.1s" }} />
        <div className="absolute w-1 h-1 bg-indigo-300 dark:bg-indigo-400/40 rounded-full bottom-6 right-16 animate-ping" style={{ animationDuration: "1.7s", animationDelay: "0.6s" }} />
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">{t("summary.title")}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label={t("summary.totalFiles")} value={`${summary.successCount}/${summary.fileCount}`} />
        <Stat label={t("summary.originalSize")} value={formatSize(summary.totalOriginal)} />
        <Stat label={t("summary.compressed")} value={formatSize(summary.totalCompressed)} />
        <Stat
          label={t("summary.saved")}
          value={`${summary.overallRatio}%`}
          highlight
        />
      </div>
      {summary.errorCount > 0 && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-3">
          {t("summary.errors", { count: summary.errorCount })}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p
        className={`text-lg font-bold ${
          highlight
            ? "text-green-600 dark:text-green-400"
            : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
