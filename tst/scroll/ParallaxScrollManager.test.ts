// ============================================================================
// Stylescape | ParallaxScrollManager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ParallaxScrollManager } from "../../src/ts/scroll/ParallaxScrollManager";

function setScrollY(y: number): void {
    Object.defineProperty(window, "scrollY", { value: y, writable: true });
}

// rAF is mocked as setTimeout(cb, 16); advance past it to flush the frame.
function flushFrame(): void {
    vi.advanceTimersByTime(20);
}

describe("ParallaxScrollManager", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        setScrollY(0);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("applies background-position based on scrollY and data-speed", () => {
        document.body.innerHTML = `<div class="parallax" data-speed="0.5"></div>`;
        const el = document.querySelector<HTMLElement>(".parallax")!;

        new ParallaxScrollManager(".parallax");
        setScrollY(100);
        window.dispatchEvent(new Event("scroll"));
        flushFrame();

        // yPos = -(100 * 0.5) = -50
        expect(el.style.backgroundPosition).toBe("center -50px");
    });

    it("uses a default speed of 0.5 when data-speed is absent", () => {
        document.body.innerHTML = `<div class="parallax"></div>`;
        const el = document.querySelector<HTMLElement>(".parallax")!;

        new ParallaxScrollManager(".parallax");
        setScrollY(200);
        window.dispatchEvent(new Event("scroll"));
        flushFrame();

        // yPos = -(200 * 0.5) = -100
        expect(el.style.backgroundPosition).toBe("center -100px");
    });

    it("respects individual per-element speeds", () => {
        document.body.innerHTML = `
            <div class="parallax" data-speed="0.2" id="slow"></div>
            <div class="parallax" data-speed="0.8" id="fast"></div>
        `;

        new ParallaxScrollManager(".parallax");
        setScrollY(100);
        window.dispatchEvent(new Event("scroll"));
        flushFrame();

        expect(
            document.getElementById("slow")!.style.backgroundPosition,
        ).toBe("center -20px");
        expect(
            document.getElementById("fast")!.style.backgroundPosition,
        ).toBe("center -80px");
    });

    it("skips elements with a non-numeric data-speed", () => {
        document.body.innerHTML = `<div class="parallax" data-speed="fast"></div>`;
        const el = document.querySelector<HTMLElement>(".parallax")!;

        new ParallaxScrollManager(".parallax");
        setScrollY(100);
        window.dispatchEvent(new Event("scroll"));
        flushFrame();

        expect(el.style.backgroundPosition).toBe("");
    });

    it("updates again on a subsequent scroll", () => {
        document.body.innerHTML = `<div class="parallax" data-speed="0.5"></div>`;
        const el = document.querySelector<HTMLElement>(".parallax")!;

        new ParallaxScrollManager(".parallax");

        setScrollY(100);
        window.dispatchEvent(new Event("scroll"));
        flushFrame();
        expect(el.style.backgroundPosition).toBe("center -50px");

        setScrollY(300);
        window.dispatchEvent(new Event("scroll"));
        flushFrame();
        expect(el.style.backgroundPosition).toBe("center -150px");
    });

    it("coalesces multiple scroll events into a single frame (ticking)", () => {
        document.body.innerHTML = `<div class="parallax" data-speed="0.5"></div>`;
        const el = document.querySelector<HTMLElement>(".parallax")!;

        new ParallaxScrollManager(".parallax");

        // First scroll schedules a frame with scrollY=100.
        setScrollY(100);
        window.dispatchEvent(new Event("scroll"));
        // A second scroll before the frame runs must NOT schedule another.
        setScrollY(400);
        window.dispatchEvent(new Event("scroll"));

        flushFrame();
        // Only one frame ran; it read the current scrollY (400) once.
        expect(el.style.backgroundPosition).toBe("center -200px");
    });

    it("stops updating after destroy", () => {
        document.body.innerHTML = `<div class="parallax" data-speed="0.5"></div>`;
        const el = document.querySelector<HTMLElement>(".parallax")!;

        const manager = new ParallaxScrollManager(".parallax");
        manager.destroy();

        setScrollY(500);
        window.dispatchEvent(new Event("scroll"));
        flushFrame();

        expect(el.style.backgroundPosition).toBe("");
    });

    it("handles an empty selector match without throwing", () => {
        expect(() => {
            const manager = new ParallaxScrollManager(".does-not-exist");
            window.dispatchEvent(new Event("scroll"));
            flushFrame();
            manager.destroy();
        }).not.toThrow();
    });
});
