import { defaultLocale, type Locale } from "./ui";

export { locales, defaultLocale, t, type Locale, type UIKey } from "./ui";

/** Astro.currentLocale → Locale，非法值兜底英文 */
export function resolveLocale(current: string | undefined): Locale {
    return current === "zh" ? "zh" : defaultLocale;
}

/** 语言无关路径 → 带语言前缀的站内路径，如 ("zh", "/feed/") → "/zh/feed/" */
export function localizePath(locale: Locale, path: string): string {
    return locale === defaultLocale ? path : `/${locale}${path}`;
}

/** html lang 属性值 */
export function htmlLang(locale: Locale): string {
    return locale === "zh" ? "zh-CN" : "en";
}

/** Open Graph locale 值 */
export function ogLocale(locale: Locale): string {
    return locale === "zh" ? "zh_CN" : "en_US";
}
