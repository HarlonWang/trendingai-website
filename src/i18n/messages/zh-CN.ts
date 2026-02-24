import type { SiteMessages } from "../types";

export const zhCN: SiteMessages = {
    meta: {
        trendingTitle: "Trending AI - 每日 GitHub Trending 榜单与 AI 摘要",
        trendingDescription: "按日查看 GitHub Trending 榜单，支持 AM 与 PM 批次，并突出 AI 摘要内容。",
        appTitle: "Trending AI - 用 AI 快速读懂 GitHub Trending",
        appDescription: "Trending AI 是一个 Kotlin Multiplatform 应用，帮助你查看 GitHub 热门项目并自动生成 AI 摘要。",
        keywords: "Trending AI, GitHub Trending, AI 摘要, Kotlin Multiplatform, APK 下载"
    },
    nav: {
        trending: "榜单",
        app: "App",
        github: "GitHub",
        languageLabel: "EN"
    },
    hero: {
        badge: "Material 3 风格 · 极简官网",
        title: "用 AI 快速读懂 GitHub Trending",
        subtitle: "省去翻阅冗长 README 和源码的时间，高效过滤并定位高价值的开源仓库。",
        primaryCta: "立即下载",
        secondaryCta: "开源仓库"
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
                description: "集成 ChatGPT 与 DeepSeek，为热门项目自动提炼核心信息与技术要点。"
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
    trending: {
        title: "GitHub AI Trending 榜单",
        subtitle: "按日展示 AM 与 PM 批次数据。点击仓库名称可直接跳转到 GitHub 仓库页。",
        sidebarTitle: "日期与批次",
        sidebarHint: "默认展示从今天开始的过去 14 天，每天包含 AM 和 PM 两个批次。",
        todayLabel: "今天",
        batchAm: "AM",
        batchPm: "PM",
        loading: "正在加载榜单数据...",
        empty: "当前日期与批次暂无榜单数据。",
        error: "加载榜单失败，请重试。",
        retry: "重试",
        summaryLabel: "AI 摘要",
        summaryFallback: "该仓库暂时没有 AI 摘要。",
        repoDescriptionFallback: "暂无仓库描述。",
        languageLabel: "语言",
        starsLabel: "Star",
        periodStarsLabel: "当日新增 Star",
        updatedLabel: "更新时间",
        dateLabel: "日期",
        batchLabel: "批次"
    },
    footer: {
        copyright: "© 2026 Trending AI",
        license: "MIT 协议",
        changelog: "更新日志",
        repository: "项目仓库"
    }
};
