// ============================================================================
// Stylescape | ScrollPageManager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollPageManager } from "../../src/ts/scroll/ScrollPageManager";

function setScrollY(y: number): void {
    Object.defineProperty(window, "scrollY", { value: y, writable: true });
}

describe("ScrollPageManager", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        sessionStorage.clear();
        setScrollY(0);
    });

    afterEach(() => {
        vi.useRealTimers();
        sessionStorage.clear();
    });

    describe("Restoring on load", () => {
        it("restores the saved scroll position and clears storage", () => {
            sessionStorage.setItem("scrollpos", "300");
            new ScrollPageManager();

            window.dispatchEvent(new Event("load"));

            expect(window.scrollTo).toHaveBeenCalledWith(0, 300);
            expect(sessionStorage.getItem("scrollpos")).toBeNull();
        });

        it("does nothing on load when no position was stored", () => {
            new ScrollPageManager();
            window.dispatchEvent(new Event("load"));
            expect(window.scrollTo).not.toHaveBeenCalled();
        });
    });

    describe("Saving on beforeunload", () => {
        it("writes the current scrollY to sessionStorage", () => {
            new ScrollPageManager();
            setScrollY(540);

            window.dispatchEvent(new Event("beforeunload"));

            expect(sessionStorage.getItem("scrollpos")).toBe("540");
        });
    });

    describe("Debounced saving on scroll", () => {
        it("saves only after the 200ms debounce elapses", () => {
            vi.useFakeTimers();
            new ScrollPageManager();
            setScrollY(420);

            window.dispatchEvent(new Event("scroll"));
            // Nothing written before the debounce window closes.
            expect(sessionStorage.getItem("scrollpos")).toBeNull();

            vi.advanceTimersByTime(200);
            expect(sessionStorage.getItem("scrollpos")).toBe("420");
        });

        it("resets the debounce timer on rapid consecutive scrolls", () => {
            vi.useFakeTimers();
            new ScrollPageManager();

            setScrollY(100);
            window.dispatchEvent(new Event("scroll"));
            vi.advanceTimersByTime(150);
            // Second scroll before the first timer fires resets the countdown.
            setScrollY(999);
            window.dispatchEvent(new Event("scroll"));
            vi.advanceTimersByTime(150);
            expect(sessionStorage.getItem("scrollpos")).toBeNull();

            vi.advanceTimersByTime(50);
            expect(sessionStorage.getItem("scrollpos")).toBe("999");
        });
    });
});
