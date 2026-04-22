import { API_BASE } from "../../config";
import type { PicksResponse } from "../../types/api";

export async function fetchPicks(): Promise<PicksResponse> {
    const res = await fetch(`${API_BASE}/api/picks?summary_lang=zh`);
    if (!res.ok) throw new Error(`Picks API error: ${res.status}`);
    return res.json();
}

export interface FeedApiItem {
    source: string;
    title: string;
    url: string;
    description: string | null;
    author: string | null;
    score: number;
    commentCount: number;
    tags: string[];
    extra: Record<string, unknown> | null;
    summary: string | null;
}

export interface FeedApiResponse {
    success: boolean;
    count: number;
    data: FeedApiItem[];
}

export async function fetchFeed(source: string, limit = 8, days?: number): Promise<FeedApiResponse> {
    let url = `${API_BASE}/api/feed?source=${source}&limit=${limit}&summary_lang=zh`;
    if (days) url += `&days=${days}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Feed API error: ${res.status}`);
    return res.json();
}

interface TrendingApiItem {
    rank: number;
    author: string;
    repoName: string;
    url: string;
    description: string | null;
    language: string | null;
    languageColor: string | null;
    stars: number;
    currentPeriodStars: number;
    aiSummaries: { provider: string; content: string | null }[] | null;
}

export async function fetchGithubTrending(): Promise<FeedApiResponse> {
    const url = `${API_BASE}/api/trending?since=daily&lang=all&summary_lang=zh`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Trending API error: ${res.status}`);
    const raw = await res.json();

    const data: FeedApiItem[] = (raw.data ?? []).map((item: TrendingApiItem) => {
        const summaries = item.aiSummaries ?? [];
        const preferred = summaries.find(s => s.provider === "chatgpt" && s.content);
        const fallback = summaries.find(s => s.content);
        const summary = preferred?.content ?? fallback?.content ?? null;

        return {
            source: "github",
            title: `${item.author}/${item.repoName}`,
            url: item.url,
            description: item.description,
            author: item.author,
            score: item.stars,
            commentCount: 0,
            tags: [],
            extra: {
                language: item.language,
                language_color: item.languageColor,
                stars: item.stars,
                period_stars: item.currentPeriodStars,
            },
            summary,
        };
    });

    return {
        success: raw.success ?? true,
        count: data.length,
        data,
    };
}
