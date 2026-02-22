export type Locale = "zh-CN" | "en-US";

export interface FeatureItem {
    title: string;
    description: string;
}

export interface SiteMessages {
    meta: {
        title: string;
        description: string;
        keywords: string;
    };
    nav: {
        github: string;
        download: string;
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
    footer: {
        copyright: string;
        license: string;
        changelog: string;
        repository: string;
    };
}
