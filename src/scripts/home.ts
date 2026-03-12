import { fetchPicks } from "./lib/api";
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

function renderDeepDive(items: PickItem[]): string {
    if (items.length === 0) return "";
    return `
        <div class="mb-8">
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-on-surface-variant">深度解读</h3>
            <div class="grid gap-4 md:grid-cols-${Math.min(items.length, 3)}">
                ${items.map(item => `
                    <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
                       class="group rounded-xl border border-outline bg-surface-container p-5 transition-colors hover:border-on-surface-variant">
                        <div class="mb-3 flex items-center gap-2">
                            ${sourceTag(item)}
                            <span class="text-xs text-on-surface-variant">Score ${item.score}</span>
                        </div>
                        <h4 class="mb-2 text-base font-bold text-on-surface group-hover:text-primary leading-snug">
                            ${escapeHtml(item.title)}
                        </h4>
                        ${item.summary ? `<p class="mb-3 text-sm text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : ""}
                        ${item.analysis ? `
                            <div class="rounded-lg bg-surface p-3 text-xs">
                                <p class="font-semibold text-on-surface">${escapeHtml(item.analysis.core)}</p>
                                <p class="mt-1.5 text-on-surface-variant leading-relaxed">${escapeHtml(item.analysis.why_important)}</p>
                            </div>
                        ` : ""}
                    </a>
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
                ${items.map(item => `
                    <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
                       class="group rounded-xl border border-outline p-4 transition-colors hover:border-on-surface-variant">
                        <div class="mb-2 flex items-center gap-2">
                            ${sourceTag(item)}
                        </div>
                        <h4 class="text-sm font-bold text-on-surface group-hover:text-primary leading-snug">
                            ${escapeHtml(item.title)}
                        </h4>
                        ${item.summary ? `<p class="mt-1.5 text-xs text-on-surface-variant leading-relaxed line-clamp-2">${escapeHtml(item.summary)}</p>` : ""}
                    </a>
                `).join("")}
            </div>
        </div>
    `;
}

function renderSpeedRead(items: PickItem[]): string {
    if (items.length === 0) return "";
    return `
        <div>
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-on-surface-variant">快速浏览</h3>
            <div class="divide-y divide-outline">
                ${items.map(item => `
                    <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
                       class="group flex items-start gap-3 py-3 transition-colors">
                        ${sourceTag(item)}
                        <div class="min-w-0 flex-1">
                            <h4 class="text-sm font-medium text-on-surface group-hover:text-primary leading-snug">
                                ${escapeHtml(item.title)}
                            </h4>
                            ${item.summary ? `<p class="mt-1 text-xs text-on-surface-variant leading-relaxed line-clamp-1">${escapeHtml(item.summary)}</p>` : ""}
                        </div>
                        <span class="shrink-0 text-xs text-on-surface-variant">${item.score}</span>
                    </a>
                `).join("")}
            </div>
        </div>
    `;
}

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
            renderSpeedRead(data.speedRead),
        ].filter(Boolean).join("");

        if (html) {
            container.innerHTML = html;
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
    }
});
