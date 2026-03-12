export interface AiSummary {
    provider: string;
    content: string;
}

// GitHub Trending
export interface RepoItem {
    rank: number;
    author: string;
    repoName: string;
    url: string;
    description: string;
    language: string;
    languageColor: string;
    stars: number;
    currentPeriodStars: number;
    aiSummaries: AiSummary[];
}

// Feed (multi-source)
export interface FeedItem {
    id: string;
    source: "github" | "hackernews" | "producthunt";
    title: string;
    url: string;
    description: string;
    score: number;
    tags: string[];
    aiSummary?: string;
    createdAt: string;
    // GitHub specific
    author?: string;
    repoName?: string;
    language?: string;
    languageColor?: string;
    stars?: number;
    currentPeriodStars?: number;
    // HN specific
    commentCount?: number;
    hnUrl?: string;
    // PH specific
    votesCount?: number;
    thumbnailUrl?: string;
}

export interface FeedResponse {
    data: FeedItem[];
}

// Daily Picks
export interface PickItem {
    id: string;
    source: "github" | "hackernews" | "producthunt";
    title: string;
    url: string;
    description: string;
    category: "deep_dive" | "controversial" | "quick_look";
    aiAnalysis: string;
    score: number;
    tags: string[];
    // source-specific fields same as FeedItem
    author?: string;
    repoName?: string;
    language?: string;
    stars?: number;
    commentCount?: number;
    votesCount?: number;
}

export interface PicksResponse {
    date: string;
    data: PickItem[];
}
