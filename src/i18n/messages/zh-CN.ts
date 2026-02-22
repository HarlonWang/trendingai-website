import type { SiteMessages } from "../types";

export const zhCN: SiteMessages = {
    meta: {
        title: "Trending AI - 用 AI 快速读懂 GitHub Trending",
        description: "Trending AI 是一个 Kotlin Multiplatform 应用，帮助你查看 GitHub 热门项目并自动生成 AI 摘要。",
        keywords: "Trending AI, GitHub Trending, AI 摘要, Kotlin Multiplatform, APK 下载"
    },
    nav: {
        github: "GitHub",
        download: "下载 APK",
        languageLabel: "EN"
    },
    hero: {
        badge: "Material 3 风格 · 极简官网",
        title: "用 AI 快速读懂 GitHub Trending",
        subtitle: "聚合今日、本周、本月热门仓库，并自动生成高质量摘要，帮助你更快发现高价值开源项目。",
        primaryCta: "立即下载",
        secondaryCta: "查看源码"
    },
    features: {
        title: "核心能力",
        items: [
            {
                title: "全周期趋势榜单",
                description: "覆盖今日、本周、本月榜单，支持快速切换并持续跟踪趋势变化。"
            },
            {
                title: "AI 智能摘要",
                description: "集成 Gemini 与 DeepSeek，为热门项目自动提炼核心信息与技术要点。"
            },
            {
                title: "历史记录回溯",
                description: "按日期与批次查看历史榜单，复盘趋势演化与项目热度走向。"
            },
            {
                title: "跨平台原生体验",
                description: "基于 Kotlin Multiplatform 与 Compose Multiplatform，一套代码覆盖 Android 和 iOS。"
            }
        ]
    },
    preview: {
        title: "界面预览",
        description: "简洁的信息层级，聚焦项目价值。你可以快速浏览榜单、摘要和关键指标。",
        alt: "Trending AI Android 应用截图"
    },
    download: {
        title: "下载 Android APK",
        description: "系统会自动读取最新 Release。若获取失败，可直接打开 GitHub Releases。",
        cta: "下载最新 APK",
        fallbackCta: "前往 Releases",
        loading: "正在获取最新版本信息...",
        error: "暂时无法获取最新版本信息，请使用备用链接。",
        versionLabel: "版本",
        dateLabel: "发布时间",
        sizeLabel: "安装包大小",
        digestLabel: "SHA256"
    },
    footer: {
        copyright: "© 2026 Trending AI",
        license: "MIT 协议",
        changelog: "更新日志",
        repository: "项目仓库"
    }
};
