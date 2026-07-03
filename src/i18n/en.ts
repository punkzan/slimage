import type { Locale } from "./types";

const en: Locale = {
  // Header
  "header.home": "Home",
  "header.faq": "FAQ",
  "header.about": "About",
  "header.privacy": "Privacy",
  "header.contact": "Contact",
  "header.blog": "Blog",
  "header.themeLight": "Switch to light mode",
  "header.themeDark": "Switch to dark mode",
  "header.langSwitch": "切换到中文",

  // Upload
  "upload.title": "Smart Image Compression",
  "upload.subtitle":
    "All processing happens locally in your browser. Your images never leave your device. Supports PNG, JPEG, WebP, AVIF.",
  "upload.dragActive": "Drop images here",
  "upload.dragIdle": "Drag & drop images here",
  "upload.clickHint": "or click to browse",
  "upload.maxFiles": "Up to {max} images, max {size}MB each",

  // ControlBar
  "control.quality": "Quality",
  "control.smallerFile": "Smaller file",
  "control.higherQuality": "Higher quality",
  "control.outputFormat": "Output format",
  "control.keepFormat": "Keep original",

  // FileList
  "fileList.selected": "{count} image(s) selected",
  "fileList.addMoreHint": "Drag more or Ctrl+V to add",
  "fileList.addMore": "Add more images ({current}/{max})",

  // FileItem
  "fileItem.compressProgress": "Compressing...",
  "fileItem.download": "Download",
  "fileItem.compare": "Compare",
  "fileItem.hideCompare": "Hide compare",
  "fileItem.retry": "Retry",
  "fileItem.remove": "Remove",
  "fileItem.compressFailed": "Compression failed",

  // CompareSlider
  "compare.original": "Original",
  "compare.compressed": "Compressed",

  // SummaryBar
  "summary.title": "Compression Summary",
  "summary.totalFiles": "Total files",
  "summary.originalSize": "Original size",
  "summary.compressed": "Compressed",
  "summary.saved": "Saved",
  "summary.errors": "{count} image(s) failed",

  // Compress actions
  "compress.compressBtn": "Compress {count} image(s)",
  "compress.compressProgress": "Compressing {done}/{total}",
  "compress.downloadAll": "Download all (ZIP)",
  "compress.restart": "Start over",

  // FAQ
  "faq.title": "Frequently Asked Questions",
  "faq.q1": "Are my images uploaded to a server?",
  "faq.a1":
    "No. All compression happens locally in your browser. Images never leave your device. This is Slimage's biggest difference from other image editing websites — zero privacy risk.",
  "faq.q2": "Which image formats are supported?",
  "faq.a2": "PNG, JPEG, WebP, and AVIF are supported. JPEG achieves the best compression, PNG preserves alpha transparency.",
  "faq.q3": "How is the compression quality?",
  "faq.a3":
    "Slimage uses WASM encoders (MozJPEG / libwebp / pngquant / libavif) — the same engines powering TinyPNG. The quality slider (1–100) lets you balance file size and fidelity.",
  "faq.q4": "Are there file size limits?",
  "faq.a4":
    "Individual images should not exceed 5MB, with a maximum resolution of 3840px. Oversized images are scaled down before compression to avoid memory issues.",
  "faq.q5": "Can I batch process images?",
  "faq.a5":
    "Yes, you can add up to 20 images at once. After compression, download all results as a single ZIP file.",

  // Footer
  "footer.tagline": "Slimage — Smart Image Compression",
  "footer.subtagline": "Browser-side processing · Privacy safe",

  // Toast / rejection messages
  "toast.invalidFormat": "{name} — unsupported format (PNG/JPEG/WebP/AVIF only)",
  "toast.fileTooLarge": "{name} exceeds the 5MB limit",
  "toast.maxCount": "Maximum 20 images, extra files skipped",
  "toast.duplicate": "{name} already added, duplicate skipped",

  // Error messages
  "error.compressionFailed": "Compression failed",
  "error.unsupportedFormat": "Unsupported image format",

  // About page
  "about.title": "About Slimage",
  "about.intro": "Slimage is a browser-side online image compression tool dedicated to providing a secure, efficient, and high-quality image compression experience.",
  "about.mission": "Our Mission",
  "about.missionText": "In today's digital age, images have become the core medium of information delivery. However, large images seriously impact page load speed and user experience. Slimage's mission is to make image compression effortless for everyone — no software installation needed, no privacy concerns — everything happens right in your browser.",
  "about.tech": "Technology Stack",
  "about.techText": "Slimage leverages cutting-edge WebAssembly technology, compiling industry-leading image encoders (MozJPEG, libwebp, pngquant, libavif) into WASM modules that run directly in your browser. This means you get the same compression quality as professional desktop software, with the absolute security of zero uploads and zero privacy risk.",
  "about.feature1.label": "WASM Encoders",
  "about.feature1.sub": "MozJPEG / libwebp / pngquant / libavif",
  "about.feature2.label": "Zero Privacy Risk",
  "about.feature2.sub": "Images never leave your browser",
  "about.feature3.label": "8 Languages",
  "about.feature3.sub": "中文 / English / 日本語 / 한국어 & more",
  "about.feature4.label": "Open Source Stack",
  "about.feature4.sub": "React / Vite / Tailwind / WASM",
  "about.back": "Back to Home",

  // Privacy page
  "privacy.title": "Privacy Policy",
  "privacy.p1": "Last updated: July 1, 2026",
  "privacy.p2": "Slimage is a purely front-end application. All image processing is performed locally in your browser. Image files are never uploaded to any server. We do not collect, store, or transmit any of your image data.",
  "privacy.p3": "We use localStorage solely to store your interface preferences (language selection and dark mode setting). This data remains entirely on your device and is never sent to any server.",
  "privacy.p4": "Slimage does not use cookies, does not embed third-party tracking scripts, and does not collect any analytics data. We have no server-side database, so data breaches are impossible.",
  "privacy.p5": "This website may use CDN services to accelerate the delivery of static assets (HTML, CSS, JavaScript, WASM modules). CDN nodes only cache publicly available static files and do not involve any user data.",
  "privacy.p6": "If you have any questions about this privacy policy, please contact us through the Contact page.",
  "privacy.back": "Back to Home",

  // Contact page
  "contact.title": "Contact Us",
  "contact.intro": "If you have any questions, suggestions, or collaboration inquiries, feel free to reach out through the following channels. We typically respond within 1-2 business days.",
  "contact.email": "Email",
  "contact.response": "We typically respond within 1-2 business days.",
  "contact.back": "Back to Home",

  // Blog page
  "blog.title": "Tips & Insights",
  "blog.intro": "Here are some image compression tips and best practices we've gathered. Hope you find them helpful.",
  "blog.tip1.title": "Choose the Right Output Format",
  "blog.tip1.body": "For photographic images, output as JPEG or WebP is recommended. For icons and screenshots, PNG works best. For the highest compression ratio, try AVIF (note older browser compatibility). WebP offers the best balance of file size and compatibility in most scenarios.",
  "blog.tip2.title": "Adjust Compression Quality Wisely",
  "blog.tip2.body": "Generally, a quality value of 70-85 gives the best balance between file size and visual quality. For web display purposes, 60-70 is usually sufficient — the human eye can barely tell the difference. For print or high-definition display, use 85-95.",
  "blog.tip3.title": "Batch Processing for Efficiency",
  "blog.tip3.body": "Slimage supports processing up to 20 images at once. After compression, you can download all results as a single ZIP file. We recommend grouping similar types of images (e.g., product photos, article illustrations) in the same batch — this lets you apply uniform compression settings and greatly boosts efficiency.",
  "blog.tip4.title": "Resize Before Compressing",
  "blog.tip4.body": "If the original image resolution far exceeds your actual use case (e.g., using a 4000px wide photo as a website header), consider resizing it to the target dimensions first, then compress with Slimage. This yields even smaller file sizes. Slimage will automatically scale down oversized images, but pre-resizing produces better results.",
  "blog.addBtn": "Add Article",
  "blog.editBtn": "Edit",
  "blog.deleteBtn": "Delete",
  "blog.empty": "No articles yet",
  "blog.emptyHint": "Click \"Add Article\" in the top right to start sharing your insights",
  "blog.modal.addTitle": "New Article",
  "blog.modal.editTitle": "Edit Article",
  "blog.modal.titleLabel": "Title",
  "blog.modal.titlePlaceholder": "Give your article a title…",
  "blog.modal.bodyLabel": "Body",
  "blog.modal.bodyPlaceholder": "Share your tips and insights…",
  "blog.modal.iconLabel": "Icon",
  "blog.modal.save": "Save",
  "blog.modal.cancel": "Cancel",
  "blog.modal.required": "Title and body cannot be empty",
  "blog.confirmDelete": "Delete this article?",
  "blog.confirmDeleteOk": "Delete",
  "blog.confirmDeleteCancel": "Keep it",
  "blog.icon.image": "Image",
  "blog.icon.sliders": "Sliders",
  "blog.icon.stack": "Batch",
  "blog.icon.expand": "Resize",
  "blog.icon.lightbulb": "Idea",
  "blog.back": "Back to Home",

  // Blog admin auth
  "blog.admin.banner": "To publish an article, please contact the administrator for the password, then sign in.",
  "blog.admin.loginBtn": "Admin sign in",
  "blog.admin.logoutBtn": "Sign out",
  "blog.admin.welcome": "Signed in as admin",
  "blog.admin.loginTitle": "Admin sign in",
  "blog.admin.passwordLabel": "Admin password",
  "blog.admin.passwordPlaceholder": "Enter admin password",
  "blog.admin.loginError": "Wrong password, please try again",
  "blog.admin.submit": "Sign in",
  "blog.admin.cancel": "Cancel",
  "blog.admin.lockIcon": "Admin lock",
  "blog.admin.sessionHint": "Session remains valid for 24 hours",
};

export default en;
