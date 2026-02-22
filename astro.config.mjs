import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://trendingai.cn",
    trailingSlash: "always",
    integrations: [sitemap()]
});
