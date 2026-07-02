# Slimage 部署指南

## 当前状态
- 项目位置：`C:\Users\Administrator\WorkBuddy\2026-07-01-20-28-30\slimage\`
- 技术栈：React 18 + TypeScript + Vite 5 + Tailwind CSS 3（纯前端 WASM，无后端）
- 产物目录：`slimage/dist/`（执行 `npm run build` 后生成，约 4-5 MB 含 WASM 解码器）

## 部署方式

### 方式 1：WorkBuddy CloudStudio（已用，最快）
- 工具：`workbuddy_cloudstudio_deploy`
- 优点：一键上传，秒级返回分享链接
- 缺点：链接有时效性，适合演示
- 当前链接：https://684e3524f8e14296badffb14564b5632.app.codebuddy.work

### 方式 2：Vercel（推荐正式发布）
- 命令：
  ```bash
  npm i -g vercel
  cd slimage
  vercel --prod
  ```
- 优点：全球 CDN、自动 HTTPS、自定义域名免费、自动部署 Git 推送
- 配置：无需特殊配置，Vite 自动识别。`vercel.json` 可选：
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

### 方式 3：Netlify
- 命令：
  ```bash
  npm i -g netlify-cli
  cd slimage
  netlify deploy --dir=dist --prod
  ```
- 或拖拽 `dist/` 整个目录到 https://app.netlify.com/drop
- 优点：拖拽即部署，零配置
- 必加 `dist/_redirects` 文件：
  ```
  /*    /index.html   200
  ```

### 方式 4：GitHub Pages
- 1. 推到 GitHub 仓库
- 2. `vite.config.ts` 设置 `base: "/<repo-name>/"`
- 3. 安装：`npm i -D gh-pages`
- 4. `package.json` 加脚本：
  ```json
  "deploy": "gh-pages -d dist"
  ```
- 5. `npm run build && npm run deploy`
- 缺点：访问路径带 `/<repo-name>/` 前缀，刷新 404 需用 SPA 模式

### 方式 5：自建 Nginx 服务器
- 1. `npm run build` 生成 `dist/`
- 2. 上传 `dist/` 到服务器 `/var/www/slimage/`
- 3. Nginx 配置：
  ```nginx
  server {
    listen 80;
    server_name slimage.yourdomain.com;
    root /var/www/slimage;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
    location ~* \.(wasm)$ { add_header Cache-Control "public, max-age=31536000"; }
  }
  ```
- 优点：完全可控、可绑定自有域名

## 注意事项
- 由于使用 WASM 解码器（@jsquash），首次访问需下载 ~3MB 的 .wasm 文件，建议开启 gzip/brotli 压缩
- COOP/COEP 头对 SharedArrayBuffer 有影响，Vercel/Netlify 默认配置无此头
- 跨域：CORS 已无依赖（全部本地处理），无后端跨域问题
- 暗色模式闪烁：已用同步内联脚本处理
