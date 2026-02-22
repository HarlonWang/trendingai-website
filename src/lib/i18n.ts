import { enUS } from "../i18n/messages/en-US";
import { zhCN } from "../i18n/messages/zh-CN";
import type { Locale, SiteMessages } from "../i18n/types";

const MESSAGE_MAP: Record<Locale, SiteMessages> = {
    "zh-CN": zhCN,
    "en-US": enUS
};

export function getMessages(locale: Locale): SiteMessages {
    return MESSAGE_MAP[locale];
}

export function getPathByLocale(locale: Locale): string {
    return locale === "en-US" ? "/en/" : "/";
}

export function getSwitchLocale(locale: Locale): Locale {
    return locale === "zh-CN" ? "en-US" : "zh-CN";
}
