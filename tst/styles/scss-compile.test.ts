// ============================================================================
// Stylescape | SCSS compile checks
// ============================================================================
// Compiles the full entry once and asserts the selectors and declarations that
// the decisions in TODO.md / CHANGELOG.md promise.
// ============================================================================

import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import * as sass from "sass";

const root = path.resolve(__dirname, "../..");
let css = "";

/** Declarations of every rule whose selector list includes `selector`. */
function rule(selector: string): string {
    const re = new RegExp(
        `(?:^|\\n)\\s*([^{}]*?(?:^|[\\s,>+~])${selector.replace(/[.[\]()*+?^$|\\]/g, "\\$&")}(?![\\w-])[^{}]*)\\{([^{}]*)\\}`,
        "g",
    );
    const bodies = [...css.matchAll(re)].map((m) => m[2]);
    if (bodies.length === 0) throw new Error(`no rule for ${selector}`);
    return bodies.join("\n");
}

function has(selector: string): boolean {
    return css.includes(selector);
}

describe("stylescape SCSS", () => {
    beforeAll(() => {
        css = sass.compile(path.join(root, "src/scss/index.scss"), {
            importers: [new sass.NodePackageImporter(root)],
            quietDeps: true,
            silenceDeprecations: ["import", "global-builtin"],
        }).css;
    }, 60000);

    it("app sidebar has no padding by default and a --padded modifier", () => {
        expect(rule(".ss-l-app__sidebar")).not.toMatch(/padding/);
        expect(rule(".ss-l-app__sidebar--padded")).toMatch(
            /padding:\s*var\(--ss-space-4\)/,
        );
    });

    it("segmented has a link variant keyed on aria-current", () => {
        expect(has(".ss-c-segmented__link")).toBe(true);
        expect(has('.ss-c-segmented__link[aria-current]')).toBe(true);
        expect(rule(".ss-c-segmented__link")).toMatch(
            /text-decoration:\s*none/,
        );
    });

    it("toast styles the parts NotificationManager builds", () => {
        for (const part of [
            "__icon",
            "__message",
            "__action",
            "__progress",
            "__progress-bar",
        ]) {
            expect(has(`.ss-c-toast${part}`), part).toBe(true);
        }
        expect(has('.ss-c-toast[data-state=entering]')).toBe(true);
        expect(has('.ss-c-toast-region[data-position=top-center]')).toBe(true);
        expect(css).not.toContain("ss-notification");
    });

    it("underscore part names are BEM, with 0.3 aliases in ss.compat", () => {
        for (const bem of [
            ".ss-c-accordion__group",
            ".ss-c-accordion__group--flush",
            ".ss-c-toggle__button-group",
            ".ss-c-toggle__button",
            ".ss-c-spacer--divider",
            ".ss-c-graphic--no-margins",
        ]) {
            expect(has(bem), bem).toBe(true);
        }
        // The aliases exist, but only inside the compat layer.
        const compatStart = css.indexOf("@layer ss.compat {");
        const moduleCss = css.slice(0, compatStart);
        for (const alias of [
            ".ss-c-accordion_group",
            ".ss-c-toggle_button_group",
            ".ss-c-spacer_divider",
            ".ss-c-graphic_no-margins",
            ".ss-c-select.ss-c-error",
            ".ss-c-select.ss-c-success",
        ]) {
            expect(css.includes(alias), alias).toBe(true);
            expect(moduleCss.includes(alias), `${alias} outside compat`).toBe(
                false,
            );
        }
    });

    it("compat shims read tokens, not hex colours", () => {
        for (const sel of [
            ".ss-c-cta",
            ".ss-c-blockquote",
            ".ss-c-prose",
            ".ss-c-stat-card__value",
            ".ss-c-timeline",
            ".ss-c-timeline-marker",
        ]) {
            const body = rule(sel);
            expect(body, sel).not.toMatch(/#[0-9a-f]{3,8}\b/i);
        }
        expect(rule(".ss-c-cta")).toMatch(/var\(--ss-color-background\)/);
        expect(rule(".ss-c-hero")).toMatch(/min-height:\s*100svh/);
        // The prose shim no longer resets heading sizes to `unset`.
        expect(rule(".ss-c-prose h2")).not.toMatch(/unset/);
    });
});
