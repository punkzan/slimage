import { useT } from "../i18n";

export default function Footer() {
  const { t } = useT();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
      <p>{t("footer.tagline")}</p>
      <p className="mt-1">{t("footer.subtagline")}</p>
    </footer>
  );
}
