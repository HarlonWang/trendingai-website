# 全局用户反馈功能 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在网页端所有页面添加固定右下角的浮动反馈按钮，用户可提交反馈内容和联系邮箱，数据存入 D1。

**Architecture:** 后端在 github-ai-trending-api 新增 D1 migration + API 路由；前端在 trendingai-website 新建 Feedback.astro 组件嵌入 BaseLayout 全局生效。两个仓库各自独立提交。

**Tech Stack:** Cloudflare Worker + D1, Astro + Tailwind CSS 4, Vanilla JS

**Spec:** `docs/superpowers/specs/2026-03-15-global-feedback-design.md`

---

## Chunk 1: 后端（github-ai-trending-api）

### Task 1: D1 Migration

**Files:**
- Create: `migrations/006_add_feedback.sql` (in github-ai-trending-api)

- [ ] **Step 1: Create migration file**

```sql
-- migrations/006_add_feedback.sql
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  email TEXT,
  page_url TEXT,
  user_agent TEXT,
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

- [ ] **Step 2: Apply migration to remote D1**

Run:
```bash
cd /Users/wanghl/TrendingProjects/github-ai-trending-api && npx wrangler d1 migrations apply trending --remote
```
Expected: Migration 006 applied successfully.

- [ ] **Step 3: Commit**

```bash
git -C /Users/wanghl/TrendingProjects/github-ai-trending-api add migrations/006_add_feedback.sql
git -C /Users/wanghl/TrendingProjects/github-ai-trending-api commit -m "feat: add feedback table migration"
```

### Task 2: Feedback API Route

**Files:**
- Create: `src/api/feedback.js` (in github-ai-trending-api)
- Modify: `src/index.js:1,28` (in github-ai-trending-api)

**Reference:** `src/api/subscribe.js` for handler pattern, `src/lib/http.js` for `handlePreflight`/`jsonOk`/`jsonError`.

- [ ] **Step 1: Create `src/api/feedback.js`**

```js
import { handlePreflight, jsonOk, jsonError } from '../lib/http.js';

const MAX_CONTENT_LENGTH = 2000;
const RATE_LIMIT = 5;          // max submissions
const RATE_WINDOW_HOURS = 1;   // per hour

export async function handleFeedback(request, env) {
    if (request.method === 'OPTIONS') return handlePreflight();
    if (request.method !== 'POST') return jsonError('Method not allowed', 405);

    // Parse body
    let body;
    try {
        body = await request.json();
    } catch {
        return jsonError('Invalid JSON', 400);
    }

    // Validate content
    const content = (body.content || '').trim();
    if (!content) return jsonError('Content is required', 400);
    if (content.length > MAX_CONTENT_LENGTH) {
        return jsonError(`Content exceeds ${MAX_CONTENT_LENGTH} characters`, 400);
    }

    // Validate email (optional)
    const email = (body.email || '').trim() || null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return jsonError('Invalid email format', 400);
    }

    // Rate limiting by IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { count } = await env.DB.prepare(
        `SELECT COUNT(*) as count FROM feedback
         WHERE ip = ? AND created_at > datetime('now', '-${RATE_WINDOW_HOURS} hours')`
    ).bind(ip).first();

    if (count >= RATE_LIMIT) {
        return jsonError('Too many submissions, please try later', 429);
    }

    // Insert
    const pageUrl = (body.page_url || '').trim() || null;
    const userAgent = request.headers.get('User-Agent') || null;

    await env.DB.prepare(
        'INSERT INTO feedback (content, email, page_url, user_agent, ip) VALUES (?, ?, ?, ?, ?)'
    ).bind(content, email, pageUrl, userAgent, ip).run();

    return jsonOk({ success: true }, 0);
}
```

- [ ] **Step 2: Register route in `src/index.js`**

Add import at top (after existing imports):
```js
import { handleFeedback } from './api/feedback.js';
```

Add route (after the subscribe line, before the health line):
```js
if (pathname === '/api/feedback') return handleFeedback(request, env);
```

- [ ] **Step 3: Deploy and test**

Run:
```bash
cd /Users/wanghl/TrendingProjects/github-ai-trending-api && npx wrangler deploy
```

Verify with curl:
```bash
# Should succeed
curl --noproxy localhost -X POST https://api.trendingai.cn/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"content":"Test feedback","page_url":"https://trendingai.cn/"}'

# Should fail — empty content
curl --noproxy localhost -X POST https://api.trendingai.cn/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"content":""}'

# Verify data in D1
cd /Users/wanghl/TrendingProjects/github-ai-trending-api && npx wrangler d1 execute trending --remote --command "SELECT * FROM feedback ORDER BY id DESC LIMIT 5"
```

- [ ] **Step 4: Commit**

```bash
git -C /Users/wanghl/TrendingProjects/github-ai-trending-api add src/api/feedback.js src/index.js
git -C /Users/wanghl/TrendingProjects/github-ai-trending-api commit -m "feat: add POST /api/feedback route with rate limiting"
```

---

## Chunk 2: 前端（trendingai-website）

### Task 3: Feedback Component

**Files:**
- Create: `src/components/Feedback.astro` (in trendingai-website)
- Modify: `src/layouts/BaseLayout.astro:1,57` (in trendingai-website)

**Reference:** `src/components/Subscribe.astro` for inline script pattern and `API_BASE` usage.

- [ ] **Step 1: Create `src/components/Feedback.astro`**

```astro
---
import { API_BASE } from "../config";
---

<!-- Floating feedback button + popup -->
<div id="feedback-widget" class="fixed bottom-6 right-6 z-[90]">
    <!-- Popup form -->
    <div
        id="feedback-popup"
        class="absolute bottom-14 right-0 w-80 rounded-xl border border-outline bg-surface-container p-4 shadow-lg"
        style="opacity:0; transform:translateY(8px); pointer-events:none; transition: opacity 200ms ease, transform 200ms ease;"
    >
        <form id="feedback-form" class="space-y-3">
            <textarea
                id="feedback-content"
                required
                maxlength="2000"
                rows="4"
                placeholder="有什么建议或问题？"
                class="w-full resize-none rounded-lg border border-outline bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
            ></textarea>
            <input
                id="feedback-email"
                type="email"
                placeholder="邮箱（选填，方便回复）"
                class="w-full rounded-lg border border-outline bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
            />
            <button
                type="submit"
                id="feedback-submit"
                class="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:opacity-90"
            >
                提交反馈
            </button>
        </form>
        <p id="feedback-msg" class="mt-2 hidden text-center text-sm"></p>
    </div>

    <!-- Toggle button -->
    <button
        id="feedback-toggle"
        aria-label="提交反馈"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-105"
    >
        <!-- Chat bubble icon -->
        <svg id="feedback-icon-open" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <!-- Close icon (hidden by default) -->
        <svg id="feedback-icon-close" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    </button>
</div>

<script is:inline define:vars={{ API_BASE }}>
    document.addEventListener("astro:page-load", function () {
        var toggle = document.getElementById("feedback-toggle");
        var popup = document.getElementById("feedback-popup");
        var form = document.getElementById("feedback-form");
        var content = document.getElementById("feedback-content");
        var email = document.getElementById("feedback-email");
        var submitBtn = document.getElementById("feedback-submit");
        var msg = document.getElementById("feedback-msg");
        var iconOpen = document.getElementById("feedback-icon-open");
        var iconClose = document.getElementById("feedback-icon-close");
        if (!toggle || !popup || !form) return;

        var isOpen = false;

        function setOpen(open) {
            isOpen = open;
            popup.style.opacity = open ? "1" : "0";
            popup.style.transform = open ? "translateY(0)" : "translateY(8px)";
            popup.style.pointerEvents = open ? "auto" : "none";
            iconOpen.classList.toggle("hidden", open);
            iconClose.classList.toggle("hidden", !open);
        }

        function resetForm() {
            form.reset();
            msg.className = "mt-2 hidden text-center text-sm";
            msg.textContent = "";
            form.style.display = "";
            submitBtn.disabled = false;
            submitBtn.textContent = "提交反馈";
        }

        toggle.addEventListener("click", function (e) {
            e.stopPropagation();
            setOpen(!isOpen);
            if (!isOpen) resetForm();
        });

        // Click outside to close
        document.addEventListener("click", function (e) {
            if (isOpen && !popup.contains(e.target) && !toggle.contains(e.target)) {
                setOpen(false);
                resetForm();
            }
        });

        // Escape to close
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && isOpen) {
                setOpen(false);
                resetForm();
            }
        });

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            var text = content.value.trim();
            if (!text) return;

            submitBtn.disabled = true;
            submitBtn.textContent = "提交中...";

            try {
                var resp = await fetch(API_BASE + "/api/feedback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: text,
                        email: email.value.trim() || undefined,
                        page_url: window.location.href,
                    }),
                });
                var data = await resp.json();

                if (data.success) {
                    form.style.display = "none";
                    msg.textContent = "感谢反馈！";
                    msg.className = "mt-2 text-center text-sm text-green-600";
                    setTimeout(function () {
                        setOpen(false);
                        resetForm();
                    }, 1500);
                } else {
                    msg.textContent = data.error || "提交失败，请稍后重试";
                    msg.className = "mt-2 text-center text-sm text-red-500";
                    submitBtn.disabled = false;
                    submitBtn.textContent = "提交反馈";
                }
            } catch (_) {
                msg.textContent = "网络错误，请稍后重试";
                msg.className = "mt-2 text-center text-sm text-red-500";
                submitBtn.disabled = false;
                submitBtn.textContent = "提交反馈";
            }
        });
    });
</script>
```

- [ ] **Step 2: Add Feedback to BaseLayout**

In `src/layouts/BaseLayout.astro`, add the import in the frontmatter:
```astro
import Feedback from "../components/Feedback.astro";
```

Replace `<slot />` with:
```astro
        <slot />
        <Feedback />
```

- [ ] **Step 3: Local dev test**

Run:
```bash
cd /Users/wanghl/TrendingProjects/trendingai-website && npm run dev
```

Open browser, verify on all 3 pages (/, /feed/, /app/):
1. Floating button visible at bottom-right
2. Click opens popup with form
3. Click outside / Escape closes popup
4. Submit with content → "感谢反馈！" → auto close
5. Submit with empty content → browser validation blocks
6. Dark mode: colors adapt correctly

- [ ] **Step 4: Commit**

```bash
git -C /Users/wanghl/TrendingProjects/trendingai-website add src/components/Feedback.astro src/layouts/BaseLayout.astro
git -C /Users/wanghl/TrendingProjects/trendingai-website commit -m "feat: add global feedback widget"
```

---

## Chunk 3: 部署验证

### Task 4: End-to-End Verification

- [ ] **Step 1: Push both repos**

```bash
git -C /Users/wanghl/TrendingProjects/github-ai-trending-api push
git -C /Users/wanghl/TrendingProjects/trendingai-website push
```

- [ ] **Step 2: Wait for Cloudflare Pages deploy, then verify on production**

Open `https://trendingai.cn`, submit a test feedback, then check D1:

```bash
cd /Users/wanghl/TrendingProjects/github-ai-trending-api && npx wrangler d1 execute trending --remote --command "SELECT * FROM feedback ORDER BY id DESC LIMIT 5"
```

- [ ] **Step 3: Clean up test data**

```bash
cd /Users/wanghl/TrendingProjects/github-ai-trending-api && npx wrangler d1 execute trending --remote --command "DELETE FROM feedback WHERE content = 'Test feedback'"
```
