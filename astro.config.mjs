import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://trendingai.cn",
    trailingSlash: "always",
    integrations: [sitemap()],
    vite: {
        plugins: [tailwindcss()]
    }
});
