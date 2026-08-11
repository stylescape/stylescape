// ============================================================================
// Stylescape | Scroll Utilities Tests
// ============================================================================

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import scrollDefault, {
    initScrollLinks,
    initScrollUtilities,
    ScrollToTopButton,
    scrollTo,
    scrollToBottom,
    scrollToPosition,
    scrollToTop,
} from "../../src/ts/interface/scroll";
import { click } from "../utils";

// Force document.documentElement.scrollTop (used by ScrollToTopButton.checkScroll)
function setScrollTop(y: number): void {
    Object.defineProperty(document.documentElement, "scrollTop", {
        value: y,
        writable: true,
        configurable: true,
    });
}

describe("scroll utilities", () => {
    let scrollToSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // window.scrollTo is mocked in setup; grab a typed handle
        scrollToSpy = window.scrollTo as unknown as ReturnType<typeof vi.fn>;
        setScrollTop(0);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ------------------------------------------------------------------
    // scrollTo()
    // ------------------------------------------------------------------
    describe("scrollTo", () => {
        it("animates towards a numeric target and fires onComplete", async () => {
            vi.useFakeTimers();
            const onComplete = vi.fn();

            scrollTo(300, { duration: 100, onComplete });
            // Nothing runs until rAF (mocked as setTimeout 16ms) fires
            await vi.advanceTimersByTimeAsync(500);

            expect(scrollToSpy).toHaveBeenCalled();
            // The animation always calls window.scrollTo(x, y) with numbers
            const lastCall = scrollToSpy.mock.calls.at(-1)!;
            expect(typeof lastCall[0]).toBe("number");
            expect(typeof lastCall[1]).toBe("number");
            expect(onComplete).toHaveBeenCalledTimes(1);
        });

        it("resolves a string selector to an element", async () => {
            vi.useFakeTimers();
            const target = document.createElement("div");
            target.id = "target";
            document.body.appendChild(target);

            scrollTo("#target", { duration: 50 });
            await vi.advanceTimersByTimeAsync(200);

            expect(scrollToSpy).toHaveBeenCalled();
        });

        it("accepts an element reference directly", async () => {
            vi.useFakeTimers();
            const target = document.createElement("div");
            document.body.appendChild(target);

            scrollTo(target, { duration: 50 });
            await vi.advanceTimersByTimeAsync(200);

            expect(scrollToSpy).toHaveBeenCalled();
        });

        it("warns and does not animate for an unknown selector", async () => {
            vi.useFakeTimers();
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

            scrollTo("#missing");
            await vi.advanceTimersByTimeAsync(200);

            expect(warn).toHaveBeenCalledWith(
                "[Stylescape] scrollTo target not found:",
                "#missing",
            );
            expect(scrollToSpy).not.toHaveBeenCalled();
            warn.mockRestore();
        });

        it("applies the requested easing without error", async () => {
            vi.useFakeTimers();
            const onComplete = vi.fn();
            scrollTo(200, { duration: 40, easing: "linear", onComplete });
            await vi.advanceTimersByTimeAsync(200);
            expect(onComplete).toHaveBeenCalledTimes(1);
        });
    });

    // ------------------------------------------------------------------
    // scrollToPosition()
    // ------------------------------------------------------------------
    describe("scrollToPosition", () => {
        it("jumps instantly with behavior 'auto' by default", () => {
            scrollToPosition(120);
            expect(scrollToSpy).toHaveBeenCalledWith({
                top: 120,
                behavior: "auto",
            });
        });

        it("uses smooth behavior when smooth is set without a duration", () => {
            scrollToPosition(120, { smooth: true });
            expect(scrollToSpy).toHaveBeenCalledWith({
                top: 120,
                behavior: "smooth",
            });
        });

        it("delegates to the animation when smooth and duration are set", async () => {
            vi.useFakeTimers();
            scrollToPosition(120, { smooth: true, duration: 60 });
            await vi.advanceTimersByTimeAsync(200);

            // Animation path calls window.scrollTo with positional numbers,
            // never the { top, behavior } object form
            expect(scrollToSpy).toHaveBeenCalled();
            const objectCalls = scrollToSpy.mock.calls.filter(
                (c) => typeof c[0] === "object",
            );
            expect(objectCalls).toHaveLength(0);
        });
    });

    // ------------------------------------------------------------------
    // scrollToTop() / scrollToBottom()
    // ------------------------------------------------------------------
    describe("scrollToTop / scrollToBottom", () => {
        it("scrollToTop scrolls to y = 0", () => {
            scrollToTop();
            expect(scrollToSpy).toHaveBeenCalledWith({
                top: 0,
                behavior: "auto",
            });
        });

        it("scrollToBottom scrolls to the document height", () => {
            scrollToBottom();
            expect(scrollToSpy).toHaveBeenCalledTimes(1);
            const arg = scrollToSpy.mock.calls[0][0];
            expect(typeof arg.top).toBe("number");
        });
    });

    // ------------------------------------------------------------------
    // ScrollToTopButton
    // ------------------------------------------------------------------
    describe("ScrollToTopButton", () => {
        it("warns when no button is provided", () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
            new ScrollToTopButton();
            expect(warn).toHaveBeenCalledWith(
                "[Stylescape] ScrollToTopButton: button not found",
            );
            warn.mockRestore();
        });

        it("sets a default aria-label and starts hidden", () => {
            const btn = document.createElement("button");
            document.body.appendChild(btn);

            new ScrollToTopButton({ button: btn, threshold: 300 });

            expect(btn.getAttribute("aria-label")).toBe("Scroll to top");
            expect(btn.getAttribute("aria-hidden")).toBe("true");
            expect(btn.classList.contains("scroll-to-top--visible")).toBe(false);
        });

        it("preserves an existing aria-label", () => {
            const btn = document.createElement("button");
            btn.setAttribute("aria-label", "Back to top");
            document.body.appendChild(btn);

            new ScrollToTopButton({ button: btn });
            expect(btn.getAttribute("aria-label")).toBe("Back to top");
        });

        it("is visible on construction when already scrolled past the threshold", () => {
            setScrollTop(500);
            const btn = document.createElement("button");
            document.body.appendChild(btn);

            new ScrollToTopButton({ button: btn, threshold: 300 });

            expect(btn.classList.contains("scroll-to-top--visible")).toBe(true);
            expect(btn.getAttribute("aria-hidden")).toBe("false");
        });

        it("show() and hide() toggle the visible class and aria-hidden", () => {
            const btn = document.createElement("button");
            document.body.appendChild(btn);
            const stt = new ScrollToTopButton({ button: btn });

            stt.show();
            expect(btn.classList.contains("scroll-to-top--visible")).toBe(true);
            expect(btn.getAttribute("aria-hidden")).toBe("false");

            stt.hide();
            expect(btn.classList.contains("scroll-to-top--visible")).toBe(false);
            expect(btn.getAttribute("aria-hidden")).toBe("true");
        });

        it("shows the button on a scroll event past the threshold", async () => {
            vi.useFakeTimers();
            const btn = document.createElement("button");
            document.body.appendChild(btn);
            new ScrollToTopButton({ button: btn, threshold: 300 });
            expect(btn.classList.contains("scroll-to-top--visible")).toBe(false);

            setScrollTop(500);
            window.dispatchEvent(new Event("scroll"));
            // handleScroll defers to rAF (mocked = setTimeout 16ms)
            await vi.advanceTimersByTimeAsync(20);

            expect(btn.classList.contains("scroll-to-top--visible")).toBe(true);
        });

        it("scrolls to top (smoothly) on click", async () => {
            vi.useFakeTimers();
            const btn = document.createElement("button");
            document.body.appendChild(btn);
            new ScrollToTopButton({ button: btn, smooth: true, duration: 40 });

            click(btn);
            await vi.advanceTimersByTimeAsync(200);
            expect(scrollToSpy).toHaveBeenCalled();
        });

        it("jumps to top instantly on click when smooth is false", () => {
            const btn = document.createElement("button");
            document.body.appendChild(btn);
            new ScrollToTopButton({ button: btn, smooth: false });

            click(btn);
            expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
        });

        it("prevents the default click action", () => {
            const btn = document.createElement("button");
            document.body.appendChild(btn);
            new ScrollToTopButton({ button: btn, smooth: false });

            const evt = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            btn.dispatchEvent(evt);
            expect(evt.defaultPrevented).toBe(true);
        });

        it("stops responding to scroll after destroy", async () => {
            vi.useFakeTimers();
            const btn = document.createElement("button");
            document.body.appendChild(btn);
            const stt = new ScrollToTopButton({ button: btn, threshold: 300 });

            stt.destroy();

            setScrollTop(800);
            window.dispatchEvent(new Event("scroll"));
            await vi.advanceTimersByTimeAsync(20);
            expect(btn.classList.contains("scroll-to-top--visible")).toBe(false);
        });

        describe("static init()", () => {
            it("creates a button for each data-ss='scroll-to-top' element", () => {
                document.body.innerHTML = `
                    <button data-ss="scroll-to-top" data-ss-scroll-threshold="250">up</button>
                    <button data-ss="scroll-to-top">up2</button>
                `;
                const buttons = ScrollToTopButton.init();

                expect(buttons).toHaveLength(2);
                // init() runs on each: aria attributes get applied
                document
                    .querySelectorAll('[data-ss="scroll-to-top"]')
                    .forEach((el) => {
                        expect(el.getAttribute("aria-label")).toBe(
                            "Scroll to top",
                        );
                    });
            });

            it("returns an empty array when there are no buttons", () => {
                expect(ScrollToTopButton.init()).toEqual([]);
            });
        });
    });

    // ------------------------------------------------------------------
    // initScrollLinks()
    // ------------------------------------------------------------------
    describe("initScrollLinks", () => {
        it("scrolls to the data-ss-scroll-target on click", async () => {
            vi.useFakeTimers();
            document.body.innerHTML = `
                <a id="lnk" data-ss="scroll-to" data-ss-scroll-target="#dest">go</a>
                <div id="dest"></div>
            `;
            initScrollLinks();

            const link = document.getElementById("lnk")!;
            const evt = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
            });
            link.dispatchEvent(evt);

            expect(evt.defaultPrevented).toBe(true);
            await vi.advanceTimersByTimeAsync(600);
            expect(scrollToSpy).toHaveBeenCalled();
        });

        it("falls back to href when no data-ss-scroll-target is set", async () => {
            vi.useFakeTimers();
            document.body.innerHTML = `
                <a id="lnk" data-ss="scroll-to" href="#dest">go</a>
                <div id="dest"></div>
            `;
            initScrollLinks();

            click(document.getElementById("lnk")!);
            await vi.advanceTimersByTimeAsync(600);
            expect(scrollToSpy).toHaveBeenCalled();
        });
    });

    // ------------------------------------------------------------------
    // initScrollUtilities() + default export
    // ------------------------------------------------------------------
    describe("initScrollUtilities", () => {
        it("wires up both scroll links and scroll-to-top buttons", async () => {
            vi.useFakeTimers();
            document.body.innerHTML = `
                <button id="top" data-ss="scroll-to-top">up</button>
                <a id="lnk" data-ss="scroll-to" data-ss-scroll-target="#dest">go</a>
                <div id="dest"></div>
            `;

            initScrollUtilities();

            // scroll-to-top button was initialised (aria applied)
            const topBtn = document.getElementById("top")!;
            expect(topBtn.getAttribute("aria-label")).toBe("Scroll to top");

            // scroll link is wired
            click(document.getElementById("lnk")!);
            await vi.advanceTimersByTimeAsync(600);
            expect(scrollToSpy).toHaveBeenCalled();
        });
    });

    describe("default export", () => {
        it("exposes all public helpers", () => {
            expect(scrollDefault.scrollTo).toBe(scrollTo);
            expect(scrollDefault.scrollToPosition).toBe(scrollToPosition);
            expect(scrollDefault.scrollToTop).toBe(scrollToTop);
            expect(scrollDefault.scrollToBottom).toBe(scrollToBottom);
            expect(scrollDefault.ScrollToTopButton).toBe(ScrollToTopButton);
            expect(scrollDefault.initScrollLinks).toBe(initScrollLinks);
            expect(scrollDefault.initScrollUtilities).toBe(initScrollUtilities);
        });
    });
});
