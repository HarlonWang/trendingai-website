import { API_BASE } from "../../config";
import type { PicksResponse } from "../../types/api";

export async function fetchPicks(): Promise<PicksResponse> {
    const res = await fetch(`${API_BASE}/api/picks?summary_lang=zh`);
    if (!res.ok) throw new Error(`Picks API error: ${res.status}`);
    return res.json();
}
