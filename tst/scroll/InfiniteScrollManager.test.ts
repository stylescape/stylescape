// ============================================================================
// Stylescape | InfiniteScrollManager Tests
// ============================================================================
//
// NOTE on the window container: in real browsers `window instanceof Window`
// is true, so the manager reads `scrollY + innerHeight` vs `body.offsetHeight`.
// Under jsdom/vitest `window instanceof Window` is FALSE, so the manager falls
// into the element branch and reads window.scrollTop/clientHeight/scrollHeight
// (all undefined -> NaN), meaning the window path can never *fire* the callback
// in this environment. The behavioural tests therefore drive a real element
// container (where the numbers are controllable) and the window path is covered
// only for listener attach/detach. See the report for details.
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InfiniteScrollManager } from "../../src/ts/scroll/InfiniteScrollManager";

function makeScrollContainer(opts: {
    clientHeight: number;
    scrollHeight: number;
    scrollTop: number;
}): HTMLElement {
    const el = document.createElement("div");
    Object.defineProperty(el, "clientHeight", {
        value: opts.clientHeight,
        configurable: true,
    });
    Object.defineProperty(el, "scrollHeight", {
        value: opts.scrollHeight,
        configurable: true,
    });
    Object.defineProperty(el, "scrollTop", {
        value: opts.scrollTop,
        writable: true,
        configurable: true,
    });
    document.body.appendChild(el);
    return el;
}

/** A container whose scroll position is already at the threshold. */
function nearBottomContainer(): HTMLElement {
    return makeScrollContainer({
        clientHeight: 200,
        scrollHeight: 1000,
        scrollTop: 850,
    });
}

describe("InfiniteScrollManager", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("Element container", () => {
        it("fires loadMoreCallback when the threshold is reached", () => {
            const container = nearBottomContainer();
            const loadMoreCallback = vi.fn();
            new InfiniteScrollManager({
                loadMoreCallback,
                container,
                threshold: 100,
            });

            // scrollPos = 850 + 200 = 1050 >= (1000 - 100)
            container.dispatchEvent(new Event("scroll"));
            expect(loadMoreCallback).toHaveBeenCalledTimes(1);
        });

        it("does not fire when far from the bottom", () => {
            const container = makeScrollContainer({
                clientHeight: 100,
                scrollHeight: 1000,
                scrollTop: 0,
            });
            const loadMoreCallback = vi.fn();
            new InfiniteScrollManager({
                loadMoreCallback,
                container,
                threshold: 100,
            });

            // scrollPos = 0 + 100 = 100 < (1000 - 100)
            container.dispatchEvent(new Event("scroll"));
            expect(loadMoreCallback).not.toHaveBeenCalled();
        });

        it("honours a larger threshold to trigger earlier", () => {
            const container = makeScrollContainer({
                clientHeight: 100,
                scrollHeight: 1000,
                scrollTop: 500,
            });
            const loadMoreCallback = vi.fn();
            new InfiniteScrollManager({
                loadMoreCallback,
                container,
                threshold: 500,
            });

            // scrollPos = 600 >= (1000 - 500)
            container.dispatchEvent(new Event("scroll"));
            expect(loadMoreCallback).toHaveBeenCalledTimes(1);
        });

        it("uses the default threshold of 300 when omitted", () => {
            const container = makeScrollContainer({
                clientHeight: 100,
                scrollHeight: 1000,
                scrollTop: 650,
            });
            const loadMoreCallback = vi.fn();
            new InfiniteScrollManager({ loadMoreCallback, container });

            // scrollPos = 750 >= (1000 - 300)
            container.dispatchEvent(new Event("scroll"));
            expect(loadMoreCallback).toHaveBeenCalledTimes(1);
        });

        it("does not fire while paused, and resumes afterwards", () => {
            vi.useFakeTimers();
            vi.setSystemTime(1000);
            const container = nearBottomContainer();
            const loadMoreCallback = vi.fn();
            const manager = new InfiniteScrollManager({
                loadMoreCallback,
                container,
                threshold: 100,
            });

            manager.pause();
            container.dispatchEvent(new Event("scroll"));
            expect(loadMoreCallback).not.toHaveBeenCalled();

            manager.resume();
            vi.advanceTimersByTime(500);
            container.dispatchEvent(new Event("scroll"));
            expect(loadMoreCallback).toHaveBeenCalledTimes(1);
        });

        it("throttles rapid scroll events", () => {
            vi.useFakeTimers();
            vi.setSystemTime(1000);
            const container = nearBottomContainer();
            const loadMoreCallback = vi.fn();
            new InfiniteScrollManager({
                loadMoreCallback,
                container,
                threshold: 100,
                throttle: 200,
            });

            container.dispatchEvent(new Event("scroll")); // t=1000, fires
            container.dispatchEvent(new Event("scroll")); // t=1000, throttled
            expect(loadMoreCallback).toHaveBeenCalledTimes(1);

            vi.advanceTimersByTime(100);
            container.dispatchEvent(new Event("scroll")); // t=1100, throttled
            expect(loadMoreCallback).toHaveBeenCalledTimes(1);

            vi.advanceTimersByTime(150);
            container.dispatchEvent(new Event("scroll")); // t=1250, fires
            expect(loadMoreCallback).toHaveBeenCalledTimes(2);
        });

        it("stops firing after destroy", () => {
            const container = nearBottomContainer();
            const loadMoreCallback = vi.fn();
            const manager = new InfiniteScrollManager({
                loadMoreCallback,
                container,
                threshold: 100,
            });
            manager.destroy();

            container.dispatchEvent(new Event("scroll"));
            expect(loadMoreCallback).not.toHaveBeenCalled();
        });

        it("logs when the bottom is reached in debug mode", () => {
            const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
            const container = nearBottomContainer();
            new InfiniteScrollManager({
                loadMoreCallback: vi.fn(),
                container,
                threshold: 100,
                debug: true,
            });

            container.dispatchEvent(new Event("scroll"));

            expect(logSpy).toHaveBeenCalledWith(
                "InfiniteScrollManager initialized",
            );
            expect(logSpy).toHaveBeenCalledWith(
                "Reached bottom, loading more content...",
            );
            logSpy.mockRestore();
        });
    });

    describe("Window container (default)", () => {
        it("attaches a scroll listener to window and removes it on destroy", () => {
            const addSpy = vi.spyOn(window, "addEventListener");
            const removeSpy = vi.spyOn(window, "removeEventListener");

            const manager = new InfiniteScrollManager({
                loadMoreCallback: vi.fn(),
            });
            expect(addSpy).toHaveBeenCalledWith(
                "scroll",
                expect.any(Function),
            );

            manager.destroy();
            expect(removeSpy).toHaveBeenCalledWith(
                "scroll",
                expect.any(Function),
            );

            addSpy.mockRestore();
            removeSpy.mockRestore();
        });
    });
});
