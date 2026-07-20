import { fetchPicks, fetchFeed, fetchGithubTrending } from "./lib/api";
import type { FeedApiItem } from "./lib/api";
import { escapeHtml, $ } from "./lib/dom";
import { t, getClientLocale, type UIKey } from "../i18n/ui";
import type { PickItem } from "../types/api";

function tt(key: UIKey): string {
    return t(getClientLocale(), key);
}

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
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-on-surface-variant">${tt("home.deepDive")}</h3>
            <div class="grid gap-4 ${items.length >= 3 ? "md:grid-cols-3" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1"}">
                ${items.map((item, i) => `
                    <div class="overflow-hidden rounded-xl border border-outline bg-surface-container p-5 transition-colors hover:border-on-surface-variant">
                        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="group block">
                            <div class="mb-3 flex items-center gap-2">
                                ${sourceTag(item)}
                                <span class="min-w-0 flex-1 truncate text-xs text-on-surface-variant">${escapeHtml(item.title)}</span>
                                <span class="shrink-0 text-xs text-on-surface-variant">${sourceScore(item)}</span>
                            </div>
                            ${item.analysis ? `
                                <h4 class="mb-2 text-base font-bold text-on-surface group-hover:text-primary leading-snug">
                                    ${escapeHtml(item.analysis.core)}
                                </h4>
                                ${item.analysis.why_important ? `<p class="text-sm text-on-surface-variant leading-relaxed ">${escapeHtml(item.analysis.why_important)}</p>` : ""}
                            ` : ""}
                        </a>
                        ${item.analysis?.action || item.analysis?.alternatives || item.analysis?.terms?.length ? `
                            <div class="mt-3 border-t border-outline pt-3">
                                ${item.analysis.action ? `<div class="${item.analysis.alternatives || item.analysis.terms?.length ? 'mb-3' : ''}">
                                    <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">${tt("home.useCases")}</p>
                                    <p class="text-sm text-on-surface-variant leading-relaxed">${escapeHtml(item.analysis.action)}</p>
                                </div>` : ""}
                                ${item.analysis.alternatives || item.analysis.terms?.length ? `<div class="flex items-baseline justify-between gap-4">
                                    ${item.analysis.alternatives ? `<div>
                                        <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">${tt("home.alternatives")}</p>
                                        <p class="text-xs text-on-surface-variant/70 leading-relaxed">${escapeHtml(item.analysis.alternatives)}</p>
                                    </div>` : ""}
                                    ${item.analysis.terms?.length ? `<div class="shrink-0 text-right">
                                        <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">${tt("home.keywords")}</p>
                                        <p class="text-xs text-on-surface-variant/70 leading-relaxed">${item.analysis.terms.map((term: string) => escapeHtml(term)).join(tt("home.termsSeparator"))}</p>
                                    </div>` : ""}
                                </div>` : ""}
                            </div>
                        ` : ""}
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function renderDebut(items: PickItem[]): string {
    if (items.length === 0) return "";
    return `
        <div class="mb-8">
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-on-surface-variant">${tt("home.debut")}</h3>
            <div class="grid gap-3${items.length === 3 ? " md:grid-cols-3" : items.length > 1 ? " sm:grid-cols-2" : ""}">
                ${items.map(item => `
                    <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
                       class="group rounded-xl border border-outline p-4 transition-colors hover:border-on-surface-variant">
                        <div class="mb-2 flex items-center gap-2">
                            ${sourceTag(item)}
                            <span class="min-w-0 flex-1 truncate text-xs text-on-surface-variant">${escapeHtml(item.title)}</span>
                            <span class="shrink-0 text-xs text-on-surface-variant">${sourceScore(item)}</span>
                        </div>
                        ${item.analysis ? `
                            <h4 class="text-sm font-bold text-on-surface group-hover:text-primary leading-snug">
                                ${escapeHtml(item.analysis.core)}
                            </h4>
                            ${item.analysis.why_important ? `<p class="mt-1.5 text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.analysis.why_important)}</p>` : ""}
                            ${item.analysis.action ? `<p class="mt-1.5 text-xs text-on-surface-variant/70 leading-relaxed">${escapeHtml(item.analysis.action)}</p>` : ""}
                        ` : (item.summary ? `<p class="text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : "")}
                    </a>`).join("")}
            </div>
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
           class="group flex w-72 flex-shrink-0 snap-start flex-col rounded-xl border border-outline bg-surface-container p-4 transition-colors hover:border-on-surface-variant">
            <h4 class="shrink-0 text-sm font-bold text-on-surface group-hover:text-primary leading-snug line-clamp-1">
                ${escapeHtml(item.title)}
            </h4>
            ${item.summary ? `<p class="mt-1.5 text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : ""}
            <div class="flex-1"></div>
            <div class="mt-3 flex items-center gap-3 text-xs text-on-surface-variant">
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
           class="group flex w-72 flex-shrink-0 snap-start flex-col rounded-xl border border-outline bg-surface-container p-4 transition-colors hover:border-on-surface-variant">
            <h4 class="shrink-0 text-sm font-bold text-on-surface group-hover:text-primary leading-snug line-clamp-1">
                ${escapeHtml(item.title)}
            </h4>
            ${item.summary ? `<p class="mt-1.5 text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : ""}
            <div class="flex-1"></div>
            <div class="mt-3 flex items-center gap-3 text-xs text-on-surface-variant">
                <span>&#9650; ${item.score}</span>
                <span>&#128172; ${item.commentCount}</span>
                ${item.author ? `<span>${escapeHtml(item.author)}</span>` : ""}
            </div>
        </a>
    `;
}

function renderPhCard(item: FeedApiItem): string {
    const phUrl = item.extra?.ph_url as string | undefined;
    // PH 条目主跳转直达 PH 原帖（缺 ph_url 的旧数据回退产品官网）
    const cardUrl = phUrl?.startsWith("https://") ? phUrl : item.url;
    return `
        <a href="${escapeHtml(cardUrl)}" target="_blank" rel="noopener noreferrer"
           class="group flex w-72 flex-shrink-0 snap-start flex-col rounded-xl border border-outline bg-surface-container p-4 transition-colors hover:border-on-surface-variant">
            <h4 class="shrink-0 text-sm font-bold text-on-surface group-hover:text-primary leading-snug line-clamp-1">
                ${escapeHtml(item.title)}
            </h4>
            ${item.summary ? `<p class="mt-1.5 text-xs text-on-surface-variant leading-relaxed">${escapeHtml(item.summary)}</p>` : ""}
            <div class="flex-1"></div>
            <div class="mt-3 flex items-center gap-3 text-xs text-on-surface-variant">
                <span>&#9650; ${item.score}</span>
                <span>&#128172; ${item.commentCount}</span>
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
        const data = source === "github"
            ? await fetchGithubTrending()
            : await fetchFeed(source, 8);
        if (data.data.length === 0) {
            container.innerHTML = `<p class="text-sm text-on-surface-variant">${tt("common.noData")}</p>`;
            return;
        }
        container.innerHTML = data.data.map(item => renderSourceCard(source, item)).join("");
    } catch (err) {
        console.error(`Failed to load ${source}:`, err);
        container.innerHTML = `<p class="text-sm text-on-surface-variant">${tt("common.loadFailed")}</p>`;
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
            renderDebut(data.debut ?? []),
            renderDeepDive(data.deepDive),
        ].filter(Boolean).join("");

        if (html) {
            container.innerHTML = html;

        } else {
            container.innerHTML = `<p class="text-sm text-on-surface-variant">${tt("home.noPicks")}</p>`;
        }
    } catch (err) {
        console.error("Failed to load picks:", err);
        container.innerHTML = `<p class="text-sm text-on-surface-variant">${tt("common.loadFailed")}</p>`;
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
