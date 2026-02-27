import type { RepoItem } from "../../types/api";
import type { TrendingMessages } from "../../i18n/types";

function safeUrl(input: unknown): string {
    if (typeof input !== "string") {
        return "#";
    }
    try {
        const parsed = new URL(input);
        if (parsed.protocol === "https:" || parsed.protocol === "http:") {
            return parsed.toString();
        }
    } catch (_) {
        return "#";
    }
    return "#";
}

function sanitizeLanguageColor(input: unknown): string {
    if (typeof input !== "string") {
        return "";
    }
    const value = input.trim();
    const hexPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    return hexPattern.test(value) ? value : "";
}

function pickSummary(item: RepoItem): string {
    if (!Array.isArray(item.aiSummaries)) {
        return "";
    }
    const entry = item.aiSummaries.find((s) => {
        if (!s || typeof s !== "object") return false;
        const provider = String(s.provider ?? "").toLowerCase();
        const content = typeof s.content === "string" ? s.content.trim() : "";
        return provider === "chatgpt" && content.length > 0;
    });
    return entry && typeof entry.content === "string" ? entry.content.trim() : "";
}

function formatNumber(value: unknown, formatter: Intl.NumberFormat): string {
    const num = Number(value);
    return Number.isFinite(num) ? formatter.format(num) : "-";
}

function buildRepoCard(
    item: RepoItem,
    index: number,
    labels: TrendingMessages,
    numberFormatter: Intl.NumberFormat,
    periodStarsLabel: string
): HTMLElement {
    const rank = Number(item.rank) || index + 1;
    const repoName = `${item.author || "unknown"}/${item.repoName || "unknown"}`;
    const url = safeUrl(item.url);
    const description = typeof item.description === "string" ? item.description.trim() : "";
    const summary = pickSummary(item);
    const language = typeof item.language === "string" && item.language.trim() ? item.language.trim() : "-";
    const languageColor = sanitizeLanguageColor(item.languageColor) || "#9a8fb3";

    const article = document.createElement("article");
    article.className = "trending-repo-card";

    // Header: rank + repo link
    const header = document.createElement("header");
    header.className = "trending-repo-head";

    const rankBadge = document.createElement("span");
    rankBadge.className = "trending-rank";
    rankBadge.textContent = `#${rank}`;

    const link = document.createElement("a");
    link.className = "trending-repo-link";
    link.href = url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = repoName;

    header.appendChild(rankBadge);
    header.appendChild(link);
    article.appendChild(header);

    // Description
    if (description) {
        const desc = document.createElement("p");
        desc.className = "trending-repo-description";
        desc.textContent = description;
        article.appendChild(desc);
    }

    // AI Summary（仅在有内容时渲染）
    if (summary) {
        const summarySection = document.createElement("section");
        summarySection.className = "trending-summary";

        const summaryTitle = document.createElement("h3");
        summaryTitle.textContent = labels.summaryLabel;
        summarySection.appendChild(summaryTitle);

        const summaryText = document.createElement("p");
        summaryText.textContent = summary;
        summarySection.appendChild(summaryText);
        article.appendChild(summarySection);
    }

    // Meta line: language · stars · period stars
    const metaLine = document.createElement("p");
    metaLine.className = "trending-meta-line";

    const langItem = document.createElement("span");
    langItem.className = "trending-meta-item";

    const langDot = document.createElement("span");
    langDot.className = "trending-lang-dot";
    langDot.style.setProperty("--lang-color", languageColor);
    langDot.setAttribute("aria-hidden", "true");

    langItem.appendChild(langDot);
    langItem.appendChild(document.createTextNode(language));
    metaLine.appendChild(langItem);

    const sep1 = document.createElement("span");
    sep1.className = "trending-meta-separator";
    sep1.setAttribute("aria-hidden", "true");
    sep1.textContent = "·";
    metaLine.appendChild(sep1);

    const starsItem = document.createElement("span");
    starsItem.className = "trending-meta-item";
    starsItem.textContent = `${labels.starsLabel} ${formatNumber(item.stars, numberFormatter)}`;
    metaLine.appendChild(starsItem);

    const sep2 = document.createElement("span");
    sep2.className = "trending-meta-separator";
    sep2.setAttribute("aria-hidden", "true");
    sep2.textContent = "·";
    metaLine.appendChild(sep2);

    const periodItem = document.createElement("span");
    periodItem.className = "trending-meta-item";
    periodItem.textContent = `${periodStarsLabel} ${formatNumber(item.currentPeriodStars, numberFormatter)}`;
    metaLine.appendChild(periodItem);

    article.appendChild(metaLine);

    return article;
}

export function renderRepoList(
    container: HTMLElement,
    items: RepoItem[],
    labels: TrendingMessages,
    numberFormatter: Intl.NumberFormat,
    periodStarsLabel: string
): void {
    if (items.length === 0) {
        const empty = document.createElement("article");
        empty.className = "trending-empty-card";
        empty.textContent = labels.empty;
        container.replaceChildren(empty);
        return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
        fragment.appendChild(buildRepoCard(item, index, labels, numberFormatter, periodStarsLabel));
    });
    container.replaceChildren(fragment);
}
