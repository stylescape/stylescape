// ============================================================================
// Stylescape | Progress Bar Manager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProgressBarManager } from "../../src/ts/animations/ProgressBarManager";

const withBar = () =>
    `<div id="pb"><div class="progress__bar"></div></div>`;

describe("ProgressBarManager", () => {
    let manager: ProgressBarManager | undefined;

    const build = (html: string = withBar()): HTMLElement => {
        document.body.innerHTML = html;
        return document.getElementById("pb") as HTMLElement;
    };

    afterEach(() => {
        if (manager) {
            manager.destroy();
            manager = undefined;
        }
    });

    // ------------------------------------------------------------------
    // Construction & init
    // ------------------------------------------------------------------
    describe("Construction", () => {
        it("resolves a CSS selector", () => {
            build();
            manager = new ProgressBarManager("#pb");
            expect(manager.getProgress()).toBe(0);
        });

        it("accepts an HTMLElement reference", () => {
            const el = build();
            manager = new ProgressBarManager(el);
            expect(manager.getProgress()).toBe(0);
        });

        it("warns when the element is missing", () => {
            const warn = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            manager = new ProgressBarManager("#nope");
            expect(warn).toHaveBeenCalledWith(
                "[Stylescape] ProgressBarManager element not found",
            );
            warn.mockRestore();
        });

        it("sets progressbar ARIA attributes on init", () => {
            const el = build();
            manager = new ProgressBarManager(el, { min: 0, max: 200 });
            expect(el.getAttribute("role")).toBe("progressbar");
            expect(el.getAttribute("aria-valuemin")).toBe("0");
            expect(el.getAttribute("aria-valuemax")).toBe("200");
        });

        it("applies the initial value on init", () => {
            const el = build();
            manager = new ProgressBarManager(el, { value: 40 });
            const bar = el.querySelector<HTMLElement>(".progress__bar")!;
            expect(manager.getProgress()).toBe(40);
            expect(bar.style.width).toBe("40%");
            expect(el.getAttribute("aria-valuenow")).toBe("40");
            expect(el.getAttribute("data-progress")).toBe("40");
        });
    });

    // ------------------------------------------------------------------
    // Bar resolution
    // ------------------------------------------------------------------
    describe("Bar element resolution", () => {
        it("animates a child element whose class contains 'bar'", () => {
            const el = build();
            const bar = el.querySelector<HTMLElement>(".progress__bar")!;
            manager = new ProgressBarManager(el);
            manager.setProgress(50);
            expect(bar.style.width).toBe("50%");
            // The container itself is not resized.
            expect(el.style.width).toBe("");
        });

        it("falls back to the element itself when no bar child exists", () => {
            const el = build(`<div id="pb"></div>`);
            manager = new ProgressBarManager(el);
            manager.setProgress(75);
            expect(el.style.width).toBe("75%");
        });
    });

    // ------------------------------------------------------------------
    // setProgress
    // ------------------------------------------------------------------
    describe("setProgress", () => {
        let el: HTMLElement;
        let bar: HTMLElement;

        beforeEach(() => {
            el = build();
            bar = el.querySelector<HTMLElement>(".progress__bar")!;
            manager = new ProgressBarManager(el);
        });

        it("updates value, bar width, aria-valuenow and data-progress", () => {
            manager!.setProgress(30);
            expect(manager!.getProgress()).toBe(30);
            expect(bar.style.width).toBe("30%");
            expect(el.getAttribute("aria-valuenow")).toBe("30");
            expect(el.getAttribute("data-progress")).toBe("30");
        });

        it("clamps values above the maximum", () => {
            manager!.setProgress(150);
            expect(manager!.getProgress()).toBe(100);
            expect(bar.style.width).toBe("100%");
        });

        it("clamps values below the minimum", () => {
            manager!.setProgress(-20);
            expect(manager!.getProgress()).toBe(0);
            expect(bar.style.width).toBe("0%");
        });

        it("rounds the data-progress attribute", () => {
            manager!.destroy();
            el = build();
            manager = new ProgressBarManager(el, { min: 0, max: 3 });
            manager.setProgress(1); // 33.333...%
            expect(el.getAttribute("data-progress")).toBe("33");
        });
    });

    // ------------------------------------------------------------------
    // Percentage across custom ranges
    // ------------------------------------------------------------------
    describe("Custom min/max range", () => {
        it("computes the percentage relative to the range", () => {
            const el = build();
            const bar = el.querySelector<HTMLElement>(".progress__bar")!;
            manager = new ProgressBarManager(el, { min: 0, max: 200 });
            manager.setProgress(50);
            expect(manager.getProgress()).toBe(50);
            expect(manager.getPercentage()).toBe(25);
            expect(bar.style.width).toBe("25%");
            expect(el.getAttribute("aria-valuenow")).toBe("50");
            expect(el.getAttribute("data-progress")).toBe("25");
        });
    });

    // ------------------------------------------------------------------
    // increment / decrement / reset / complete
    // ------------------------------------------------------------------
    describe("Value helpers", () => {
        let el: HTMLElement;

        beforeEach(() => {
            el = build();
            manager = new ProgressBarManager(el, { value: 50 });
        });

        it("increment() raises the value (default step 1)", () => {
            manager!.increment();
            expect(manager!.getProgress()).toBe(51);
            manager!.increment(9);
            expect(manager!.getProgress()).toBe(60);
        });

        it("decrement() lowers the value", () => {
            manager!.decrement(20);
            expect(manager!.getProgress()).toBe(30);
        });

        it("reset() returns to the minimum", () => {
            manager!.reset();
            expect(manager!.getProgress()).toBe(0);
        });

        it("complete() jumps to the maximum", () => {
            manager!.complete();
            expect(manager!.getProgress()).toBe(100);
            expect(manager!.getPercentage()).toBe(100);
        });
    });

    // ------------------------------------------------------------------
    // Callbacks
    // ------------------------------------------------------------------
    describe("Callbacks", () => {
        it("onChange fires with value and percentage", () => {
            const onChange = vi.fn();
            const el = build();
            manager = new ProgressBarManager(el, { min: 0, max: 200, onChange });
            onChange.mockClear(); // ignore the init call
            manager.setProgress(50);
            expect(onChange).toHaveBeenCalledWith(50, 25);
        });

        it("onComplete fires only when reaching 100%", () => {
            const onComplete = vi.fn();
            const el = build();
            manager = new ProgressBarManager(el, { onComplete });
            manager.setProgress(99);
            expect(onComplete).not.toHaveBeenCalled();
            manager.setProgress(100);
            expect(onComplete).toHaveBeenCalledTimes(1);
        });

        it("onComplete fires at max for a custom range", () => {
            const onComplete = vi.fn();
            const el = build();
            manager = new ProgressBarManager(el, { max: 50, onComplete });
            manager.complete();
            expect(onComplete).toHaveBeenCalledTimes(1);
        });
    });

    // ------------------------------------------------------------------
    // Animation option / custom property
    // ------------------------------------------------------------------
    describe("Animation and custom property", () => {
        it("sets a CSS transition on the bar when animate is enabled", () => {
            const el = build();
            const bar = el.querySelector<HTMLElement>(".progress__bar")!;
            manager = new ProgressBarManager(el, {
                animate: true,
                animationDuration: 500,
            });
            expect(bar.style.transition).toContain("width");
            expect(bar.style.transition).toContain("500ms");
        });

        it("omits the transition when animate is disabled", () => {
            const el = build();
            const bar = el.querySelector<HTMLElement>(".progress__bar")!;
            manager = new ProgressBarManager(el, { animate: false });
            expect(bar.style.transition).toBe("");
        });

        it("animates a custom CSS property", () => {
            const el = build();
            const bar = el.querySelector<HTMLElement>(".progress__bar")!;
            manager = new ProgressBarManager(el, { property: "height" });
            manager.setProgress(60);
            expect(bar.style.height).toBe("60%");
            expect(bar.style.width).toBe("");
        });
    });

    // ------------------------------------------------------------------
    // Indeterminate
    // ------------------------------------------------------------------
    describe("setIndeterminate", () => {
        it("adds the indeterminate class and drops aria-valuenow", () => {
            const el = build();
            manager = new ProgressBarManager(el, { value: 40 });
            expect(el.getAttribute("aria-valuenow")).toBe("40");

            manager.setIndeterminate(true);
            expect(el.classList.contains("progress--indeterminate")).toBe(true);
            expect(el.hasAttribute("aria-valuenow")).toBe(false);

            manager.setIndeterminate(false);
            expect(el.classList.contains("progress--indeterminate")).toBe(
                false,
            );
        });

        it("is a no-op after destroy", () => {
            const el = build();
            manager = new ProgressBarManager(el);
            manager.destroy();
            expect(() => manager!.setIndeterminate(true)).not.toThrow();
            expect(el.classList.contains("progress--indeterminate")).toBe(
                false,
            );
            manager = undefined;
        });
    });

    // ------------------------------------------------------------------
    // destroy
    // ------------------------------------------------------------------
    describe("destroy", () => {
        it("detaches references and stops mutating the DOM", () => {
            const el = build();
            const bar = el.querySelector<HTMLElement>(".progress__bar")!;
            manager = new ProgressBarManager(el, { value: 10 });
            manager.destroy();

            manager.setProgress(90);
            // currentValue still tracks, but the DOM is untouched.
            expect(manager.getProgress()).toBe(90);
            expect(bar.style.width).toBe("10%");
            expect(el.getAttribute("aria-valuenow")).toBe("10");
            manager = undefined;
        });
    });
});
