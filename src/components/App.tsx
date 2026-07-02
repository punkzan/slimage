import { useState, useCallback } from "react";
import type { CompressedFile, Summary } from "../types";
import { useFileUpload } from "../hooks/useFileUpload";
import { useCompression, type CompressionSettings } from "../hooks/useCompression";
import { useToast } from "../hooks/useToast";
import { useDarkMode } from "../hooks/useDarkMode";
import { useT } from "../i18n";
import { downloadAllAsZip } from "../lib/compression";
import { revokeUrl } from "../lib/utils";
import Header, { type Page } from "./Header";
import UploadZone from "./UploadZone";
import ControlBar from "./ControlBar";
import FileList from "./FileList";
import SummaryBar from "./SummaryBar";
import Toast from "./Toast";
import FAQ from "./FAQ";
import Footer from "./Footer";
import About from "../pages/About";
import Privacy from "../pages/Privacy";
import Contact from "../pages/Contact";
import Blog from "../pages/Blog";

const DEFAULT_SETTINGS: CompressionSettings = {
  quality: 75,
  outputFormat: "keep",
};

export default function App() {
  const { files, setFiles, addFiles, removeFile, clearAll } = useFileUpload();
  const { isCompressing, progress, startCompression, retryFile } = useCompression();
  const [summary, setSummary] = useState<Summary | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  const [dark, toggleDark] = useDarkMode();
  const [settings, setSettings] = useState<CompressionSettings>(DEFAULT_SETTINGS);
  const [page, setPage] = useState<Page>("home");
  const { t } = useT();

  // 包装 addFiles，翻译被拒绝的原因
  const handleAddFiles = useCallback(
    (incoming: File[]) => {
      const rejected = addFiles(incoming);
      for (const r of rejected) {
        const text = t(`toast.${r.code}` as any, { name: r.name || "" });
        addToast("warning", text);
      }
    },
    [addFiles, addToast, t]
  );

  const computeSummary = useCallback((fileList: CompressedFile[]) => {
    const doneFiles = fileList.filter((f) => f.status === "done");
    if (doneFiles.length === 0) return;
    const totalOriginal = doneFiles.reduce((s, f) => s + f.originalSize, 0);
    const totalCompressed = doneFiles.reduce((s, f) => s + (f.compressedSize ?? 0), 0);
    setSummary({
      totalOriginal,
      totalCompressed,
      totalSaved: totalOriginal - totalCompressed,
      overallRatio: Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100),
      fileCount: fileList.length,
      successCount: doneFiles.length,
      errorCount: fileList.filter((f) => f.status === "error").length,
    });
  }, []);

  const handleCompress = useCallback(() => {
    startCompression(files, settings, (results) => {
      setFiles((prev) => {
        const updated = prev.map((f) => results.find((r) => r.id === f.id) ?? f);
        computeSummary(updated);
        return updated;
      });
    });
  }, [files, settings, startCompression, setFiles, computeSummary]);

  const handleRetry = useCallback(
    async (file: CompressedFile) => {
      const result = await retryFile(file, settings);
      setFiles((prev) => {
        const updated = prev.map((f) => (f.id === result.id ? result : f));
        if (updated.some((f) => f.status === "done")) {
          computeSummary(updated);
        }
        return updated;
      });
    },
    [retryFile, settings, setFiles, computeSummary]
  );

  const handleReset = useCallback(() => {
    files.forEach((f) => {
      revokeUrl(f.previewUrl);
      if (f.compressedUrl) revokeUrl(f.compressedUrl);
    });
    clearAll();
    setSummary(null);
  }, [files, clearAll]);

  const handleDownloadAll = useCallback(() => {
    downloadAllAsZip(files);
  }, [files]);

  const handleNavigate = useCallback((newPage: Page) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  }, []);

  const hasPending = files.some((f) => f.status === "idle");
  const hasDone = files.some((f) => f.status === "done");
  const pendingCount = files.filter((f) => f.status === "idle").length;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Toast toasts={toasts} onRemove={removeToast} />
      <Header dark={dark} onToggleDark={toggleDark} currentPage={page} onNavigate={handleNavigate} />

      {page === "home" ? (
        <main className="flex-1 max-w-3xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8">
          {files.length === 0 ? (
            <UploadZone onFilesAdded={handleAddFiles} />
          ) : (
            <div className="space-y-6 animate-fade-in">
              {!hasDone && (
                <ControlBar
                  quality={settings.quality}
                  onQualityChange={(q) => setSettings((s) => ({ ...s, quality: q }))}
                  outputFormat={settings.outputFormat}
                  onOutputFormatChange={(f) =>
                    setSettings((s) => ({ ...s, outputFormat: f }))
                  }
                  disabled={isCompressing}
                />
              )}

              <FileList
                files={files}
                onRemove={removeFile}
                onAddMore={handleAddFiles}
                onRetry={handleRetry}
                isCompressing={isCompressing}
              />

              {summary && <SummaryBar summary={summary} />}

              {isCompressing && progress.total > 0 && (
                <div className="text-center space-y-2">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs mx-auto">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round((progress.done / progress.total) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {progress.done}/{progress.total}
                    {progress.currentName ? ` — ${progress.currentName}` : ""}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 flex-wrap">
                {hasPending && (
                  <button
                    className="btn-primary"
                    onClick={handleCompress}
                    disabled={isCompressing}
                  >
                    {isCompressing
                      ? t("compress.compressProgress", { done: progress.done, total: progress.total })
                      : t("compress.compressBtn", { count: pendingCount })}
                  </button>
                )}
                {hasDone && (
                  <>
                    <button className="btn-primary" onClick={handleDownloadAll}>
                      {t("compress.downloadAll")}
                    </button>
                    <button className="btn-secondary" onClick={handleReset}>
                      {t("compress.restart")}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          <FAQ />
        </main>
      ) : (
        <main className="flex-1 max-w-3xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8">
          {page === "about" && <About onBack={() => handleNavigate("home")} />}
          {page === "privacy" && <Privacy onBack={() => handleNavigate("home")} />}
          {page === "contact" && <Contact onBack={() => handleNavigate("home")} />}
          {page === "blog" && <Blog onBack={() => handleNavigate("home")} />}
        </main>
      )}

      <Footer />
    </div>
  );
}
