export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const en = {
    "site.title": "Trending AI - Daily Tech Trends Curated by AI",
    "site.description": "Trending projects from GitHub, Hacker News and Product Hunt, analyzed by AI with daily curated picks",

    "nav.home": "Home",
    "nav.feed": "Feed",
    "nav.app": "App",
    // 语言选择器按钮展示当前语言，点击弹出语言列表
    "nav.langCurrent": "EN",
    "nav.langMenuTitle": "Language",

    "home.heroTitle": "Global Tech Trends, Curated by AI",
    "home.heroSubtitle": "Trending from GitHub, Hacker News and Product Hunt — AI-curated picks, every day",
    "home.picksTitle": "Today's Picks",
    "home.sourceGithub": "GitHub Trending",
    "home.sourceHackernews": "Hot on Hacker News",
    "home.sourceProducthunt": "New on Product Hunt",
    "home.viewAll": "View all",
    "home.deepDive": "Deep Dive",
    "home.debut": "New on GitHub",
    "home.useCases": "Use Cases",
    "home.alternatives": "Alternatives",
    "home.keywords": "Keywords",
    "home.termsSeparator": ", ",
    "home.noPicks": "No picks for today yet",

    "common.noData": "No data yet",
    "common.loadFailed": "Failed to load, please refresh and try again",

    "feed.title": "Feed - Trending AI",
    "feed.description": "Browse all trending content from GitHub, Hacker News and Product Hunt",
    "feed.tabAll": "All",

    "app.title": "Download App - Trending AI",
    "app.description": "Download the TrendingAI app and track global tech trends anywhere",
    "app.heroTitleLine1": "Spot tech trends",
    "app.heroTitleLine2": "one step ahead",
    "app.heroDesc": "TrendingAI aggregates trending content from GitHub, Hacker News, Product Hunt and more, with AI analysis to help you track global tech efficiently.",
    "app.downloadApk": "Download Android APK",
    "app.googlePlay": "Google Play",
    "app.githubSource": "Source on GitHub",
    "app.qrLine1": "Scan to get",
    "app.qrLine2": "the APK",
    "app.qrAlt": "QR code for TrendingAI APK download",
    "app.screenshotAlt": "TrendingAI app screenshot",
    "app.feature1Title": "Multi-source Aggregation",
    "app.feature1Desc": "GitHub Trending, Hacker News and Product Hunt in one place",
    "app.feature2Title": "AI Summaries",
    "app.feature2Desc": "Auto-generated AI analysis for every project, so you get the gist fast",
    "app.feature3Title": "Daily Picks",
    "app.feature3Desc": "AI selects the most noteworthy projects from across the web",
    "app.feature4Title": "History Playback",
    "app.feature4Desc": "Browse trending lists from any past date and never miss a day",

    "privacy.title": "Privacy Policy - Trending AI",
    "privacy.description": "Trending AI privacy policy",

    "subscribe.emailAria": "Email address",
    "subscribe.heroPlaceholder": "Your email — get daily picks",
    "subscribe.button": "Subscribe",
    "subscribe.fullTitle": "Daily picks, straight to your inbox",
    "subscribe.fullDesc": "AI-curated tech trends, one email a day, unsubscribe anytime",
    "subscribe.placeholder": "Enter your email",
    "subscribe.submitting": "Submitting...",
    "subscribe.already": "This email is already subscribed",
    "subscribe.resubscribed": "Resubscribed successfully",
    "subscribe.success": "Subscribed successfully",
    "subscribe.fail": "Subscription failed, please try again later",
    "subscribe.network": "Network error, please try again later",
    "subscribe.unsubOk": "Unsubscribed successfully",
    "subscribe.unsubAlready": "Already unsubscribed",
    "subscribe.unsubError": "Invalid unsubscribe link",

    "feedback.placeholder": "Any feedback or questions?",
    "feedback.emailPlaceholder": "Email (optional, so we can reply)",
    "feedback.submit": "Send Feedback",
    "feedback.submitting": "Submitting...",
    "feedback.thanks": "Thanks for your feedback!",
    "feedback.fail": "Failed to submit, please try again later",
    "feedback.network": "Network error, please try again later",
    "feedback.aria": "Send feedback",

    "theme.auto": "Follow system",
    "theme.dark": "Dark mode",
    "theme.light": "Light mode",
    "theme.toggle": "Toggle theme",
} as const;

export type UIKey = keyof typeof en;

const zh: Record<UIKey, string> = {
    "site.title": "Trending AI - 每日技术趋势精选",
    "site.description": "聚合 GitHub、Hacker News、Product Hunt 热门项目，AI 智能分析，每日精选推荐",

    "nav.home": "首页",
    "nav.feed": "Feed",
    "nav.app": "App",
    "nav.langCurrent": "中文",
    "nav.langMenuTitle": "语言",

    "home.heroTitle": "全球技术热点，AI 精选速递",
    "home.heroSubtitle": "聚合 GitHub、Hacker News、Product Hunt 热门项目，每日 AI 精选推荐",
    "home.picksTitle": "今日精选",
    "home.sourceGithub": "GitHub 热门",
    "home.sourceHackernews": "Hacker News 热议",
    "home.sourceProducthunt": "Product Hunt 新品",
    "home.viewAll": "查看全部",
    "home.deepDive": "深度解读",
    "home.debut": "GitHub 上新",
    "home.useCases": "适合场景",
    "home.alternatives": "类似产品",
    "home.keywords": "关键词",
    "home.termsSeparator": "、",
    "home.noPicks": "今日精选暂无数据",

    "common.noData": "暂无数据",
    "common.loadFailed": "加载失败，请稍后刷新重试",

    "feed.title": "Feed - Trending AI",
    "feed.description": "浏览 GitHub、Hacker News、Product Hunt 全部热门内容",
    "feed.tabAll": "全部",

    "app.title": "App 下载 - Trending AI",
    "app.description": "下载 TrendingAI App，随时随地追踪全球技术趋势",
    "app.heroTitleLine1": "发现技术趋势",
    "app.heroTitleLine2": "比别人快一步",
    "app.heroDesc": "TrendingAI 聚合 GitHub、Hacker News、Product Hunt 等多个技术社区的热门内容，配合 AI 智能分析，帮你高效追踪全球技术动态。",
    "app.downloadApk": "下载 Android APK",
    "app.googlePlay": "Google Play",
    "app.githubSource": "GitHub 源码",
    "app.qrLine1": "扫码下载",
    "app.qrLine2": "APK",
    "app.qrAlt": "TrendingAI APK 下载二维码",
    "app.screenshotAlt": "TrendingAI App 截图",
    "app.feature1Title": "多源聚合",
    "app.feature1Desc": "GitHub Trending、Hacker News、Product Hunt 一站浏览",
    "app.feature2Title": "AI 智能摘要",
    "app.feature2Desc": "每个项目自动生成 AI 分析，快速了解核心价值",
    "app.feature3Title": "每日精选",
    "app.feature3Desc": "AI 从全网筛选最值得关注的技术项目",
    "app.feature4Title": "历史回溯",
    "app.feature4Desc": "查看任意日期的趋势榜单，不错过每一天",

    "privacy.title": "隐私政策 - Trending AI",
    "privacy.description": "Trending AI 隐私政策",

    "subscribe.emailAria": "邮箱地址",
    "subscribe.heroPlaceholder": "输入邮箱，订阅每日精选",
    "subscribe.button": "订阅",
    "subscribe.fullTitle": "每日精选，一键订阅",
    "subscribe.fullDesc": "AI 精选技术趋势，每日一封，随时退订",
    "subscribe.placeholder": "输入邮箱地址",
    "subscribe.submitting": "提交中...",
    "subscribe.already": "该邮箱已订阅",
    "subscribe.resubscribed": "重新订阅成功",
    "subscribe.success": "订阅成功",
    "subscribe.fail": "订阅失败，请稍后重试",
    "subscribe.network": "网络错误，请稍后重试",
    "subscribe.unsubOk": "已成功退订",
    "subscribe.unsubAlready": "已退订",
    "subscribe.unsubError": "退订链接无效",

    "feedback.placeholder": "有什么建议或问题？",
    "feedback.emailPlaceholder": "邮箱（选填，方便回复）",
    "feedback.submit": "提交反馈",
    "feedback.submitting": "提交中...",
    "feedback.thanks": "感谢反馈！",
    "feedback.fail": "提交失败，请稍后重试",
    "feedback.network": "网络错误，请稍后重试",
    "feedback.aria": "提交反馈",

    "theme.auto": "跟随系统",
    "theme.dark": "深色模式",
    "theme.light": "浅色模式",
    "theme.toggle": "切换主题",
};

const dictionaries: Record<Locale, Partial<Record<UIKey, string>>> = { en, zh };

/** 取当前语言文案；缺失键兜底英文 */
export function t(locale: Locale, key: UIKey): string {
    return dictionaries[locale][key] ?? en[key];
}

/** 客户端脚本从 <html data-locale> 读取当前语言，非法值兜底英文 */
export function getClientLocale(): Locale {
    const value = document.documentElement.dataset.locale;
    return value === "zh" ? "zh" : "en";
}
