# Trending AI Website

Trending AI 官网，支持中文与英文双语，风格与 Material 3 主题色对齐。

## 本地开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## Cloudflare Pages 部署

1. 将本仓库推送到 GitHub。
2. 在 Cloudflare Pages 中连接该仓库。
3. 构建命令填写 `pnpm build`。
4. 输出目录填写 `dist`。
5. 在 Pages 项目中添加域名 `trendingai.cn` 与 `www.trendingai.cn`。
6. 设置 `www` 到主域名的 301 跳转。

## APK 数据来源

- 运行时接口：`/api/latest-apk`
- 实现位置：`functions/api/latest-apk.js`
- 数据来源：GitHub 最新 Release API

可选环境变量：

- `GITHUB_TOKEN`：用于提升 GitHub API 访问配额。
