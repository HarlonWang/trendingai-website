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
    author?: string;
    repoName?: string;
    language?: string;
    languageColor?: string;
    stars?: number;
    currentPeriodStars?: number;
    commentCount?: number;
    hnUrl?: string;
    votesCount?: number;
    thumbnailUrl?: string;
}

export interface FeedResponse {
    data: FeedItem[];
}

// Daily Picks
export interface PickAnalysis {
    core: string;
    why_important: string;
    community_voice: {
        positive: string;
        negative: string;
    };
    action: string;
    alternatives: string;
    terms: string[];
}

export interface PickItem {
    rank: number;
    source: "github" | "hackernews" | "producthunt";
    title: string;
    url: string;
    description: string | null;
    score: number;
    aiScore: number;
    sourceLabel: string;
    alsoOn: string[];
    summary: string | null;
    analysis: PickAnalysis | null;
}

export interface PicksResponse {
    success: boolean;
    metadata: { date: string };
    speedRead: PickItem[];
    deepDive: PickItem[];
    controversy: PickItem[];
}
