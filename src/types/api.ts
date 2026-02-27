export interface AiSummary {
    provider: string;
    content: string;
}

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

export interface TrendingResponse {
    data: RepoItem[];
}
