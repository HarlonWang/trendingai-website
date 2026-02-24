import { enUS } from "../i18n/messages/en-US";
import { zhCN } from "../i18n/messages/zh-CN";
import type { AppRoute, Locale, SiteMessages } from "../i18n/types";

const MESSAGE_MAP: Record<Locale, SiteMessages> = {
    "zh-CN": zhCN,
    "en-US": enUS
};

const ROUTE_MAP: Record<AppRoute, Record<Locale, string>> = {
    trending: {
        "en-US": "/",
        "zh-CN": "/zh/"
    },
    app: {
        "en-US": "/app/",
        "zh-CN": "/zh/app/"
    }
};

export function getMessages(locale: Locale): SiteMessages {
    return MESSAGE_MAP[locale];
}

export function getPathByLocale(locale: Locale, route: AppRoute = "trending"): string {
    return ROUTE_MAP[route][locale];
}

export function getSwitchLocale(locale: Locale): Locale {
    return locale === "zh-CN" ? "en-US" : "zh-CN";
}

export function getSwitchPath(locale: Locale, route: AppRoute): string {
    return getPathByLocale(getSwitchLocale(locale), route);
}
