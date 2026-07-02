# Vercel 部署指南

## 🚀 一键部署（推荐：GitHub 集成）

只需 3 步，**5 分钟**上线：

### Step 1：把代码推到 GitHub
```bash
cd C:\Users\Administrator\WorkBuddy\2026-07-01-20-28-30\slimage
git init
git add .
git commit -m "feat: Slimage - WASM 图片压缩工具"
# 在 GitHub 创建新仓库（不要选 README/.gitignore），然后：
git remote add origin https://github.com/<你的用户名>/slimage.git
git branch -M main
git push -u origin main
```

### Step 2：用 Vercel 导入 GitHub 仓库
- 打开 https://vercel.com/new
- 用 GitHub 账号登录
- 点击 **"Import"** 选择 `slimage` 仓库
- 框架预设：**Vite**（自动识别）
- 根目录：留空
- 构建命令：`npm run build`
- 输出目录：`dist`
- 点击 **"Deploy"**

### Step 3：等待 1-2 分钟，得到 URL
形如：`https://slimage-xxx.vercel.app`

✅ 之后每次 `git push` 都会自动部署。

## 🖥️ 命令行部署（无需 GitHub）

```bash
# 1. 全局安装 Vercel CLI
npm i -g vercel

# 2. 登录（会打开浏览器）
cd C:\Users\Administrator\WorkBuddy\2026-07-01-20-28-30\slimage
vercel login

# 3. 部署到生产环境
vercel --prod
```

## 🌐 绑定自定义顶级域名

1. 购买域名（Namecheap/Cloudflare/阿里云/腾讯云，.com 约 ¥70/年）
2. Vercel → Project → Settings → Domains → 输入 `yourdomain.com`
3. 在域名注册商添加 Vercel 给出的 DNS 记录：
   ```
   类型    主机    值
   A       @       76.76.21.21
   CNAME   www     cname.vercel-dns.com
   ```
4. 等待 5-30 分钟 DNS 生效
5. ✅ Vercel 自动签发 Let's Encrypt 免费 SSL 证书
6. ✅ 自动重定向 `yourdomain.com` → `www.yourdomain.com`

## ⚙️ 已为你准备好的文件

- ✅ `vercel.json` - SPA 路由重写规则
- ✅ `package.json` - Vite 自动识别
- ✅ `tsconfig.json` - 零配置
- ✅ `dist/` - 构建产物（5.83s 即可重新生成）

## 📊 Vercel 免费额度

- ✅ 100 GB 带宽/月
- ✅ 无限部署次数
- ✅ 全球 CDN（边缘节点 70+）
- ✅ 自动 HTTPS
- ✅ 自定义域名无限绑定

按你目前 4-5 MB 的产物大小，约 20,000 PV/月 完全够用。
