// ============================================================================
// Stylescape | ActiveLinkHighlighter Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ActiveLinkHighlighter } from "../../src/ts/content/ActiveLinkHighlighter";
import { appendToBody, createElement } from "../utils";

/**
 * Set the current jsdom location (path + optional query) without triggering
 * a real navigation. Uses the History API which jsdom implements.
 */
function setLocation(pathAndQuery: string): void {
    history.pushState(null, "", pathAndQuery);
}

/** Convenience: create a real anchor and append it to <body>. */
function anchor(href: string | null, text = "link"): HTMLAnchorElement {
    const a = document.createElement("a");
    if (href !== null) a.setAttribute("href", href);
    a.textContent = text;
    return appendToBody(a);
}

describe("ActiveLinkHighlighter", () => {
    beforeEach(() => {
        setLocation("/");
    });

    afterEach(() => {
        // Reset location so tests don't leak into one another.
        setLocation("/");
    });

    describe("construction", () => {
        it("highlights matching links immediately on construction", () => {
            setLocation("/team/about");
            const match = anchor("/team/about");
            const other = anchor("/team/contact");

            new ActiveLinkHighlighter();

            expect(match.classList.contains("active")).toBe(true);
            expect(other.classList.contains("active")).toBe(false);
        });

        it("applies the default class name 'active'", () => {
            setLocation("/home");
            const link = anchor("/home");

            new ActiveLinkHighlighter();

            expect(link.classList.contains("active")).toBe(true);
        });

        it("applies a custom class name when provided", () => {
            setLocation("/home");
            const link = anchor("/home");

            new ActiveLinkHighlighter("nav-current");

            expect(link.classList.contains("nav-current")).toBe(true);
            expect(link.classList.contains("active")).toBe(false);
        });
    });

    describe("URL normalization", () => {
        it("treats a link with a trailing slash as matching one without", () => {
            setLocation("/docs");
            const link = anchor("/docs/");

            new ActiveLinkHighlighter();

            expect(link.classList.contains("active")).toBe(true);
        });

        it("matches the root path", () => {
            setLocation("/");
            const link = anchor("/");

            new ActiveLinkHighlighter();

            expect(link.classList.contains("active")).toBe(true);
        });

        it("includes query parameters when matching", () => {
            setLocation("/search?q=hello");
            const same = anchor("/search?q=hello");
            const differentQuery = anchor("/search?q=world");
            const noQuery = anchor("/search");

            new ActiveLinkHighlighter();

            expect(same.classList.contains("active")).toBe(true);
            expect(differentQuery.classList.contains("active")).toBe(false);
            expect(noQuery.classList.contains("active")).toBe(false);
        });

        it("does not highlight links to different paths", () => {
            setLocation("/products");
            const link = anchor("/services");

            new ActiveLinkHighlighter();

            expect(link.classList.contains("active")).toBe(false);
        });

        it("highlights every matching link on the page", () => {
            setLocation("/blog");
            const a1 = anchor("/blog");
            const a2 = anchor("/blog/");
            const a3 = anchor("/about");

            new ActiveLinkHighlighter();

            expect(a1.classList.contains("active")).toBe(true);
            expect(a2.classList.contains("active")).toBe(true);
            expect(a3.classList.contains("active")).toBe(false);
        });
    });

    describe("skip rules", () => {
        it("skips links inside a .ribbon__title even when they match", () => {
            setLocation("/home");
            const wrapper = createElement<HTMLDivElement>(
                `<div class="ribbon__title"></div>`,
            );
            const link = document.createElement("a");
            link.setAttribute("href", "/home");
            wrapper.appendChild(link);
            appendToBody(wrapper);

            new ActiveLinkHighlighter();

            expect(link.classList.contains("active")).toBe(false);
        });

        it("skips links without an href attribute", () => {
            setLocation("/");
            const link = anchor(null, "no href");

            expect(() => new ActiveLinkHighlighter()).not.toThrow();
            expect(link.classList.contains("active")).toBe(false);
        });

        it("skips links with an empty href attribute", () => {
            setLocation("/something");
            const link = anchor("");

            new ActiveLinkHighlighter();

            expect(link.classList.contains("active")).toBe(false);
        });
    });
});
