export type Locale = "zh-CN" | "en-US";

export type AppRoute = "trending" | "app";

export interface FeatureItem {
    title: string;
    description: string;
}

export interface TrendingMessages {
    sidebarTitle: string;
    sidebarHint: string;
    todayLabel: string;
    batchAm: string;
    batchPm: string;
    loading: string;
    empty: string;
    error: string;
    retry: string;
    summaryLabel: string;
    summaryFallback: string;
    languageLabel: string;
    starsLabel: string;
    periodStarsLabel: string;
}

export interface SiteMessages {
    meta: {
        trendingTitle: string;
        trendingDescription: string;
        appTitle: string;
        appDescription: string;
        keywords: string;
    };
    nav: {
        trending: string;
        app: string;
        github: string;
        languageLabel: string;
    };
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        primaryCta: string;
        secondaryCta: string;
    };
    features: {
        title: string;
        items: FeatureItem[];
    };
    preview: {
        title: string;
        description: string;
        alt: string;
    };
    download: {
        title: string;
        description: string;
        cta: string;
        fallbackCta: string;
        loading: string;
        error: string;
        versionLabel: string;
        dateLabel: string;
        sizeLabel: string;
        digestLabel: string;
    };
    trending: TrendingMessages;
    footer: {
        copyright: string;
        license: string;
        changelog: string;
        repository: string;
    };
}
