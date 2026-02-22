import type { Locale } from "../i18n/types";

export function formatBytes(bytes: number, locale: Locale): string {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return "-";
    }

    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let index = 0;

    while (value >= 1024 && index < units.length - 1) {
        value /= 1024;
        index += 1;
    }

    const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: index === 0 ? 0 : 1,
        maximumFractionDigits: index === 0 ? 0 : 1
    });

    return `${formatter.format(value)} ${units[index]}`;
}

export function formatPublishedDate(dateString: string, locale: Locale): string {
    if (!dateString) {
        return "-";
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    const formatter = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    return formatter.format(date);
}
