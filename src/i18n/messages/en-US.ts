import type { SiteMessages } from "../types";

export const enUS: SiteMessages = {
    meta: {
        trendingTitle: "Trending AI - Daily GitHub Trending with AI Summaries",
        trendingDescription: "Explore the latest GitHub Trending repositories with AI summaries, refreshed by daily AM and PM batches.",
        appTitle: "Trending AI - Understand GitHub Trending with AI",
        appDescription: "Trending AI is a Kotlin Multiplatform app that helps you explore GitHub Trending repositories with AI-powered summaries.",
        keywords: "Trending AI, GitHub Trending, AI Summary, Kotlin Multiplatform, APK Download"
    },
    nav: {
        trending: "Trending",
        app: "App",
        github: "GitHub",
        languageLabel: "中文"
    },
    hero: {
        badge: "Material 3 aligned · Minimal landing",
        title: "Understand GitHub Trending with AI",
        subtitle: "Save time reading long READMEs and source code by efficiently filtering and locating high-value open source repositories.",
        primaryCta: "Download Now",
        secondaryCta: "Open Repository"
    },
    features: {
        title: "Core Features",
        items: [
            {
                title: "Comprehensive Trending",
                description: "Track daily, weekly, and monthly lists with clear switching and focused exploration flow."
            },
            {
                title: "AI-Powered Summaries",
                description: "Integrated with ChatGPT and DeepSeek to extract key capabilities and technical highlights."
            },
            {
                title: "Historical Records",
                description: "Review previous snapshots by date and report batch to understand trend evolution."
            },
            {
                title: "Native Cross-platform",
                description: "Built with Kotlin Multiplatform and Compose Multiplatform for Android and iOS from one codebase."
            }
        ]
    },
    preview: {
        title: "App Preview",
        description: "A clean information hierarchy helps you focus on repository value, AI insight, and signal density.",
        alt: "Trending AI Android app screenshot"
    },
    download: {
        title: "Download Android APK",
        description: "The page fetches the latest release automatically. If unavailable, use the Releases fallback link.",
        cta: "Download Latest APK",
        fallbackCta: "Open Releases",
        loading: "Loading latest release metadata...",
        error: "Failed to load latest metadata. Please use the fallback link.",
        versionLabel: "Version",
        dateLabel: "Published",
        sizeLabel: "Package Size",
        digestLabel: "SHA256"
    },
    trending: {
        sidebarTitle: "Date & Batch",
        sidebarHint: "Showing the last 14 days from today. Each date has AM and PM snapshots.",
        todayLabel: "Today",
        batchAm: "AM",
        batchPm: "PM",
        loading: "Loading trending data...",
        empty: "No trending data found for this date and batch.",
        error: "Failed to load trending data. Please retry.",
        retry: "Retry",
        summaryLabel: "AI Summary",
        summaryFallback: "No AI summary available yet.",
        languageLabel: "Language",
        starsLabel: "Stars",
        periodStarsLabel: "Stars (Daily)"
    },
    footer: {
        copyright: "© 2026 Trending AI",
        license: "MIT License",
        changelog: "Changelog",
        repository: "Repository"
    }
};
