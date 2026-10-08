// ============================================================================
// Stylescape | Code Block Formatter Tests
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import { CodeBlockFormatter } from "../../src/ts/content/CodeBlockFormatter";

// jsdom does no layout, so overflow is simulated by stubbing the widths.
function setWidths(el: HTMLElement, scrollWidth: number, clientWidth: number) {
    Object.defineProperty(el, "scrollWidth", { value: scrollWidth });
    Object.defineProperty(el, "clientWidth", { value: clientWidth });
}

describe("CodeBlockFormatter", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="ss-c-preview__code"><pre id="wide"><code>&lt;p&gt;wide&lt;/p&gt;</code></pre></div>
            <div class="ss-c-preview__code"><pre id="narrow"><code>&lt;p&gt;narrow&lt;/p&gt;</code></pre></div>
        `;
    });

    it("re-indents markup snippets", () => {
        document.body.innerHTML = `<div class="ss-c-preview__code"><pre><code>&lt;ul&gt;&lt;li&gt;a&lt;/li&gt;&lt;/ul&gt;</code></pre></div>`;
        CodeBlockFormatter.formatAll();
        expect(document.querySelector("code")?.textContent).toBe(
            "<ul>\n    <li>\n        a\n    </li>\n</ul>",
        );
    });

    it("gives only horizontally scrolling blocks a tab stop", () => {
        const wide = document.getElementById("wide") as HTMLElement;
        const narrow = document.getElementById("narrow") as HTMLElement;
        setWidths(wide, 800, 400);
        setWidths(narrow, 400, 400);

        CodeBlockFormatter.formatAll();

        expect(wide.getAttribute("tabindex")).toBe("0");
        expect(narrow.hasAttribute("tabindex")).toBe(false);
    });

    it("keeps an existing tabindex", () => {
        const wide = document.getElementById("wide") as HTMLElement;
        wide.setAttribute("tabindex", "-1");
        setWidths(wide, 800, 400);

        CodeBlockFormatter.formatAll();

        expect(wide.getAttribute("tabindex")).toBe("-1");
    });
});
