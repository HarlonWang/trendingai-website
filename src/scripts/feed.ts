import { fetchFeed } from "./lib/api";
import type { FeedApiItem } from "./lib/api";
import { escapeHtml, $ } from "./lib/dom";

const SOURCES = ["github", "hackernews", "producthunt"] as const;
const BATCH_SIZE = 15;

let allItems: FeedApiItem[] = [];
let filteredItems: FeedApiItem[] = [];
let displayCount = 0;
let currentTab = "all";

function formatNumber(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
}

function sourceColor(source: string): string {
    switch (source) {
        case "github": return "bg-[#171717] text-white";
        case "hackernews": return "bg-[#ff6600] text-white";
        case "producthunt": return "bg-[#da552f] text-white";
        default: return "bg-gray-500 text-white";
    }
}

function sourceLabel(source: string): string {
    switch (source) {
        case "github": return "GitHub";
        case "hackernews": return "Hacker News";
        case "producthunt": return "Product Hunt";
        default: return source;
    }
}

function sourceScoreHtml(item: FeedApiItem): string {
    switch (item.source) {
        case "github": {
            const stars = item.extra?.stars as number | undefined;
            return stars != null ? `&#9733; ${formatNumber(stars)}` : "";
        }
        case "hackernews": return `&#9650; ${item.score}`;
        case "producthunt": return `&#9650; ${item.score}`;
        default: return `${item.score}`;
    }
}

function renderFeedCard(item: FeedApiItem): string {
    const lang = item.source === "github" ? item.extra?.language as string | undefined : undefined;
    const langColor = item.source === "github" ? item.extra?.language_color as string | undefined : undefined;
    const periodStars = item.source === "github" ? item.extra?.period_stars as number | undefined : undefined;

    return `
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
           class="group block rounded-xl border border-outline p-4 transition-colors hover:border-on-surface-variant">
            <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${sourceColor(item.source)}">${sourceLabel(item.source)}</span>
                    ${item.tags.length > 0 ? `<span class="text-xs text-on-surface-variant">${escapeHtml(item.tags[0])}</span>` : ""}
                </div>
                <span class="text-xs text-on-surface-variant">${sourceScoreHtml(item)}</span>
            </div>
            <h3 class="text-sm font-bold text-on-surface group-hover:text-primary leading-snug">
                ${escapeHtml(item.title)}
            </h3>
            ${item.summary ? `<p class="mt-1.5 text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : ""}
            ${item.source === "github" ? `
                <div class="mt-2 flex items-center gap-3 text-xs text-on-surface-variant">
                    ${lang ? `<span class="flex items-center gap-1"><span class="inline-block h-2.5 w-2.5 rounded-full" style="background-color:${langColor || '#888'}"></span>${escapeHtml(lang)}</span>` : ""}
                    ${periodStars != null ? `<span class="text-[#e8b931]">+${formatNumber(periodStars)}</span>` : ""}
                </div>
            ` : ""}
            ${item.source === "hackernews" ? `
                <div class="mt-2 flex items-center gap-3 text-xs text-on-surface-variant">
                    <span>&#128172; ${item.commentCount}</span>
                    ${item.author ? `<span>${escapeHtml(item.author)}</span>` : ""}
                </div>
            ` : ""}
        </a>
    `;
}

function interleave(github: FeedApiItem[], hn: FeedApiItem[], ph: FeedApiItem[]): FeedApiItem[] {
    const result: FeedApiItem[] = [];
    const maxLen = Math.max(github.length, hn.length, ph.length);
    for (let i = 0; i < maxLen; i++) {
        if (i < github.length) result.push(github[i]);
        if (i < hn.length) result.push(hn[i]);
        if (i < ph.length) result.push(ph[i]);
    }
    return result;
}

function filterItems(): FeedApiItem[] {
    if (currentTab === "all") return allItems;
    return allItems.filter(item => item.source === currentTab);
}

function render() {
    const list = $("#feed-list");
    const btn = $("#load-more");
    if (!list) return;

    const items = filteredItems.slice(0, displayCount);
    if (items.length === 0) {
        list.innerHTML = `<p class="text-sm text-on-surface-variant">暂无数据</p>`;
    } else {
        list.innerHTML = items.map(renderFeedCard).join("");
    }

    if (btn) {
        const remaining = filteredItems.length - displayCount;
        if (remaining > 0) {
            btn.style.display = "";
            btn.textContent = `加载更多（剩余 ${remaining} 条）`;
        } else {
            btn.style.display = "none";
        }
    }
}

function switchTab(tab: string) {
    currentTab = tab;
    filteredItems = filterItems();
    displayCount = BATCH_SIZE;

    // Update tab styles
    document.querySelectorAll(".feed-tab").forEach(el => {
        const t = el.getAttribute("data-tab");
        if (t === tab) {
            el.className = "feed-tab rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-primary text-on-primary";
        } else {
            el.className = "feed-tab rounded-lg px-3 py-1.5 text-sm font-medium transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface";
        }
    });

    render();
}

async function loadFeed() {
    const list = $("#feed-list");
    if (!list) return;

    try {
        const [github, hn, ph] = await Promise.all(
            SOURCES.map(source => fetchFeed(source, 20, 3))
        );

        allItems = interleave(github.data, hn.data, ph.data);
        filteredItems = filterItems();
        displayCount = BATCH_SIZE;
        render();
    } catch (err) {
        console.error("Failed to load feed:", err);
        list.innerHTML = `<p class="text-sm text-on-surface-variant">加载失败，请稍后刷新重试</p>`;
    }
}

document.addEventListener("astro:page-load", () => {
    if (!$("#feed-list")) return;

    // Tab click
    document.querySelectorAll(".feed-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            const t = tab.getAttribute("data-tab");
            if (t) switchTab(t);
        });
    });

    // Load more
    const btn = $("#load-more");
    if (btn) {
        btn.addEventListener("click", () => {
            displayCount += BATCH_SIZE;
            render();
        });
    }

    loadFeed();
});
