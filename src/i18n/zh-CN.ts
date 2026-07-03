import type { Locale } from "./types";

const zhCN: Locale = {
  // Header
  "header.home": "首页",
  "header.faq": "常见问题",
  "header.about": "关于我们",
  "header.privacy": "隐私政策",
  "header.contact": "联系我们",
  "header.blog": "经验分享",
  "header.themeLight": "切换浅色模式",
  "header.themeDark": "切换暗色模式",
  "header.langSwitch": "Switch to English",

  // Upload
  "upload.title": "图片智能压缩",
  "upload.subtitle": "纯浏览器端处理，图片不会离开你的设备。支持 PNG、JPEG、WebP、AVIF 格式。",
  "upload.dragActive": "松开即可上传",
  "upload.dragIdle": "拖拽图片到这里",
  "upload.clickHint": "或点击选择文件",
  "upload.maxFiles": "最多 {max} 张，单张不超过 {size}MB",

  // ControlBar
  "control.quality": "压缩质量",
  "control.smallerFile": "文件更小",
  "control.higherQuality": "画质更高",
  "control.outputFormat": "输出格式",
  "control.keepFormat": "保持原格式",

  // FileList
  "fileList.selected": "已选择 {count} 张图片",
  "fileList.addMoreHint": "可继续拖入或 Ctrl+V 粘贴",
  "fileList.addMore": "继续添加图片 ({current}/{max})",

  // FileItem
  "fileItem.compressProgress": "压缩中...",
  "fileItem.download": "下载",
  "fileItem.compare": "前后对比",
  "fileItem.hideCompare": "隐藏对比",
  "fileItem.retry": "重试",
  "fileItem.remove": "移除",
  "fileItem.compressFailed": "压缩失败",

  // CompareSlider
  "compare.original": "原始",
  "compare.compressed": "压缩后",

  // SummaryBar
  "summary.title": "压缩汇总",
  "summary.totalFiles": "总文件",
  "summary.originalSize": "原始大小",
  "summary.compressed": "压缩后",
  "summary.saved": "节省空间",
  "summary.errors": "{count} 张图片压缩失败",

  // Compress actions
  "compress.compressBtn": "压缩 {count} 张图片",
  "compress.compressProgress": "压缩中 {done}/{total}",
  "compress.downloadAll": "下载全部 (ZIP)",
  "compress.restart": "重新开始",

  // FAQ
  "faq.title": "常见问题",
  "faq.q1": "图片会被上传到服务器吗？",
  "faq.a1": "不会。所有压缩均在你的浏览器本地完成，图片不会离开你的设备。这是 Slimage 与其他图片编辑网站最大的不同——零隐私风险。",
  "faq.q2": "支持哪些图片格式？",
  "faq.a2": "支持 PNG、JPEG、WebP、AVIF。JPEG 压缩效果最好，PNG 保留透明通道。",
  "faq.q3": "压缩后的画质如何？",
  "faq.a3": "采用 WASM 编码器（MozJPEG / libwebp / pngquant / libavif），与 TinyPNG 底层引擎一致，可获得顶级压缩质量。质量滑块 1-100 可调，满足不同场景需求。",
  "faq.q4": "有文件大小限制吗？",
  "faq.a4": "单张图片建议不超过 5MB，最大分辨率不超过 3840px。超大图片会先缩放再压缩，避免浏览器内存溢出。",
  "faq.q5": "可以批量处理吗？",
  "faq.a5": "可以，一次最多添加 20 张图片。压缩完成后可以一键打包下载 ZIP 文件。",

  // Footer
  "footer.tagline": "Slimage — 图片智能压缩工具",
  "footer.subtagline": "纯浏览器端处理 · 隐私安全",

  // Toast / rejection messages
  "toast.invalidFormat": "{name} 格式不支持，仅支持 PNG/JPEG/WebP/AVIF",
  "toast.fileTooLarge": "{name} 超过 5MB 限制",
  "toast.maxCount": "最多添加 20 张图片，已跳过多余文件",
  "toast.duplicate": "{name} 已存在，跳过重复文件",

  // Error messages
  "error.compressionFailed": "压缩失败",
  "error.unsupportedFormat": "不支持的图片格式",

  // About page
  "about.title": "关于 Slimage",
  "about.intro": "Slimage 是一款纯浏览器端的在线图片智能压缩工具，致力于为用户提供安全、高效、高质量的图片压缩体验。",
  "about.mission": "我们的使命",
  "about.missionText": "在当今数字化时代，图片已成为信息传播的核心载体。然而，大尺寸图片严重影响网页加载速度和用户体验。Slimage 的使命是让每个人都能轻松压缩图片，无需安装任何软件，无需担心隐私泄露——一切都在浏览器中完成。",
  "about.tech": "技术架构",
  "about.techText": "Slimage 采用前沿的 WebAssembly 技术，将业界顶级的图片编码器（MozJPEG、libwebp、pngquant、libavif）编译为 WASM 模块，直接在浏览器中运行。这意味着您获得的压缩质量与专业桌面软件完全一致，同时享有零上传、零隐私风险的绝对安全。",
  "about.feature1.label": "WASM 编码器",
  "about.feature1.sub": "MozJPEG / libwebp / pngquant / libavif",
  "about.feature2.label": "零隐私风险",
  "about.feature2.sub": "图片不离开浏览器",
  "about.feature3.label": "8 种语言",
  "about.feature3.sub": "中文 / English / 日本語 / 한국어 等",
  "about.feature4.label": "开源技术栈",
  "about.feature4.sub": "React / Vite / Tailwind / WASM",
  "about.back": "返回首页",

  // Privacy page
  "privacy.title": "隐私政策",
  "privacy.p1": "最后更新日期：2026 年 7 月 1 日",
  "privacy.p2": "Slimage 是一款纯前端应用。所有图片处理均在您的浏览器本地完成，图片文件绝不上传至任何服务器。我们不会收集、存储或传输您的任何图片数据。",
  "privacy.p3": "我们使用 localStorage 仅用于存储您的界面偏好（语言选择和暗色模式设置）。这些数据完全保存在您的设备上，不会发送到任何服务器。",
  "privacy.p4": "Slimage 不使用 Cookie、不嵌入第三方跟踪脚本、不收集任何分析数据。我们没有服务器端数据库，因此不存在数据泄露的可能。",
  "privacy.p5": "本网站可能使用 CDN 服务来加速静态资源（HTML、CSS、JavaScript、WASM 模块）的加载。CDN 节点仅缓存公开的静态文件，不涉及任何用户数据。",
  "privacy.p6": "如果您对本隐私政策有任何疑问，请通过「联系我们」页面与我们联系。",
  "privacy.back": "返回首页",

  // Contact page
  "contact.title": "联系我们",
  "contact.intro": "如果您有任何问题、建议或合作意向，欢迎通过以下方式与我们联系。我们会在 1-2 个工作日内回复。",
  "contact.email": "电子邮箱",
  "contact.response": "我们通常会在 1-2 个工作日内回复您的消息。",
  "contact.back": "返回首页",

  // Blog page
  "blog.title": "经验分享",
  "blog.intro": "以下是我们总结的一些图片压缩技巧和最佳实践，希望对您有所帮助。",
  "blog.tip1.title": "选择合适的输出格式",
  "blog.tip1.body": "照片类图片建议输出为 JPEG 或 WebP，图标和截图类建议使用 PNG。如果需要最佳压缩率，可以尝试 AVIF 格式（注意旧浏览器兼容性）。WebP 在大多数场景下是文件大小和兼容性的最佳平衡点。",
  "blog.tip2.title": "合理调整压缩质量",
  "blog.tip2.body": "一般来说，70-85 的质量值可以在文件大小和画质之间取得最佳平衡。对于网页展示用途的图片，60-70 通常就足够了，人眼几乎无法分辨差异。而需要打印或高清展示的图片，建议使用 85-95。",
  "blog.tip3.title": "批量处理提高效率",
  "blog.tip3.body": "Slimage 支持一次处理最多 20 张图片。处理完成后可以一键打包下载 ZIP 文件。建议将同类型的图片（如产品图、文章配图）放在同一批次处理，这样可以统一设置压缩参数，大大提高工作效率。",
  "blog.tip4.title": "先缩放再压缩",
  "blog.tip4.body": "如果原始图片分辨率远大于实际使用场景（例如用 4000px 宽的照片做网页头图），建议先用其他工具将图片缩放到目标尺寸，再用 Slimage 压缩。这样能获得更小的文件体积。Slimage 会自动将超大图片缩放到合理尺寸，但预先缩放效果更好。",
  "blog.addBtn": "新增文章",
  "blog.editBtn": "编辑",
  "blog.deleteBtn": "删除",
  "blog.empty": "还没有任何文章",
  "blog.emptyHint": "点击右上角「新增文章」开始记录你的经验",
  "blog.modal.addTitle": "新增经验文章",
  "blog.modal.editTitle": "编辑文章",
  "blog.modal.titleLabel": "标题",
  "blog.modal.titlePlaceholder": "给文章起个标题…",
  "blog.modal.bodyLabel": "正文",
  "blog.modal.bodyPlaceholder": "写下你的经验和技巧…",
  "blog.modal.iconLabel": "图标",
  "blog.modal.save": "保存",
  "blog.modal.cancel": "取消",
  "blog.modal.required": "标题和正文不能为空",
  "blog.confirmDelete": "确定删除这篇文章吗？",
  "blog.confirmDeleteOk": "删除",
  "blog.confirmDeleteCancel": "再想想",
  "blog.icon.image": "图像",
  "blog.icon.sliders": "滑块",
  "blog.icon.stack": "批量",
  "blog.icon.expand": "缩放",
  "blog.icon.lightbulb": "灵感",
  "blog.back": "返回首页",

  // Blog admin auth
  "blog.admin.banner": "如需发布经验文章，请联系管理员获取密码后点击登录。",
  "blog.admin.loginBtn": "管理员登录",
  "blog.admin.logoutBtn": "退出管理",
  "blog.admin.welcome": "管理员已登录",
  "blog.admin.loginTitle": "管理员登录",
  "blog.admin.passwordLabel": "管理员密码",
  "blog.admin.passwordPlaceholder": "请输入管理员密码",
  "blog.admin.loginError": "密码错误，请重试",
  "blog.admin.submit": "登录",
  "blog.admin.cancel": "取消",
  "blog.admin.lockIcon": "管理员锁",
  "blog.admin.sessionHint": "登录状态 24 小时内有效",
};

export default zhCN;
