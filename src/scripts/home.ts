import { fetchPicks, fetchFeed } from "./lib/api";
import type { FeedApiItem } from "./lib/api";
import { escapeHtml, $ } from "./lib/dom";
import type { PickItem } from "../types/api";

function sourceColor(source: string): string {
    switch (source) {
        case "github": return "bg-primary text-on-primary";
        case "hackernews": return "bg-[#ff6600] text-white";
        case "producthunt": return "bg-[#da552f] text-white";
        default: return "bg-gray-500 text-white";
    }
}

function sourceTag(item: PickItem): string {
    return `<span class="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${sourceColor(item.source)}">${escapeHtml(item.sourceLabel)}</span>`;
}

function formatNumber(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
}

function sourceScore(item: PickItem): string {
    switch (item.source) {
        case "github": return `&#9733; ${formatNumber(item.score)}`;
        case "hackernews": return `&#9650; ${item.score}`;
        case "producthunt": return `&#9650; ${item.score}`;
        default: return `${item.score}`;
    }
}

function renderDeepDive(items: PickItem[]): string {
    if (items.length === 0) return "";
    return `
        <div class="mb-8">
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-on-surface-variant">深度解读</h3>
            <div class="grid gap-4 ${items.length >= 3 ? "md:grid-cols-3" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1"}">
                ${items.map((item, i) => `
                    <div class="rounded-xl border border-outline bg-surface-container p-5 transition-colors hover:border-on-surface-variant">
                        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="group block">
                            <div class="mb-3">
                                ${sourceTag(item)}
                            </div>
                            ${item.analysis ? `
                                <h4 class="mb-2 text-base font-bold text-on-surface group-hover:text-primary leading-snug">
                                    ${escapeHtml(item.analysis.core)}
                                </h4>
                                ${item.analysis.why_important ? `<p class="text-sm text-on-surface-variant leading-relaxed ">${escapeHtml(item.analysis.why_important)}</p>` : ""}
                            ` : ""}
                        </a>
                        ${item.analysis?.action || item.analysis?.alternatives ? `
                            <div class="deep-dive-details mt-3 hidden border-t border-outline pt-3" data-deep-dive="${i}">
                                ${item.analysis.action ? `<div class="mb-3">
                                    <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">适合场景</p>
                                    <p class="text-sm text-on-surface-variant leading-relaxed">${escapeHtml(item.analysis.action)}</p>
                                </div>` : ""}
                                ${item.analysis.alternatives ? `<div>
                                    <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">类似产品</p>
                                    <p class="text-xs text-on-surface-variant/70 leading-relaxed">${escapeHtml(item.analysis.alternatives)}</p>
                                </div>` : ""}
                            </div>
                            <button class="deep-dive-toggle mt-3 text-xs font-medium text-primary hover:underline" data-target="${i}">展开更多</button>
                        ` : ""}
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function renderControversy(items: PickItem[]): string {
    if (items.length === 0) return "";
    return `
        <div class="mb-8">
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-on-surface-variant">争议话题</h3>
            <div class="grid gap-3 sm:grid-cols-2">
                ${items.map(item => {
                    const cv = item.analysis?.community_voice;
                    return `
                    <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
                       class="group rounded-xl border border-outline p-4 transition-colors hover:border-on-surface-variant">
                        <div class="mb-2 flex items-center gap-2">
                            ${sourceTag(item)}
                        </div>
                        <h4 class="text-sm font-bold text-on-surface group-hover:text-primary leading-snug line-clamp-1">
                            ${escapeHtml(item.title)}
                        </h4>
                        ${item.summary ? `<p class="mt-1.5 text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : ""}
                        ${cv?.positive ? `<div class="mt-2">
                            <span class="text-xs font-semibold text-on-surface">正方：</span>
                            <span class="text-xs text-on-surface-variant">${escapeHtml(cv.positive)}</span>
                        </div>` : ""}
                        ${cv?.negative ? `<div class="mt-1">
                            <span class="text-xs font-semibold text-on-surface">反方：</span>
                            <span class="text-xs text-on-surface-variant">${escapeHtml(cv.negative)}</span>
                        </div>` : ""}
                    </a>`;
                }).join("")}
            </div>
        </div>
    `;
}

function renderSpeedReadItem(item: PickItem): string {
    return `
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
           class="group block py-3 transition-colors">
            <div class="flex items-start gap-3">
                ${sourceTag(item)}
                <h4 class="min-w-0 flex-1 text-sm font-medium text-on-surface group-hover:text-primary leading-snug">
                    ${escapeHtml(item.title)}
                </h4>
                <span class="shrink-0 text-xs text-on-surface-variant">${sourceScore(item)}</span>
            </div>
            ${item.summary ? `<p class="mt-1 text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : ""}
        </a>
    `;
}

const SPEED_READ_INITIAL = 5;

function renderSpeedRead(items: PickItem[]): string {
    if (items.length === 0) return "";
    const visible = items.slice(0, SPEED_READ_INITIAL);
    const extra = items.slice(SPEED_READ_INITIAL);
    return `
        <div>
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Top 10 速览</h3>
            <div class="divide-y divide-outline">
                ${visible.map(item => renderSpeedReadItem(item)).join("")}
            </div>
            ${extra.length > 0 ? `
                <div class="divide-y divide-outline hidden" id="speed-read-extra">
                    ${extra.map(item => renderSpeedReadItem(item)).join("")}
                </div>
                <button id="speed-read-toggle" class="mt-3 w-full py-2 text-center text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                    展开更多 ↓
                </button>
            ` : ""}
        </div>
    `;
}

// --- Source card rendering ---

function renderGithubCard(item: FeedApiItem): string {
    const lang = item.extra?.language as string | undefined;
    const langColor = item.extra?.language_color as string | undefined;
    const stars = item.extra?.stars as number | undefined;
    const periodStars = item.extra?.period_stars as number | undefined;
    return `
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
           class="group flex min-h-44 w-72 flex-shrink-0 snap-start flex-col rounded-xl border border-outline bg-surface-container p-4 transition-colors hover:border-on-surface-variant">
            <h4 class="shrink-0 text-sm font-bold text-on-surface group-hover:text-primary leading-snug line-clamp-1">
                ${escapeHtml(item.title)}
            </h4>
            ${item.summary ? `<p class="mt-1.5 text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : ""}
            <div class="flex-1"></div>
            <div class="mt-auto flex items-center gap-3 text-xs text-on-surface-variant">
                ${lang ? `<span class="flex items-center gap-1"><span class="inline-block h-2.5 w-2.5 rounded-full" style="background-color:${langColor || '#888'}"></span>${escapeHtml(lang)}</span>` : ""}
                ${stars != null ? `<span>&#9733; ${formatNumber(stars)}</span>` : ""}
                ${periodStars != null ? `<span class="text-[#e8b931]">+${formatNumber(periodStars)}</span>` : ""}
            </div>
        </a>
    `;
}

function renderHnCard(item: FeedApiItem): string {
    return `
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
           class="group flex min-h-44 w-72 flex-shrink-0 snap-start flex-col rounded-xl border border-outline bg-surface-container p-4 transition-colors hover:border-on-surface-variant">
            <h4 class="shrink-0 text-sm font-bold text-on-surface group-hover:text-primary leading-snug line-clamp-1">
                ${escapeHtml(item.title)}
            </h4>
            ${item.summary ? `<p class="mt-1.5 text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : ""}
            <div class="flex-1"></div>
            <div class="mt-auto flex items-center gap-3 text-xs text-on-surface-variant">
                <span>&#9650; ${item.score}</span>
                <span>&#128172; ${item.commentCount}</span>
                ${item.author ? `<span>${escapeHtml(item.author)}</span>` : ""}
            </div>
        </a>
    `;
}

function renderPhCard(item: FeedApiItem): string {
    return `
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
           class="group flex min-h-44 w-72 flex-shrink-0 snap-start flex-col rounded-xl border border-outline bg-surface-container p-4 transition-colors hover:border-on-surface-variant">
            <h4 class="shrink-0 text-sm font-bold text-on-surface group-hover:text-primary leading-snug line-clamp-1">
                ${escapeHtml(item.title)}
            </h4>
            ${item.summary ? `<p class="mt-1.5 text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : ""}
            <div class="flex-1"></div>
            <div class="mt-auto flex items-center gap-3 text-xs text-on-surface-variant">
                <span>&#9650; ${item.score}</span>
                ${item.tags.length > 0 ? `<span>${escapeHtml(item.tags[0])}</span>` : ""}
            </div>
        </a>
    `;
}

function renderSourceCard(source: string, item: FeedApiItem): string {
    switch (source) {
        case "github": return renderGithubCard(item);
        case "hackernews": return renderHnCard(item);
        case "producthunt": return renderPhCard(item);
        default: return renderHnCard(item);
    }
}

async function loadSource(source: string) {
    const section = document.querySelector(`[data-source="${source}"]`);
    if (!section) return;
    const container = section.querySelector(".source-cards");
    if (!container) return;

    try {
        const data = await fetchFeed(source, 8);
        if (data.data.length === 0) {
            container.innerHTML = `<p class="text-sm text-on-surface-variant">暂无数据</p>`;
            return;
        }
        container.innerHTML = data.data.map(item => renderSourceCard(source, item)).join("");
    } catch (err) {
        console.error(`Failed to load ${source}:`, err);
        container.innerHTML = `<p class="text-sm text-on-surface-variant">加载失败</p>`;
    }
}

// --- Picks ---

async function loadPicks() {
    const container = $("#picks-container");
    const dateEl = $("#picks-date");
    if (!container) return;

    try {
        const data = await fetchPicks();

        if (dateEl && data.metadata?.date) {
            dateEl.textContent = data.metadata.date;
        }

        const html = [
            renderDeepDive(data.deepDive),
            renderControversy(data.controversy),
            renderSpeedRead([...data.speedRead].sort((a, b) => b.aiScore - a.aiScore)),
        ].filter(Boolean).join("");

        if (html) {
            container.innerHTML = html;
            const toggle = $("#speed-read-toggle");
            const extra = $("#speed-read-extra");
            if (toggle && extra) {
                toggle.addEventListener("click", () => {
                    const hidden = extra.classList.toggle("hidden");
                    toggle.textContent = hidden ? "展开更多 ↓" : "收起 ↑";
                });
            }

            container.querySelectorAll<HTMLButtonElement>(".deep-dive-toggle").forEach(btn => {
                btn.addEventListener("click", () => {
                    const details = container.querySelector<HTMLElement>(`.deep-dive-details[data-deep-dive="${btn.dataset.target}"]`);
                    if (!details) return;
                    const hidden = details.classList.toggle("hidden");
                    btn.textContent = hidden ? "展开更多" : "收起";
                });
            });
        } else {
            container.innerHTML = `<p class="text-sm text-on-surface-variant">今日精选暂无数据</p>`;
        }
    } catch (err) {
        console.error("Failed to load picks:", err);
        container.innerHTML = `<p class="text-sm text-on-surface-variant">加载失败，请稍后刷新重试</p>`;
    }
}

document.addEventListener("astro:page-load", () => {
    if ($("#picks-container")) {
        loadPicks();
        loadSource("github");
        loadSource("hackernews");
        loadSource("producthunt");
    }
});
