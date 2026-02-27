import type { TrendingMessages } from "../../i18n/types";
import type { RepoItem } from "../../types/api";
import type { Batch, Since } from "./api";
import { fetchTrending } from "./api";
import { renderRepoList } from "./render";

interface BoardConfig {
    locale: string;
    summaryLang: string;
    days: number;
    limit: number;
    labels: TrendingMessages;
}

interface BoardState {
    selectedDate: string;
    selectedBatch: Batch;
    selectedSince: Since;
    controller: AbortController | null;
}

// 读取 Astro 服务端注入的配置
const root = document.querySelector<HTMLElement>("[data-trending-board]");
if (!root) {
    throw new Error("TrendingBoard root element not found");
}

const configEl = root.querySelector<HTMLScriptElement>("[data-trending-config]");
if (!configEl) {
    throw new Error("TrendingBoard config element not found");
}

let config: BoardConfig;
try {
    config = JSON.parse(configEl.textContent ?? "{}") as BoardConfig;
} catch (_) {
    throw new Error("Failed to parse TrendingBoard config");
}

const locale = config.locale === "zh-CN" ? "zh-CN" : "en-US";
const labels = config.labels;
const days = Number.isFinite(config.days) ? config.days : 14;
const limit = Number.isFinite(config.limit) ? config.limit : 25;
const summaryLang = config.summaryLang || "en";

const dateListElement = root.querySelector<HTMLElement>("[data-date-list]")!;
const statusElement = root.querySelector<HTMLElement>("[data-status]")!;
const repoListElement = root.querySelector<HTMLElement>("[data-repo-list]")!;
const sinceSelectorElement = root.querySelector<HTMLElement>("[data-since-selector]")!;

const dateFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    weekday: "short",
});
const numberFormatter = new Intl.NumberFormat(locale);

// ─── 日期工具 ────────────────────────────────────────────────

function formatIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function buildDates(totalDays: number): string[] {
    const output: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < totalDays; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        output.push(formatIsoDate(d));
    }
    return output;
}

const dates = buildDates(days);

function getDisplayDate(isoDate: string): string {
    const normalized = new Date(`${isoDate}T00:00:00`);
    const dateText = dateFormatter.format(normalized);
    if (isoDate === dates[0]) {
        return `${labels.todayLabel} · ${dateText}`;
    }
    return dateText;
}

// ─── 状态 ────────────────────────────────────────────────────

const availabilityMap = new Map<string, "available" | "empty" | "unknown">();

const state: BoardState = {
    selectedDate: dates[0],
    selectedBatch: "pm",
    selectedSince: "daily",
    controller: null,
};

function availabilityKey(date: string, batch: Batch): string {
    return `${date}:${batch}`;
}

// ─── UI 渲染 ─────────────────────────────────────────────────

function createBatchButton(date: string, batch: Batch, text: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "trending-batch-button";
    button.dataset.date = date;
    button.dataset.batch = batch;
    button.textContent = text;
    return button;
}

function syncButtonStates(): void {
    const buttons = dateListElement.querySelectorAll<HTMLButtonElement>("button[data-date][data-batch]");
    for (const button of buttons) {
        const date = button.dataset.date ?? "";
        const batch = button.dataset.batch ?? "";
        const status = availabilityMap.get(availabilityKey(date, batch as Batch)) ?? "unknown";
        const selected = date === state.selectedDate && batch === state.selectedBatch;
        button.classList.toggle("is-selected", selected);
        button.classList.toggle("is-empty", status === "empty");
        button.classList.toggle("is-available", status === "available");
    }
}

function syncSinceButtons(): void {
    const buttons = sinceSelectorElement.querySelectorAll<HTMLButtonElement>("button[data-since]");
    for (const button of buttons) {
        button.classList.toggle("is-selected", button.dataset.since === state.selectedSince);
    }
}

function renderDateList(): void {
    const fragment = document.createDocumentFragment();
    for (const date of dates) {
        const li = document.createElement("li");
        li.className = "trending-date-item";

        const label = document.createElement("div");
        label.className = "trending-date-label";
        label.textContent = getDisplayDate(date);

        const group = document.createElement("div");
        group.className = "trending-batch-group";
        group.appendChild(createBatchButton(date, "am", labels.batchAm));
        group.appendChild(createBatchButton(date, "pm", labels.batchPm));

        li.appendChild(label);
        li.appendChild(group);
        fragment.appendChild(li);
    }
    dateListElement.replaceChildren(fragment);
    syncButtonStates();
}

function setStatus(type: "loading" | "error" | "", message: string, withRetry: boolean): void {
    statusElement.className = "trending-status";
    if (!message) {
        return;
    }
    statusElement.classList.add("is-visible");
    if (type) {
        statusElement.classList.add(`is-${type}`);
    }

    const text = document.createElement("p");
    text.textContent = message;

    if (withRetry) {
        const retryBtn = document.createElement("button");
        retryBtn.type = "button";
        retryBtn.className = "trending-retry-button";
        retryBtn.dataset.retry = "true";
        retryBtn.textContent = labels.retry;
        statusElement.replaceChildren(text, retryBtn);
    } else {
        statusElement.replaceChildren(text);
    }
}

// ─── URL 同步 ────────────────────────────────────────────────

function parseUrlState(): { date: string; batch: Batch; since: Since } {
    const params = new URLSearchParams(window.location.search);
    const queryDate = params.get("date") ?? "";
    const queryBatch = params.get("batch") ?? "";
    const querySince = params.get("since") ?? "";
    const date = dates.includes(queryDate) ? queryDate : dates[0];
    const batch: Batch = queryBatch === "am" || queryBatch === "pm" ? queryBatch : "pm";
    const since: Since = querySince === "weekly" || querySince === "monthly" ? querySince : "daily";
    return { date, batch, since };
}

function updateUrl(date: string, batch: Batch, since: Since): void {
    const url = new URL(window.location.href);
    url.searchParams.set("date", date);
    url.searchParams.set("batch", batch);
    url.searchParams.set("since", since);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

// ─── 数据加载 ─────────────────────────────────────────────────

function applySelection(date: string, batch: Batch, since: Since, syncUrl: boolean): void {
    state.selectedDate = date;
    state.selectedBatch = batch;
    state.selectedSince = since;
    syncButtonStates();
    syncSinceButtons();
    if (syncUrl) {
        updateUrl(date, batch, since);
    }
}

async function loadSelection(date: string, batch: Batch, since: Since, syncUrl: boolean): Promise<void> {
    if (state.controller) {
        state.controller.abort();
    }
    const controller = new AbortController();
    state.controller = controller;

    applySelection(date, batch, since, syncUrl);
    setStatus("loading", labels.loading, false);

    try {
        const items = await fetchTrending(locale, summaryLang, since, date, batch, limit, controller.signal);
        if (state.controller !== controller) return;

        availabilityMap.set(availabilityKey(date, batch), items.length > 0 ? "available" : "empty");
        syncButtonStates();
        renderRepoList(repoListElement, items, labels, numberFormatter);
        setStatus("", "", false);
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        if (state.controller !== controller) return;
        repoListElement.replaceChildren();
        setStatus("error", labels.error, true);
    }
}

function buildInitialCandidates(initialDate: string, initialBatch: Batch): Array<{ date: string; batch: Batch }> {
    const candidates: Array<{ date: string; batch: Batch }> = [];
    const seen = new Set<string>();

    const push = (date: string, batch: Batch) => {
        const key = `${date}:${batch}`;
        if (seen.has(key)) return;
        seen.add(key);
        candidates.push({ date, batch });
    };

    push(initialDate, initialBatch);
    for (const date of dates) {
        push(date, "pm");
        push(date, "am");
    }
    return candidates;
}

async function initialize(): Promise<void> {
    renderDateList();

    const initial = parseUrlState();
    state.selectedSince = initial.since;
    syncSinceButtons();

    const candidates = buildInitialCandidates(initial.date, initial.batch);

    if (state.controller) {
        state.controller.abort();
    }
    const controller = new AbortController();
    state.controller = controller;

    setStatus("loading", labels.loading, false);

    let firstItems: { date: string; batch: Batch; items: RepoItem[] } | null = null;

    try {
        for (const candidate of candidates) {
            const items = await fetchTrending(
                locale, summaryLang, initial.since, candidate.date, candidate.batch, limit, controller.signal
            );

            availabilityMap.set(availabilityKey(candidate.date, candidate.batch), items.length > 0 ? "available" : "empty");
            syncButtonStates();

            if (!firstItems) {
                firstItems = { date: candidate.date, batch: candidate.batch, items };
            }

            if (items.length > 0) {
                if (state.controller !== controller) return;
                applySelection(candidate.date, candidate.batch, initial.since, true);
                renderRepoList(repoListElement, items, labels, numberFormatter);
                setStatus("", "", false);
                return;
            }
        }

        if (state.controller !== controller) return;

        // 所有候选都没有数据，显示第一个（空状态）
        const fallback = firstItems ?? { date: candidates[0].date, batch: candidates[0].batch, items: [] };
        applySelection(fallback.date, fallback.batch, initial.since, true);
        renderRepoList(repoListElement, fallback.items, labels, numberFormatter);
        setStatus("", "", false);
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        if (state.controller !== controller) return;
        setStatus("error", labels.error, true);
    }
}

// ─── 事件绑定 ────────────────────────────────────────────────

dateListElement.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("button[data-date][data-batch]");
    if (!button) return;

    const date = button.dataset.date ?? "";
    const batch = button.dataset.batch ?? "";
    if (!dates.includes(date) || (batch !== "am" && batch !== "pm")) return;

    loadSelection(date, batch as Batch, state.selectedSince, true);
});

sinceSelectorElement.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("button[data-since]");
    if (!button) return;

    const since = button.dataset.since ?? "";
    if (since !== "daily" && since !== "weekly" && since !== "monthly") return;
    if (since === state.selectedSince) return;

    // 切换 since 维度时，重置可用性状态（新维度下数据未知）
    availabilityMap.clear();
    syncButtonStates();
    loadSelection(state.selectedDate, state.selectedBatch, since as Since, true);
});

statusElement.addEventListener("click", (event) => {
    const retryBtn = (event.target as Element).closest<HTMLButtonElement>("button[data-retry]");
    if (!retryBtn) return;
    loadSelection(state.selectedDate, state.selectedBatch, state.selectedSince, true);
});

initialize();
