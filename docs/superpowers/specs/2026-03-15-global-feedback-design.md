# 全局用户反馈功能设计

## 概述

在网页端所有页面添加一个固定在右下角的浮动反馈按钮，点击弹出表单，用户可提交反馈内容和可选的联系邮箱。数据存入 D1 数据库，手动查询查看。

## 数据库

新增 `feedback` 表：

```sql
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  email TEXT,
  page_url TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL
);
```

通过 D1 migration 创建，手动查看数据：

```bash
npx wrangler d1 execute trending --remote --command "SELECT * FROM feedback ORDER BY created_at DESC LIMIT 20"
```

## 后端 API

`POST /api/feedback`

**请求体：**

```json
{ "content": "反馈内容", "email": "可选邮箱" }
```

**校验规则：**

- `content` 必填，trim 后非空，最大 2000 字符
- `email` 选填，填写时做基本格式校验

**写入字段：**

- `content`、`email` 来自请求体
- `page_url` 取自 `Referer` 请求头
- `user_agent` 取自 `User-Agent` 请求头
- `created_at` 为服务端 ISO 时间戳

**响应：**

- 成功：`{ "success": true }`
- 失败：`{ "success": false, "error": "错误描述" }`

**CORS：** 复用现有 Worker CORS 配置。

## 前端组件

新建 `src/components/Feedback.astro`，嵌入 `BaseLayout.astro`，全局生效。

### 浮动按钮

- 固定右下角 `fixed bottom-6 right-6`
- 圆形按钮，内含气泡 SVG 图标
- 点击切换弹窗，图标切换为 × 关闭
- `z-[90]` 确保在页面内容之上

### 弹窗表单

- 从按钮上方弹出，卡片样式：`bg-surface-container border-outline rounded-xl shadow`
- 宽度约 320px，定位在按钮左上方
- 内容：
  - textarea（必填，placeholder "有什么建议或问题？"）
  - email input（选填，placeholder "邮箱（选填，方便回复）"）
  - 提交按钮，样式复用 `bg-primary text-on-primary`
- 点击弹窗外部区域关闭

### 交互状态

- **提交中：** 按钮 disabled，文字变为 "提交中..."
- **成功：** 表单隐藏，显示 "感谢反馈！"，1.5s 后自动收起弹窗并重置表单
- **失败：** 表单内显示红色错误提示

### 动画

- 弹窗出现/消失用 opacity + translateY 过渡（与现有 toast 风格一致）

## 涉及文件

### 后端（github-ai-trending-api）

- 新增 D1 migration SQL 文件
- `src/` 中新增 `/api/feedback` 路由

### 前端（trendingai-website）

- 新建 `src/components/Feedback.astro`
- 修改 `src/layouts/BaseLayout.astro`（引入 Feedback 组件）
