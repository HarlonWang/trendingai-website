import type { SiteMessages } from "../types";

export const enUS: SiteMessages = {
    meta: {
        title: "Trending AI - Understand GitHub Trending with AI",
        description: "Trending AI is a Kotlin Multiplatform app that helps you explore GitHub Trending repositories with AI-powered summaries.",
        keywords: "Trending AI, GitHub Trending, AI Summary, Kotlin Multiplatform, APK Download"
    },
    nav: {
        github: "GitHub",
        download: "Download APK",
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
    footer: {
        copyright: "© 2026 Trending AI",
        license: "MIT License",
        changelog: "Changelog",
        repository: "Repository"
    }
};
