import type { RepoItem } from "../../types/api";
import { TRENDING_API_URL } from "../../config";

export type Batch = "am" | "pm";
export type Since = "daily" | "weekly" | "monthly";

const cache = new Map<string, RepoItem[]>();

function buildCacheKey(locale: string, since: Since, date: string, batch: Batch): string {
    return `${locale}:${since}:${date}:${batch}`;
}

export async function fetchTrending(
    locale: string,
    summaryLang: string,
    since: Since,
    date: string,
    batch: Batch,
    limit: number,
    signal: AbortSignal
): Promise<RepoItem[]> {
    const key = buildCacheKey(locale, since, date, batch);
    const cached = cache.get(key);
    if (cached !== undefined) {
        return cached;
    }

    const url = new URL(TRENDING_API_URL);
    url.searchParams.set("since", since);
    url.searchParams.set("provider", "chatgpt");
    url.searchParams.set("summary_lang", summaryLang);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("date", date);
    url.searchParams.set("batch", batch);

    const response = await fetch(url.toString(), { signal });
    if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
    }

    const payload = await response.json() as { data?: unknown };
    const items: RepoItem[] = Array.isArray(payload.data) ? payload.data as RepoItem[] : [];

    cache.set(key, items);
    return items;
}
