# TrendingAI 网站重写计划

## Context

现有 trendingai-website 仅有 GitHub Trending Board + App 两个页面，纯手写 CSS，双语。后端已完成多源数据（GitHub / HN / PH）和每日精选（Picks），需要网站跟进。借此机会完全重写，重新设计首页为 Dashboard 总览模式。

**决策：**
- 纯 Astro + Vanilla JS（无 React/Vue）
- 完全重写
- 仅中文
- 主题跟随系统 + 手动切换
- 首页为 Dashboard 总览（Picks 置顶 + 三源预览）
- 网页端不做历史回溯（留给 App）

## 技术栈

- Astro（最新版）+ Tailwind CSS 4（`@tailwindcss/vite`）
- Vanilla TypeScript 处理交互
- Cloudflare Pages 部署

## 页面结构（3 页）

| 页面 | 路由 | 定位 |
|------|------|------|
| 首页 | `/` | Dashboard 总览：今日精选 + 三源热门预览 |
| Feed | `/feed/` | 多源完整列表，Tab 筛选 + 加载更多 |
| App | `/app/` | App 下载展示（纯静态） |

## 首页布局设计

```
┌──────────────────────────────────────────────┐
│  TopNav:  Logo  [首页]  [Feed]  [App]    ☀/🌙│
├──────────────────────────────────────────────┤
│                                              │
│  今日精选                         2026-03-12 │
│  ────────────────────────────────────────    │
│                                              │
│  ┌─ 深度解读 ──────────────────────────────┐ │
│  │ [大卡片]    [大卡片]    [大卡片]         │ │
│  │ 标题+摘要+AI分析摘要                    │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  ┌─ 争议话题 ────────┐ ┌─ Top 10 速览 ───────┐ │
│  │ [卡片]            │ │ [紧凑列表项]     │ │
│  │ [卡片]            │ │ [紧凑列表项]     │ │
│  │                   │ │ [紧凑列表项]     │ │
│  └───────────────────┘ └─────────────────-┘ │
│                                              │
│  ────────────────────────────────────────    │
│  GitHub 热门                    查看全部 →   │
│  ┌────────┐ ┌────────┐ ┌────────┐  ← 横滑   │
│  └────────┘ └────────┘ └────────┘            │
│                                              │
│  Hacker News 热议               查看全部 →   │
│  ┌────────┐ ┌────────┐ ┌────────┐  ← 横滑   │
│  └────────┘ └────────┘ └────────┘            │
│                                              │
│  Product Hunt 新品              查看全部 →   │
│  ┌────────┐ ┌────────┐ ┌────────┐  ← 横滑   │
│  └────────┘ └────────┘ └────────┘            │
│                                              │
│  Footer                                      │
└──────────────────────────────────────────────┘
```

**首页数据源：**
- 精选区：`GET /api/picks?summary_lang=zh`（不传 date，后端默认当日）
- 三源预览：`GET /api/feed?source=github&limit=10`，`source=hackernews`，`source=producthunt`
- 共 4 个 API 请求，可并发

**首页设计要点：**
- 深度解读卡片较大，突出 AI 分析内容
- 争议话题 + Top 10 速览双栏紧凑排列
- 三源区各展示 5~8 条，横向滑动，"查看全部" 跳转 Feed 页对应 Tab
- 移动端全部单栏堆叠，横滑保持

## Feed 页布局

```
TopNav
  Tab 栏: 全部 | GitHub | Hacker News | Product Hunt
  ┌─────────────────────────┐
  │ [FeedCard]              │  ← 单栏，max-w-3xl 居中
  │ [FeedCard]              │
  │ [FeedCard]              │
  │ ...                     │
  │ [加载更多]              │
  └─────────────────────────┘
Footer
```

- Tab 切换 source 筛选，重置列表
- 首次取 `days=7&limit=50`，客户端分批展示（每批 15 条）
- GitHub Tab 可加 since 切换（日榜/周榜/月榜），仅展示最新数据
- FeedCard：source 标签 + 标题 + 描述 + AI 摘要 + tags + 分数

## 目录结构

```
src/
  styles/global.css              # Tailwind 4 @import + M3 @theme
  config.ts                      # API_BASE 等常量
  types/api.ts                   # API 响应类型
  layouts/
    BaseLayout.astro             # HTML shell, head, 主题初始化
  components/
    TopNav.astro                 # Logo + Tab 导航 + 主题切换
    ThemeToggle.astro            # 系统跟随 + 手动切换
    Footer.astro
    SourceSection.astro          # 首页三源横滑区块模板
    LoadMore.astro               # 加载更多按钮
    AppHero.astro                # App 下载 Hero
  pages/
    index.astro                  # Dashboard 首页
    feed/index.astro             # Feed 聚合流
    app/index.astro              # App 下载页
  scripts/
    lib/
      api.ts                     # fetch 封装 + 并发请求 + 缓存
      dom.ts                     # escapeHtml, skeleton, 状态管理
      format.ts                  # 数字/日期格式化
    home.ts                      # 首页交互（加载 Picks + 三源数据）
    feed.ts                      # Feed 页交互（Tab + Load More）
public/
  favicon-32.png, apple-touch-icon.png, robots.txt, _redirects
```

## Tailwind 主题

冷灰黑白基调，使用 Tailwind `gray` 色阶，数据源品牌色做点缀。

`src/styles/global.css`：

```css
@import "tailwindcss";

@theme {
  --color-primary: #111827;           /* gray-900 */
  --color-on-primary: #f9fafb;        /* gray-50 */
  --color-surface: #ffffff;
  --color-surface-container: #f3f4f6; /* gray-100 */
  --color-on-surface: #111827;        /* gray-900 */
  --color-on-surface-variant: #6b7280;/* gray-500 */
  --color-outline: #e5e7eb;           /* gray-200 */
}

[data-theme="dark"] {
  --color-primary: #f9fafb;           /* gray-50 */
  --color-on-primary: #030712;        /* gray-950 */
  --color-surface: #030712;           /* gray-950 */
  --color-surface-container: #111827; /* gray-900 */
  --color-on-surface: #e5e7eb;        /* gray-200 */
  --color-on-surface-variant: #9ca3af;/* gray-400 */
  --color-outline: #1f2937;           /* gray-800 */
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* 同 dark 值 */ }
}
```

数据源品牌色（固定，不随主题变化）：
- GitHub: `#171717` / 暗色 `#e5e7eb`
- Hacker News: `#ff6600`
- Product Hunt: `#da552f`

## 客户端交互模式

统一模式：
1. Astro 渲染静态 shell + 骨架屏占位
2. `<script>` 引入对应 TS 模块
3. 模块内：plain object 状态 + fetch + DOM 渲染 + 事件委托
4. 首页 4 个 API 并发请求，各区块独立加载

## 旧 URL 重定向（`public/_redirects`）

```
/zh/       /       301
/zh/app/   /app/   301
/en/*      /       301
```

## 实施阶段

| 阶段 | 内容 |
|------|------|
| P1 | 项目脚手架 + Tailwind 主题 + BaseLayout + TopNav + ThemeToggle + Footer + App 页 |
| P2 | 首页 Dashboard：Picks 精选区（深度解读 + 争议 + Top 10 速览） |
| P3 | 首页 Dashboard：三源横滑预览区 |
| P4 | Feed 页：Tab 筛选 + FeedCard + 加载更多 |
| P5 | 打磨：响应式、骨架屏、过渡动画、SEO meta |
| P6 | 部署 + 重定向验证 |

## 验证

1. `pnpm dev` 本地逐页验证
   - 首页：Picks 三分类渲染 + 三源横滑 + 查看全部跳转
   - Feed：Tab 切换 + 加载更多 + GitHub since 切换
   - App：静态内容 + 下载链接
2. 主题：亮色 / 暗色 / 跟随系统
3. 响应式：375px / 768px / 1024px
4. `pnpm build && pnpm preview` 无报错
5. 部署后旧 URL 301 验证

## 参考网站

- [daily.dev](https://daily.dev) — 整体布局和暗色主题
- [Trendshift](https://trendshift.io) — GitHub 项目卡片设计
- [Product Hunt](https://www.producthunt.com) — Picks 分类展示
- [Best of JS](https://bestofjs.org) — 趋势数据展示
- [hckrnews](https://www.hckrnews.com) — HN 美化版排版
