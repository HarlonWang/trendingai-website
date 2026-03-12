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
