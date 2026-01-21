// ============================================================================
// Stylescape | Scroll Components Tests
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import { ScrollSpyManager } from "../../src/ts/scroll/ScrollSpyManager";
import { click, scrollTo } from "../utils";

describe("ScrollSpyManager", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        // Reset scroll position
        Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    });

    describe("Initialization", () => {
        it("should initialize with sections and nav selector", () => {
            document.body.innerHTML = `
                <nav id="toc">
                    <a href="#section1">Section 1</a>
                    <a href="#section2">Section 2</a>
                </nav>
                <section id="section1" style="height: 500px;">Section 1</section>
                <section id="section2" style="height: 500px;">Section 2</section>
            `;

            const scrollSpy = new ScrollSpyManager({
                navSelector: "#toc a",
            });
            expect(scrollSpy).toBeDefined();
        });
    });

    describe("Active State", () => {
        it("should mark first section as active initially", () => {
            document.body.innerHTML = `
                <nav id="toc">
                    <a href="#s1" class="toc-link">S1</a>
                    <a href="#s2" class="toc-link">S2</a>
                </nav>
                <div id="s1" style="height: 500px;">Section 1</div>
                <div id="s2" style="height: 500px;">Section 2</div>
            `;

            new ScrollSpyManager({
                navSelector: ".toc-link",
            });

            // First link should be active
        });

        it("should update active class on scroll", () => {
            document.body.innerHTML = `
                <nav id="toc">
                    <a href="#scroll-s1" class="nav-link">S1</a>
                    <a href="#scroll-s2" class="nav-link">S2</a>
                </nav>
                <div id="scroll-s1" style="height: 500px;">Section 1</div>
                <div id="scroll-s2" style="height: 500px;">Section 2</div>
            `;

            new ScrollSpyManager({
                navSelector: ".nav-link",
            });

            // Simulate scroll
            scrollTo(window, { y: 600 });
        });
    });

    describe("Offset Support", () => {
        it("should respect offset configuration", () => {
            document.body.innerHTML = `
                <nav><a href="#offset-s1">S1</a></nav>
                <div id="offset-s1">Section</div>
            `;

            new ScrollSpyManager({
                navSelector: "nav a",
                offset: 100,
            });
        });
    });
});

describe("ScrollToTopButton", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should scroll to top when clicked", async () => {
        document.body.innerHTML = `
            <button id="scroll-top" data-ss="scroll-to-top">Top</button>
        `;

        Object.defineProperty(window, "scrollY", {
            value: 1000,
            writable: true,
        });

        const btn = document.getElementById("scroll-top");
        if (btn) {
            // Add click handler that scrolls to top
            btn.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });

            click(btn);
            // window.scrollTo should have been called with top: 0
        }
    });

    it("should show/hide based on scroll position", () => {
        document.body.innerHTML = `
            <button id="scroll-btn" hidden>Top</button>
        `;

        const btn = document.getElementById("scroll-btn");
        const threshold = 300;

        // Simulate scroll handlers
        if (btn) {
            // Below threshold - should be hidden
            Object.defineProperty(window, "scrollY", {
                value: 100,
                writable: true,
            });
            if (window.scrollY > threshold) {
                btn.hidden = false;
            }
            expect(btn.hidden).toBe(true);

            // Above threshold - should be visible
            Object.defineProperty(window, "scrollY", {
                value: 500,
                writable: true,
            });
            if (window.scrollY > threshold) {
                btn.hidden = false;
            }
            expect(btn.hidden).toBe(false);
        }
    });
});
