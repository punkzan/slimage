export type Lang = "zh-CN" | "en" | "ru" | "de" | "ko" | "ja" | "fr" | "ar";

/** 语言元数据：用于 UI 展示 */
export interface LangMeta {
  code: Lang;
  native: string;
  en: string;
}

export interface Locale {
  // Header
  "header.home": string;
  "header.faq": string;
  "header.about": string;
  "header.privacy": string;
  "header.contact": string;
  "header.blog": string;
  "header.themeLight": string;
  "header.themeDark": string;
  "header.langSwitch": string;

  // Upload
  "upload.title": string;
  "upload.subtitle": string;
  "upload.dragActive": string;
  "upload.dragIdle": string;
  "upload.clickHint": string;
  "upload.maxFiles": string;

  // ControlBar
  "control.quality": string;
  "control.smallerFile": string;
  "control.higherQuality": string;
  "control.outputFormat": string;
  "control.keepFormat": string;

  // FileList
  "fileList.selected": string;
  "fileList.addMoreHint": string;
  "fileList.addMore": string;

  // FileItem
  "fileItem.compressProgress": string;
  "fileItem.download": string;
  "fileItem.compare": string;
  "fileItem.hideCompare": string;
  "fileItem.retry": string;
  "fileItem.remove": string;
  "fileItem.compressFailed": string;

  // CompareSlider
  "compare.original": string;
  "compare.compressed": string;

  // SummaryBar
  "summary.title": string;
  "summary.totalFiles": string;
  "summary.originalSize": string;
  "summary.compressed": string;
  "summary.saved": string;
  "summary.errors": string;

  // Compress actions
  "compress.compressBtn": string;
  "compress.compressProgress": string;
  "compress.downloadAll": string;
  "compress.restart": string;

  // FAQ
  "faq.title": string;
  "faq.q1": string;
  "faq.a1": string;
  "faq.q2": string;
  "faq.a2": string;
  "faq.q3": string;
  "faq.a3": string;
  "faq.q4": string;
  "faq.a4": string;
  "faq.q5": string;
  "faq.a5": string;

  // Footer
  "footer.tagline": string;
  "footer.subtagline": string;

  // Toast / rejection messages
  "toast.invalidFormat": string;
  "toast.fileTooLarge": string;
  "toast.maxCount": string;
  "toast.duplicate": string;

  // Error messages
  "error.compressionFailed": string;
  "error.unsupportedFormat": string;

  // About page
  "about.title": string;
  "about.intro": string;
  "about.mission": string;
  "about.missionText": string;
  "about.tech": string;
  "about.techText": string;
  "about.feature1.label": string;
  "about.feature1.sub": string;
  "about.feature2.label": string;
  "about.feature2.sub": string;
  "about.feature3.label": string;
  "about.feature3.sub": string;
  "about.feature4.label": string;
  "about.feature4.sub": string;
  "about.back": string;

  // Privacy page
  "privacy.title": string;
  "privacy.p1": string;
  "privacy.p2": string;
  "privacy.p3": string;
  "privacy.p4": string;
  "privacy.p5": string;
  "privacy.p6": string;
  "privacy.back": string;

  // Contact page
  "contact.title": string;
  "contact.intro": string;
  "contact.email": string;
  "contact.wechat": string;
  "contact.response": string;
  "contact.back": string;

  // Blog page
  "blog.title": string;
  "blog.intro": string;
  "blog.back": string;
  "blog.addBtn": string;
  "blog.editBtn": string;
  "blog.deleteBtn": string;
  "blog.empty": string;
  "blog.emptyHint": string;
  "blog.modal.addTitle": string;
  "blog.modal.editTitle": string;
  "blog.modal.titleLabel": string;
  "blog.modal.titlePlaceholder": string;
  "blog.modal.bodyLabel": string;
  "blog.modal.bodyPlaceholder": string;
  "blog.modal.iconLabel": string;
  "blog.modal.save": string;
  "blog.modal.cancel": string;
  "blog.modal.required": string;
  "blog.confirmDelete": string;
  "blog.confirmDeleteOk": string;
  "blog.confirmDeleteCancel": string;
  "blog.icon.image": string;
  "blog.icon.sliders": string;
  "blog.icon.stack": string;
  "blog.icon.expand": string;
  "blog.icon.lightbulb": string;

  // Blog admin auth
  "blog.admin.banner": string;
  "blog.admin.loginBtn": string;
  "blog.admin.logoutBtn": string;
  "blog.admin.welcome": string;
  "blog.admin.loginTitle": string;
  "blog.admin.passwordLabel": string;
  "blog.admin.passwordPlaceholder": string;
  "blog.admin.loginError": string;
  "blog.admin.submit": string;
  "blog.admin.cancel": string;
  "blog.admin.lockIcon": string;
  "blog.admin.sessionHint": string;
}
