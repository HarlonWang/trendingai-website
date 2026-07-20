import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://trendingai.cn",
    trailingSlash: "always",
    i18n: {
        locales: ["en", "zh"],
        defaultLocale: "en",
        routing: {
            prefixDefaultLocale: false,
            fallbackType: "rewrite",
        },
        fallback: { zh: "en" },
    },
    integrations: [
        sitemap({
            i18n: {
                defaultLocale: "en",
                locales: { en: "en", zh: "zh-CN" },
            },
        }),
    ],
    vite: {
        plugins: [tailwindcss()]
    }
});
