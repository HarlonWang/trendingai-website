const RELEASE_API_URL = "https://api.github.com/repos/HarlonWang/TrendingAI/releases/latest";
const RELEASE_PAGE_URL = "https://github.com/HarlonWang/TrendingAI/releases";

function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "public, s-maxage=600, stale-while-revalidate=86400"
        }
    });
}

export async function onRequestGet(context) {
    try {
        const headers = {
            "accept": "application/vnd.github+json",
            "user-agent": "trendingai-website"
        };

        if (context.env.GITHUB_TOKEN) {
            headers.authorization = `Bearer ${context.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(RELEASE_API_URL, {
            headers
        });

        if (!response.ok) {
            return jsonResponse({
                ok: false,
                fallbackUrl: RELEASE_PAGE_URL,
                message: `GitHub API error: ${response.status}`
            }, 502);
        }

        const release = await response.json();
        const assets = Array.isArray(release.assets) ? release.assets : [];
        const apkAsset = assets.find((asset) => {
            return typeof asset.name === "string" && asset.name.toLowerCase().endsWith(".apk");
        });

        if (!apkAsset) {
            return jsonResponse({
                ok: false,
                fallbackUrl: release.html_url || RELEASE_PAGE_URL,
                message: "No APK asset found in latest release"
            }, 404);
        }

        return jsonResponse({
            ok: true,
            version: release.tag_name || release.name || "unknown",
            publishedAt: release.published_at || release.created_at || null,
            downloadUrl: apkAsset.browser_download_url,
            size: apkAsset.size || 0,
            digest: apkAsset.digest || "-",
            fallbackUrl: release.html_url || RELEASE_PAGE_URL
        });
    } catch (error) {
        return jsonResponse({
            ok: false,
            fallbackUrl: RELEASE_PAGE_URL,
            message: error instanceof Error ? error.message : "Unknown error"
        }, 500);
    }
}
