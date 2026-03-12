export function escapeHtml(str: string): string {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

export function $(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}
