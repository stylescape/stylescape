// ============================================================================
// Stylescape | Content Revealer Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContentRevealer } from "../../src/ts/animations/ContentRevealer";

describe("ContentRevealer", () => {
    let revealer: ContentRevealer | undefined;

    afterEach(() => {
        if (revealer) {
            revealer.destroy();
            revealer = undefined;
        }
        vi.useRealTimers();
    });

    // ------------------------------------------------------------------
    // Construction / input normalization
    // ------------------------------------------------------------------
    describe("Construction", () => {
        it("resolves a CSS selector string to matching elements", () => {
            document.body.innerHTML = `
                <div class="hidden">a</div>
                <div class="hidden">b</div>
                <div class="other">c</div>
            `;
            revealer = new ContentRevealer(".hidden");
            const targets = Array.from(
                document.querySelectorAll<HTMLElement>(".hidden"),
            );
            // Both matched elements received the initial hidden state.
            targets.forEach((el) => expect(el.style.opacity).toBe("0"));
            const other = document.querySelector<HTMLElement>(".other")!;
            expect(other.style.opacity).toBe("");
        });

        it("accepts a single HTMLElement", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            revealer = new ContentRevealer(el);
            expect(el.style.opacity).toBe("0");
        });

        it("accepts an array of HTMLElements", () => {
            const a = document.createElement("div");
            const b = document.createElement("div");
            document.body.append(a, b);
            revealer = new ContentRevealer([a, b]);
            expect(a.style.opacity).toBe("0");
            expect(b.style.opacity).toBe("0");
        });

        it("accepts a NodeList", () => {
            document.body.innerHTML = `<p class="x"></p><p class="x"></p>`;
            const nodes = document.querySelectorAll<HTMLElement>(".x");
            revealer = new ContentRevealer(nodes);
            nodes.forEach((el) => expect(el.style.opacity).toBe("0"));
        });

        it("does not throw when the selector matches nothing", () => {
            expect(() => {
                revealer = new ContentRevealer(".does-not-exist");
            }).not.toThrow();
        });
    });

    // ------------------------------------------------------------------
    // Initial hidden state & options parsing
    // ------------------------------------------------------------------
    describe("Initial state and options", () => {
        it("applies the default initial opacity of 0 and a transition", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            revealer = new ContentRevealer(el);
            expect(el.style.opacity).toBe("0");
            expect(el.style.transition).toContain("opacity");
            expect(el.style.transition).toContain("500ms");
            expect(el.style.transition).toContain("ease");
        });

        it("honors a custom initialOpacity", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            revealer = new ContentRevealer(el, { initialOpacity: 0.25 });
            expect(el.style.opacity).toBe("0.25");
        });

        it("reflects custom duration and easing in the transition", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            revealer = new ContentRevealer(el, {
                duration: 800,
                easing: "ease-in-out",
            });
            expect(el.style.transition).toContain("800ms");
            expect(el.style.transition).toContain("ease-in-out");
        });
    });

    // ------------------------------------------------------------------
    // reveal / hide
    // ------------------------------------------------------------------
    describe("reveal / hide", () => {
        let el: HTMLElement;

        beforeEach(() => {
            el = document.createElement("div");
            document.body.appendChild(el);
            revealer = new ContentRevealer(el);
        });

        it("reveal() sets opacity to 1, adds the class and marks revealed", () => {
            revealer!.reveal(el);
            expect(el.style.opacity).toBe("1");
            expect(el.classList.contains("reveal--visible")).toBe(true);
            expect(el.getAttribute("data-ss-reveal-revealed")).toBe("true");
        });

        it("hide() restores the initial opacity and clears reveal markers", () => {
            revealer!.reveal(el);
            revealer!.hide(el);
            expect(el.style.opacity).toBe("0");
            expect(el.classList.contains("reveal--visible")).toBe(false);
            expect(el.hasAttribute("data-ss-reveal-revealed")).toBe(false);
        });

        it("hide() restores a custom initial opacity", () => {
            revealer!.destroy();
            revealer = new ContentRevealer(el, { initialOpacity: 0.3 });
            revealer.reveal(el);
            revealer.hide(el);
            expect(el.style.opacity).toBe("0.3");
        });
    });

    describe("revealAll / hideAll", () => {
        it("reveals and hides every managed element", () => {
            document.body.innerHTML = `<div class="r"></div><div class="r"></div>`;
            const els = Array.from(
                document.querySelectorAll<HTMLElement>(".r"),
            );
            revealer = new ContentRevealer(els);

            revealer.revealAll();
            els.forEach((el) => {
                expect(el.style.opacity).toBe("1");
                expect(el.classList.contains("reveal--visible")).toBe(true);
            });

            revealer.hideAll();
            els.forEach((el) => {
                expect(el.style.opacity).toBe("0");
                expect(el.classList.contains("reveal--visible")).toBe(false);
            });
        });
    });

    // ------------------------------------------------------------------
    // Load-triggered reveal (default path, readyState === "complete")
    // ------------------------------------------------------------------
    describe("Load-triggered reveal", () => {
        it("reveals after the configured delay once loaded", () => {
            vi.useFakeTimers();
            const el = document.createElement("div");
            document.body.appendChild(el);
            revealer = new ContentRevealer(el, { delay: 300 });

            // Not revealed synchronously.
            expect(el.style.opacity).toBe("0");
            expect(el.classList.contains("reveal--visible")).toBe(false);

            // Still hidden before the delay elapses.
            vi.advanceTimersByTime(299);
            expect(el.style.opacity).toBe("0");

            // Revealed once the delay passes.
            vi.advanceTimersByTime(1);
            expect(el.style.opacity).toBe("1");
            expect(el.classList.contains("reveal--visible")).toBe(true);
        });
    });

    // ------------------------------------------------------------------
    // Scroll-triggered reveal (IntersectionObserver)
    // ------------------------------------------------------------------
    describe("Scroll-triggered reveal", () => {
        interface Entry {
            isIntersecting: boolean;
            target: Element;
        }
        let observers: TestIntersectionObserver[] = [];

        class TestIntersectionObserver {
            callback: (entries: Entry[]) => void;
            options: { threshold?: number };
            observed: Element[] = [];
            unobserved: Element[] = [];
            disconnected = false;

            constructor(
                cb: (entries: Entry[]) => void,
                options: { threshold?: number },
            ) {
                this.callback = cb;
                this.options = options;
                observers.push(this);
            }

            observe = (el: Element) => {
                this.observed.push(el);
            };
            unobserve = (el: Element) => {
                this.unobserved.push(el);
            };
            disconnect = () => {
                this.disconnected = true;
            };
            trigger(entries: Entry[]) {
                this.callback(entries);
            }
        }

        beforeEach(() => {
            observers = [];
            vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
        });

        it("observes each element and passes the threshold option", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            revealer = new ContentRevealer(el, {
                onScroll: true,
                threshold: 0.5,
            });

            expect(observers).toHaveLength(1);
            expect(observers[0].observed).toContain(el);
            expect(observers[0].options.threshold).toBe(0.5);
        });

        it("reveals and unobserves an element when it intersects", () => {
            vi.useFakeTimers();
            const el = document.createElement("div");
            document.body.appendChild(el);
            revealer = new ContentRevealer(el, {
                onScroll: true,
                delay: 100,
            });

            observers[0].trigger([{ isIntersecting: true, target: el }]);
            expect(observers[0].unobserved).toContain(el);

            // Reveal itself is deferred by the delay.
            expect(el.style.opacity).toBe("0");
            vi.advanceTimersByTime(100);
            expect(el.style.opacity).toBe("1");
            expect(el.classList.contains("reveal--visible")).toBe(true);
        });

        it("ignores entries that are not intersecting", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            revealer = new ContentRevealer(el, { onScroll: true });

            observers[0].trigger([{ isIntersecting: false, target: el }]);
            expect(el.style.opacity).toBe("0");
            expect(observers[0].unobserved).not.toContain(el);
        });

        it("destroy() disconnects the observer", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            revealer = new ContentRevealer(el, { onScroll: true });

            const observer = observers[0];
            revealer.destroy();
            revealer = undefined; // prevent double destroy in afterEach
            expect(observer.disconnected).toBe(true);
        });
    });

    describe("destroy", () => {
        it("is safe to call when no observer exists", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            const r = new ContentRevealer(el);
            expect(() => r.destroy()).not.toThrow();
        });
    });
});
